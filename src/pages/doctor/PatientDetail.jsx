import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/common/Layout";
import { getDocument, getCollection } from "../../firebase/firestore";

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const p = await getDocument("patients", id);
            const allAppts = await getCollection("appointments");
            const allRx = await getCollection("prescriptions");
            setPatient(p);
            setAppointments(allAppts.filter((a) => a.patientId === id));
            setPrescriptions(allRx.filter((r) => r.patientId === id));
            setLoading(false);
        };
        fetch();
    }, [id]);

    if (loading) return <Layout title="Patient Detail"><div className="p-8 text-center text-slate-400">Loading...</div></Layout>;
    if (!patient) return <Layout title="Patient Detail"><div className="p-8 text-center text-slate-400">Patient not found</div></Layout>;

    return (
        <Layout title="Patient Detail">
            <div className="max-w-4xl mx-auto mt-4 space-y-6">

                {/* Patient Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🧑</div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
                            <p className="text-sm text-slate-500">{patient.email || "No email"}</p>
                        </div>
                        <button
                            onClick={() => navigate("/doctor/write-prescription")}
                            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition">
                            + Write Prescription
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Age", value: patient.age },
                            { label: "Gender", value: patient.gender },
                            { label: "Blood Group", value: patient.bloodGroup || "N/A" },
                            { label: "Contact", value: patient.contact },
                        ].map((item) => (
                            <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-400">{item.label}</p>
                                <p className="font-semibold text-slate-700 mt-0.5">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    {patient.medicalNotes && (
                        <p className="mt-4 text-sm text-slate-600 bg-yellow-50 rounded-xl p-3">
                            📋 {patient.medicalNotes}
                        </p>
                    )}
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Medical History Timeline</h3>

                    {appointments.length === 0 && prescriptions.length === 0 ? (
                        <p className="text-slate-400 text-sm">No history yet</p>
                    ) : (
                        <div className="relative">
                            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            <div className="space-y-4">
                                {[
                                    ...appointments.map((a) => ({ ...a, type: "appointment" })),
                                    ...prescriptions.map((p) => ({
                                        ...p, type: "prescription",
                                        date: p.createdAt?.seconds
                                            ? new Date(p.createdAt.seconds * 1000).toISOString().split("T")[0]
                                            : "Unknown"
                                    }))
                                ].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                                    .map((event, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                            <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${event.type === "appointment" ? "bg-blue-100" : "bg-green-100"
                                                }`}>
                                                {event.type === "appointment" ? "📅" : "💊"}
                                            </div>
                                            <div className="flex-1 bg-slate-50 rounded-xl p-4">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-semibold text-slate-600 capitalize">{event.type}</span>
                                                    <span className="text-xs text-slate-400">{event.date}</span>
                                                </div>
                                                {event.type === "appointment" && (
                                                    <p className="text-sm text-slate-600">
                                                        {event.time} — <span className="capitalize">{event.status}</span>
                                                        {event.notes ? ` — ${event.notes}` : ""}
                                                    </p>
                                                )}
                                                {event.type === "prescription" && (
                                                    <p className="text-sm text-slate-600">
                                                        {event.medicines?.map((m) => m.name).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PatientDetail;