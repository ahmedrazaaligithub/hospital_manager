import { useState } from "react";

const PatientForm = ({ initial = {}, onSubmit, onCancel, loading }) => {
    const [form, setForm] = useState({
        name: initial.name || "",
        age: initial.age || "",
        gender: initial.gender || "Male",
        contact: initial.contact || "",
        bloodGroup: initial.bloodGroup || "",
        address: initial.address || "",
        medicalNotes: initial.medicalNotes || "",
    });

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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
                    <input
                        name="age"
                        type="number"
                        required
                        value={form.age}
                        onChange={handleChange}
                        placeholder="25"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact *</label>
                    <input
                        name="contact"
                        required
                        value={form.contact}
                        onChange={handleChange}
                        placeholder="03001234567"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                    <select
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                            <option key={bg}>{bg}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="City, Pakistan"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medical Notes</label>
                <textarea
                    name="medicalNotes"
                    value={form.medicalNotes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any existing conditions, allergies..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Patient"}
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

export default PatientForm;