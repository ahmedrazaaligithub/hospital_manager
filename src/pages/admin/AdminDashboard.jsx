import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, prescriptions: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const [patients, users, appointments, prescriptions] = await Promise.all([
                getCollection("patients"),
                getCollection("users"),
                getCollection("appointments"),
                getCollection("prescriptions"),
            ]);
            setStats({
                patients: patients.length,
                doctors: users.filter((u) => u.role === "doctor").length,
                appointments: appointments.length,
                prescriptions: prescriptions.length,
            });
        };
        fetch();
    }, []);

    return (
        <Layout title="Admin Dashboard">
            <div className="mt-4 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Patients", value: stats.patients, icon: "🧑‍🤝‍🧑", color: "bg-blue-50 text-blue-600", path: null },
                        { label: "Total Doctors", value: stats.doctors, icon: "👨‍⚕️", color: "bg-green-50 text-green-600", path: "/admin/doctors" },
                        { label: "Appointments", value: stats.appointments, icon: "📅", color: "bg-yellow-50 text-yellow-600", path: null },
                        { label: "Prescriptions", value: stats.prescriptions, icon: "💊", color: "bg-purple-50 text-purple-600", path: null },
                    ].map((s) => (
                        <div
                            key={s.label}
                            onClick={() => s.path && navigate(s.path)}
                            className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${s.path ? "cursor-pointer hover:shadow-md transition" : ""}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
                                {s.icon}
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-2">Quick Actions</h3>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: "Manage Doctors", path: "/admin/doctors" },
                            { label: "Manage Receptionists", path: "/admin/receptionists" },
                            { label: "View Analytics", path: "/admin/analytics" },
                            { label: "Subscription Plans", path: "/admin/plans" },
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

export default AdminDashboard;