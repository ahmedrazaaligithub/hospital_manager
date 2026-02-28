import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { generatePrescriptionPDF } from "../../utils/generatePDF";

const MyPrescriptions = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patientName, setPatientName] = useState("");
    const [loading, setLoading] = useState(true);
    const [patientFound, setPatientFound] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [patients, allRx, allUsers] = await Promise.all([
                getCollection("patients"),
                getCollection("prescriptions"),
                getCollection("users"),
            ]);

            const match = patients.find((p) => p.email === user.email);
            if (!match) { setPatientFound(false); setLoading(false); return; }

            setPatientName(match.name);
            setPrescriptions(allRx.filter((r) => r.patientId === match.id));
            setDoctors(allUsers.filter((u) => u.role === "doctor"));
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name || "Doctor";

    return (
        <Layout title="My Prescriptions">
            <div className="mt-4 space-y-4">
                {!patientFound ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-sm text-yellow-700">
                        ⚠️ Your patient profile is not linked. Please ask the receptionist to register your profile using your email: <strong>{user.email}</strong>
                    </div>
                ) : loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : prescriptions.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                        No prescriptions found
                    </div>
                ) : (
                    prescriptions.map((rx) => (
                        <div key={rx.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-semibold text-slate-800">{patientName}</p>
                                    <p className="text-sm text-slate-500">Dr. {getDoctorName(rx.doctorId)}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {rx.createdAt?.seconds
                                            ? new Date(rx.createdAt.seconds * 1000).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => generatePrescriptionPDF(rx, patientName, getDoctorName(rx.doctorId))}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2">
                                    📄 Download PDF
                                </button>
                            </div>

                            <table className="w-full text-sm border border-slate-100 rounded-xl overflow-hidden">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {["Medicine", "Dosage", "Duration", "Instructions"].map((h) => (
                                            <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-slate-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {rx.medicines?.map((m, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-medium text-slate-800">{m.name}</td>
                                            <td className="px-4 py-2 text-slate-600">{m.dosage}</td>
                                            <td className="px-4 py-2 text-slate-600">{m.duration}</td>
                                            <td className="px-4 py-2 text-slate-500">{m.instructions || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {rx.notes && (
                                <p className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-2">
                                    📝 {rx.notes}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
};

export default MyPrescriptions;