import { useState } from "react";
import Layout from "../../components/common/Layout";
import Modal from "../../components/common/Modal";
import AppointmentForm from "../../components/forms/AppointmentForm";
import useAppointments from "../../hooks/useAppointments";
import { getCollection } from "../../firebase/firestore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const statusColors = {
    pending: "bg-yellow-50 text-yellow-600",
    confirmed: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

const DailySchedule = () => {
    const { appointments, loading, updateAppointment, deleteAppointment } = useAppointments();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [editAppt, setEditAppt] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchMeta = async () => {
            const p = await getCollection("patients");
            const u = await getCollection("users");
            setPatients(p);
            setDoctors(u.filter((x) => x.role === "doctor"));
        };
        fetchMeta();
    }, []);

    const getPatientName = (id) => patients.find((p) => p.id === id)?.name || "Unknown";
    const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name || "Unknown";

    const filtered = appointments.filter((a) => a.date === selectedDate);

    const handleStatusChange = async (id, status) => {
        try {
            await updateAppointment(id, { status });
            toast.success("Status updated!");
        } catch {
            toast.error("Failed to update");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Cancel this appointment?")) return;
        try {
            await deleteAppointment(id);
            toast.success("Appointment cancelled");
        } catch {
            toast.error("Failed to cancel");
        }
    };

    const handleUpdate = async (formData) => {
        setUpdating(true);
        try {
            await updateAppointment(editAppt.id, formData);
            toast.success("Appointment updated!");
            setEditAppt(null);
        } catch {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Layout title="Daily Schedule">
            <div className="mt-4 text-black">

                {/* Date Picker */}
                <div className="flex items-center gap-4 mb-6">
                    <label className="text-sm font-medium text-slate-700">Select Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-500">{filtered.length} appointment(s)</span>
                </div>

                {/* Appointments */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No appointments for this date</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["Time", "Patient", "Doctor", "Notes", "Status", "Actions"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered
                                    .sort((a, b) => a.time?.localeCompare(b.time))
                                    .map((appt) => (
                                        <tr key={appt.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-800">{appt.time}</td>
                                            <td className="px-6 py-4 text-slate-700">{getPatientName(appt.patientId)}</td>
                                            <td className="px-6 py-4 text-slate-700">{getDoctorName(appt.doctorId)}</td>
                                            <td className="px-6 py-4 text-slate-500">{appt.notes || "—"}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={appt.status}
                                                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[appt.status]}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditAppt(appt)}
                                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(appt.id)}
                                                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {editAppt && (
                <Modal title="Edit Appointment" onClose={() => setEditAppt(null)}>
                    <AppointmentForm
                        initial={editAppt}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditAppt(null)}
                        loading={updating}
                    />
                </Modal>
            )}
        </Layout>
    );
};

export default DailySchedule;