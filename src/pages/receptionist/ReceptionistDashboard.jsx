import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useNavigate } from "react-router-dom";

const ReceptionistDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ today: 0, total: 0, patients: 0, pending: 0 });

    useEffect(() => {
        const fetch = async () => {
            const [appointments, patients] = await Promise.all([
                getCollection("appointments"),
                getCollection("patients"),
            ]);
            const today = new Date().toISOString().split("T")[0];
            setStats({
                today: appointments.filter((a) => a.date === today).length,
                total: appointments.length,
                patients: patients.length,
                pending: appointments.filter((a) => a.status === "pending").length,
            });
        };
        fetch();
    }, []);

    return (
        <Layout title="Receptionist Dashboard">
            <div className="mt-4 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Appointments", value: stats.today, icon: "📅", color: "bg-blue-50 text-blue-600" },
                        { label: "Total Appointments", value: stats.total, icon: "🗓️", color: "bg-green-50 text-green-600" },
                        { label: "Registered Patients", value: stats.patients, icon: "🧑‍🤝‍🧑", color: "bg-purple-50 text-purple-600" },
                        { label: "Pending Confirmations", value: stats.pending, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
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
                            { label: "Register Patient", path: "/receptionist/register-patient" },
                            { label: "Book Appointment", path: "/receptionist/book-appointment" },
                            { label: "Daily Schedule", path: "/receptionist/schedule" },
                            { label: "All Patients", path: "/receptionist/patients" },
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

export default ReceptionistDashboard;