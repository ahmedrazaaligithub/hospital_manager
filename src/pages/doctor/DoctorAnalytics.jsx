import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const DoctorAnalytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ today: 0, total: 0, prescriptions: 0, completed: 0 });
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [appointments, prescriptions] = await Promise.all([
                getCollection("appointments"),
                getCollection("prescriptions"),
            ]);

            const myAppts = appointments.filter((a) => a.doctorId === user.uid);
            const myRx = prescriptions.filter((p) => p.doctorId === user.uid);
            const today = new Date().toISOString().split("T")[0];

            setStats({
                today: myAppts.filter((a) => a.date === today).length,
                total: myAppts.length,
                prescriptions: myRx.length,
                completed: myAppts.filter((a) => a.status === "completed").length,
            });

            // Monthly appointments
            const monthMap = {};
            myAppts.forEach((a) => {
                if (!a.date) return;
                const month = a.date.slice(0, 7);
                monthMap[month] = (monthMap[month] || 0) + 1;
            });
            setMonthlyData(
                Object.entries(monthMap)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .slice(-6)
                    .map(([month, count]) => ({ month, count }))
            );

            // Status breakdown
            const statusMap = {};
            myAppts.forEach((a) => {
                statusMap[a.status] = (statusMap[a.status] || 0) + 1;
            });
            setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (loading) return <Layout title="My Analytics"><div className="p-8 text-center text-slate-400">Loading...</div></Layout>;

    return (
        <Layout title="My Analytics">
            <div className="mt-4 space-y-6">

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Appointments", value: stats.today, icon: "📅", color: "bg-blue-50 text-blue-600" },
                        { label: "Total Appointments", value: stats.total, icon: "🗓️", color: "bg-green-50 text-green-600" },
                        { label: "Prescriptions Written", value: stats.prescriptions, icon: "💊", color: "bg-purple-50 text-purple-600" },
                        { label: "Completed", value: stats.completed, icon: "✅", color: "bg-yellow-50 text-yellow-600" },
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Monthly Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Monthly Appointments</h3>
                        {monthlyData.length === 0 ? (
                            <p className="text-slate-400 text-sm">No data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Appointments" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Status Pie */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Appointment Status Breakdown</h3>
                        {statusData.length === 0 ? (
                            <p className="text-slate-400 text-sm">No data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default DoctorAnalytics;