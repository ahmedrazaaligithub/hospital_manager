import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const MedicalHistory = () => {
    const { user } = useAuth();
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientFound, setPatientFound] = useState(true);
    const [patientInfo, setPatientInfo] = useState(null);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            const [patients, appointments, prescriptions, allUsers] = await Promise.all([
                getCollection("patients"),
                getCollection("appointments"),
                getCollection("prescriptions"),
                getCollection("users"),
            ]);

            const match = patients.find((p) => p.email === user.email);
            if (!match) { setPatientFound(false); setLoading(false); return; }

            setPatientInfo(match);
            setDoctors(allUsers.filter((u) => u.role === "doctor"));

            const apptEvents = appointments
                .filter((a) => a.patientId === match.id)
                .map((a) => ({ ...a, type: "appointment" }));

            const rxEvents = prescriptions
                .filter((p) => p.patientId === match.id)
                .map((p) => ({
                    ...p,
                    type: "prescription",
                    date: p.createdAt?.seconds
                        ? new Date(p.createdAt.seconds * 1000).toISOString().split("T")[0]
                        : "Unknown",
                }));

            const all = [...apptEvents, ...rxEvents].sort((a, b) =>
                (b.date || "").localeCompare(a.date || "")
            );
            setTimeline(all);
            setLoading(false);
        };
        fetchHistory();
    }, [user]);

    const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name || "Doctor";

    return (
        <Layout title="Medical History">
            <div className="mt-4 max-w-3xl mx-auto space-y-6">

                {/* Patient Info Card */}
                {patientInfo && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🧑</div>
                            <div className="flex-1">
                                <h2 className="font-bold text-slate-800 text-lg">{patientInfo.name}</h2>
                                <p className="text-sm text-slate-500">{patientInfo.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            {[
                                { label: "Age", value: patientInfo.age },
                                { label: "Gender", value: patientInfo.gender },
                                { label: "Blood Group", value: patientInfo.bloodGroup || "N/A" },
                                { label: "Contact", value: patientInfo.contact },
                            ].map((item) => (
                                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-xs text-slate-400">{item.label}</p>
                                    <p className="font-semibold text-slate-700 mt-0.5 text-sm">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        {patientInfo.medicalNotes && (
                            <p className="mt-3 text-sm text-slate-600 bg-yellow-50 rounded-xl px-4 py-2">
                                📋 {patientInfo.medicalNotes}
                            </p>
                        )}
                    </div>
                )}

                {/* Timeline */}
                {!patientFound ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-sm text-yellow-700">
                        ⚠️ Your patient profile is not linked. Please ask the receptionist to register your profile using your email: <strong>{user.email}</strong>
                    </div>
                ) : loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : timeline.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                        No history found yet
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-6">Timeline</h3>
                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            <div className="space-y-6">
                                {timeline.map((event, index) => (
                                    <div key={index} className="relative flex gap-5">
                                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${event.type === "appointment" ? "bg-blue-100" : "bg-green-100"
                                            }`}>
                                            {event.type === "appointment" ? "📅" : "💊"}
                                        </div>

                                        <div className="flex-1 bg-slate-50 rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.type === "appointment"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-green-50 text-green-600"
                                                    }`}>
                                                    {event.type === "appointment" ? "Appointment" : "Prescription"}
                                                </span>
                                                <span className="text-xs text-slate-400">{event.date}</span>
                                            </div>

                                            {event.type === "appointment" && (
                                                <div className="space-y-1 text-sm">
                                                    <p className="text-slate-700">
                                                        <span className="font-medium">Doctor:</span> Dr. {getDoctorName(event.doctorId)}
                                                    </p>
                                                    <p className="text-slate-700">
                                                        <span className="font-medium">Time:</span> {event.time}
                                                    </p>
                                                    <p className="text-slate-700">
                                                        <span className="font-medium">Status:</span>{" "}
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${event.status === "completed" ? "bg-green-50 text-green-600" :
                                                                event.status === "confirmed" ? "bg-blue-50 text-blue-600" :
                                                                    event.status === "cancelled" ? "bg-red-50 text-red-600" :
                                                                        "bg-yellow-50 text-yellow-600"
                                                            }`}>{event.status}</span>
                                                    </p>
                                                    {event.notes && <p className="text-slate-500">📝 {event.notes}</p>}
                                                </div>
                                            )}

                                            {event.type === "prescription" && (
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-slate-700">
                                                        <span className="font-medium">Doctor:</span> Dr. {getDoctorName(event.doctorId)}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {event.medicines?.map((m, i) => (
                                                            <span key={i} className="px-2 py-1 bg-white text-slate-600 rounded-lg text-xs border border-slate-200">
                                                                💊 {m.name} — {m.dosage} — {m.duration}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {event.notes && <p className="text-slate-500 mt-1">📝 {event.notes}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MedicalHistory;