import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection } from "../../firebase/firestore";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminAnalytics = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        totalPrescriptions: 0,
    });
    const [appointmentsByMonth, setAppointmentsByMonth] = useState([]);
    const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);
    const [topDoctors, setTopDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [patients, users, appointments, prescriptions] = await Promise.all([
                getCollection("patients"),
                getCollection("users"),
                getCollection("appointments"),
                getCollection("prescriptions"),
            ]);

            const doctors = users.filter((u) => u.role === "doctor");

            setStats({
                totalPatients: patients.length,
                totalDoctors: doctors.length,
                totalAppointments: appointments.length,
                totalPrescriptions: prescriptions.length,
            });

            // Appointments by month
            const monthMap = {};
            appointments.forEach((a) => {
                if (!a.date) return;
                const month = a.date.slice(0, 7);
                monthMap[month] = (monthMap[month] || 0) + 1;
            });
            const monthData = Object.entries(monthMap)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-6)
                .map(([month, count]) => ({ month, count }));
            setAppointmentsByMonth(monthData);

            // Appointments by status
            const statusMap = {};
            appointments.forEach((a) => {
                statusMap[a.status] = (statusMap[a.status] || 0) + 1;
            });
            setAppointmentsByStatus(
                Object.entries(statusMap).map(([name, value]) => ({ name, value }))
            );

            // Top doctors by appointment count
            const doctorApptMap = {};
            appointments.forEach((a) => {
                doctorApptMap[a.doctorId] = (doctorApptMap[a.doctorId] || 0) + 1;
            });
            const topDoctorData = doctors
                .map((d) => ({ name: d.name, appointments: doctorApptMap[d.id] || 0 }))
                .sort((a, b) => b.appointments - a.appointments)
                .slice(0, 5);
            setTopDoctors(topDoctorData);

            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <Layout title="Analytics"><div className="p-8 text-center text-slate-400">Loading analytics...</div></Layout>;

    return (
        <Layout title="Admin Analytics">
            <div className="mt-4 space-y-6">

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Patients", value: stats.totalPatients, icon: "🧑‍🤝‍🧑", color: "bg-blue-50 text-blue-600" },
                        { label: "Total Doctors", value: stats.totalDoctors, icon: "👨‍⚕️", color: "bg-green-50 text-green-600" },
                        { label: "Total Appointments", value: stats.totalAppointments, icon: "📅", color: "bg-yellow-50 text-yellow-600" },
                        { label: "Total Prescriptions", value: stats.totalPrescriptions, icon: "💊", color: "bg-purple-50 text-purple-600" },
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

                {/* Appointments by Month */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Appointments by Month</h3>
                    {appointmentsByMonth.length === 0 ? (
                        <p className="text-slate-400 text-sm">No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={appointmentsByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Appointments" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Appointments by Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Appointments by Status</h3>
                        {appointmentsByStatus.length === 0 ? (
                            <p className="text-slate-400 text-sm">No data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={appointmentsByStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {appointmentsByStatus.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Top Doctors */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Top Doctors by Appointments</h3>
                        {topDoctors.length === 0 ? (
                            <p className="text-slate-400 text-sm">No data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={topDoctors} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" tick={{ fontSize: 12 }} />
                                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                                    <Tooltip />
                                    <Bar dataKey="appointments" fill="#10b981" radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default AdminAnalytics;