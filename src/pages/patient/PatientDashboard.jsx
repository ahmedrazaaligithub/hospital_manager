import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ appointments: 0, prescriptions: 0, completed: 0, pending: 0 });
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const [patients, appointments, prescriptions] = await Promise.all([
                getCollection("patients"),
                getCollection("appointments"),
                getCollection("prescriptions"),
            ]);
            const match = patients.find((p) => p.email === user.email);
            if (!match) return;
            setPatientId(match.id);
            const myAppts = appointments.filter((a) => a.patientId === match.id);
            const myRx = prescriptions.filter((p) => p.patientId === match.id);
            setStats({
                appointments: myAppts.length,
                prescriptions: myRx.length,
                completed: myAppts.filter((a) => a.status === "completed").length,
                pending: myAppts.filter((a) => a.status === "pending").length,
            });
        };
        fetch();
    }, [user]);

    return (
        <Layout title="Patient Dashboard">
            <div className="mt-4 space-y-6">
                {!patientId && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-700">
                        ⚠️ Your patient profile is not linked yet. Please contact the receptionist to register your profile with your email.
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Appointments", value: stats.appointments, icon: "📅", color: "bg-blue-50 text-blue-600" },
                        { label: "Prescriptions", value: stats.prescriptions, icon: "💊", color: "bg-green-50 text-green-600" },
                        { label: "Completed Visits", value: stats.completed, icon: "✅", color: "bg-purple-50 text-purple-600" },
                        { label: "Pending", value: stats.pending, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
                                {s.icon}
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: "My Appointments", path: "/patient/appointments" },
                            { label: "Prescriptions", path: "/patient/prescriptions" },
                            { label: "Medical History", path: "/patient/history" },
                        ].map((a) => (
                            <button key={a.label} onClick={() => navigate(a.path)}
                                className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-sm font-medium transition">
                                {a.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PatientDashboard;