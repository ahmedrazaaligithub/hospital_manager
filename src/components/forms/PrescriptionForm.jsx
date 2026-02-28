import { useState } from "react";

const emptyMedicine = { name: "", dosage: "", duration: "", instructions: "" };

const PrescriptionForm = ({ onSubmit, onCancel, loading }) => {
    const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
    const [notes, setNotes] = useState("");

    const handleMedicineChange = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const addMedicine = () => setMedicines([...medicines, { ...emptyMedicine }]);
    const removeMedicine = (index) => setMedicines(medicines.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ medicines, notes });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">Medicines</h4>
                    <button type="button" onClick={addMedicine}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                        + Add Medicine
                    </button>
                </div>

                <div className="space-y-3">
                    {medicines.map((med, index) => (
                        <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl">
                            <input
                                required
                                placeholder="Medicine name"
                                value={med.name}
                                onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <input
                                required
                                placeholder="Dosage (e.g. 500mg)"
                                value={med.dosage}
                                onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <input
                                required
                                placeholder="Duration (e.g. 7 days)"
                                value={med.duration}
                                onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <div className="flex gap-2">
                                <input
                                    placeholder="Instructions"
                                    value={med.instructions}
                                    onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                                {medicines.length > 1 && (
                                    <button type="button" onClick={() => removeMedicine(index)}
                                        className="px-2 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition text-xs">
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor's Notes</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Additional instructions, follow-up date..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-3">
                <button type="submit" disabled={loading}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50">
                    {loading ? "Saving..." : "Save Prescription"}
                </button>
                <button type="button" onClick={onCancel}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default PrescriptionForm;