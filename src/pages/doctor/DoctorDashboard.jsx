import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ today: 0, total: 0, prescriptions: 0, patients: 0 });

    useEffect(() => {
        const fetch = async () => {
            const [appointments, prescriptions] = await Promise.all([
                getCollection("appointments"),
                getCollection("prescriptions"),
            ]);
            const myAppts = appointments.filter((a) => a.doctorId === user.uid);
            const myRx = prescriptions.filter((p) => p.doctorId === user.uid);
            const today = new Date().toISOString().split("T")[0];
            const uniquePatients = [...new Set(myAppts.map((a) => a.patientId))];
            setStats({
                today: myAppts.filter((a) => a.date === today).length,
                total: myAppts.length,
                prescriptions: myRx.length,
                patients: uniquePatients.length,
            });
        };
        fetch();
    }, [user]);

    return (
        <Layout title="Doctor Dashboard">
            <div className="mt-4 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Appointments", value: stats.today, icon: "📅", color: "bg-blue-50 text-blue-600" },
                        { label: "Total Appointments", value: stats.total, icon: "🗓️", color: "bg-green-50 text-green-600" },
                        { label: "Prescriptions Written", value: stats.prescriptions, icon: "💊", color: "bg-purple-50 text-purple-600" },
                        { label: "Unique Patients", value: stats.patients, icon: "🧑‍🤝‍🧑", color: "bg-yellow-50 text-yellow-600" },
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
                            { label: "My Appointments", path: "/doctor/appointments" },
                            { label: "Write Prescription", path: "/doctor/write-prescription" },
                            { label: "View Patients", path: "/doctor/patients" },
                            { label: "Analytics", path: "/doctor/analytics" },
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

export default DoctorDashboard;