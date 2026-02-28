import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const statusColors = {
    pending: "bg-yellow-50 text-yellow-600",
    confirmed: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

const PatientMyAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientFound, setPatientFound] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [patients, allAppts, allUsers] = await Promise.all([
                getCollection("patients"),
                getCollection("appointments"),
                getCollection("users"),
            ]);

            const match = patients.find((p) => p.email === user.email);
            if (!match) { setPatientFound(false); setLoading(false); return; }

            const myAppts = allAppts.filter((a) => a.patientId === match.id);
            setAppointments(myAppts.sort((a, b) => b.date?.localeCompare(a.date)));
            setDoctors(allUsers.filter((u) => u.role === "doctor"));
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name || "Doctor";

    return (
        <Layout title="My Appointments">
            <div className="mt-4">
                {!patientFound ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-sm text-yellow-700">
                        ⚠️ Your patient profile is not linked. Please ask the receptionist to register your profile using your email: <strong>{user.email}</strong>
                    </div>
                ) : loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                        No appointments found
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["Date", "Time", "Doctor", "Notes", "Status"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">{appt.date}</td>
                                        <td className="px-6 py-4 text-slate-600">{appt.time}</td>
                                        <td className="px-6 py-4 text-slate-700">Dr. {getDoctorName(appt.doctorId)}</td>
                                        <td className="px-6 py-4 text-slate-500">{appt.notes || "—"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appt.status]}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PatientMyAppointments;