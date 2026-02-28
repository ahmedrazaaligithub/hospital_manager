import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import useAppointments from "../../hooks/useAppointments";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const statusColors = {
    pending: "bg-yellow-50 text-yellow-600",
    confirmed: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

const MyAppointments = () => {
    const { user } = useAuth();
    const { appointments, loading, updateAppointment } = useAppointments();
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { getCollection("patients").then(setPatients); }, []);

    const getPatientName = (id) => patients.find((p) => p.id === id)?.name || "Unknown";
    const myAppointments = appointments.filter((a) => a.doctorId === user.uid);

    return (
        <Layout title="My Appointments">
            <div className="mt-4 bg-white text-black rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : myAppointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No appointments found</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {["Date", "Time", "Patient", "Notes", "Status", "Action"].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {myAppointments.sort((a, b) => a.date?.localeCompare(b.date)).map((appt) => (
                                <tr key={appt.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-800">{appt.date}</td>
                                    <td className="px-6 py-4 text-slate-600">{appt.time}</td>
                                    <td className="px-6 py-4 text-slate-700">{getPatientName(appt.patientId)}</td>
                                    <td className="px-6 py-4 text-slate-500">{appt.notes || "—"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appt.status]}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate("/doctor/write-prescription")}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                                            Prescribe
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default MyAppointments;