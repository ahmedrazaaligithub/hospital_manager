import { useState, useEffect } from "react";
import { getCollection } from "../../firebase/firestore";

const AppointmentForm = ({ initial = {}, onSubmit, onCancel, loading }) => {
    const [form, setForm] = useState({
        patientId: initial.patientId || "",
        doctorId: initial.doctorId || "",
        date: initial.date || "",
        time: initial.time || "",
        status: initial.status || "pending",
        notes: initial.notes || "",
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const allPatients = await getCollection("patients");
            const allUsers = await getCollection("users");
            setPatients(allPatients);
            setDoctors(allUsers.filter((u) => u.role === "doctor"));
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient *</label>
                    <select
                        name="patientId"
                        required
                        value={form.patientId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Patient</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Doctor *</label>
                    <select
                        name="doctorId"
                        required
                        value={form.doctorId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                    <input
                        name="date"
                        type="date"
                        required
                        value={form.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
                    <input
                        name="time"
                        type="time"
                        required
                        value={form.time}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <input
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Reason for visit..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Appointment"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AppointmentForm;