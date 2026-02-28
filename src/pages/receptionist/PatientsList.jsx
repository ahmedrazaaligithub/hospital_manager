import { useState } from "react";
import Layout from "../../components/common/Layout";
import Modal from "../../components/common/Modal";
import PatientForm from "../../components/forms/PatientForm";
import usePatients from "../../hooks/usePatients";
import toast from "react-hot-toast";

const PatientsList = () => {
    const { patients, loading, updatePatient, deletePatient } = usePatients();
    const [search, setSearch] = useState("");
    const [editPatient, setEditPatient] = useState(null);
    const [updating, setUpdating] = useState(false);

    const filtered = patients.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.contact?.includes(search)
    );

    const handleUpdate = async (formData) => {
        setUpdating(true);
        try {
            await updatePatient(editPatient.id, formData);
            toast.success("Patient updated!");
            setEditPatient(null);
        } catch {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this patient?")) return;
        try {
            await deletePatient(id);
            toast.success("Patient deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <Layout title="All Patients">
            <div className="mt-4">
                {/* Search */}
                <div className="mb-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or contact..."
                        className="w-full max-w-sm px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading patients...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No patients found</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["Name", "Age", "Gender", "Contact", "Blood Group", "Actions"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.age}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.gender}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.contact}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                                {p.bloodGroup || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditPatient(p)}
                                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                                                >
                                                    Delete
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

            {/* Edit Modal */}
            {editPatient && (
                <Modal title="Edit Patient" onClose={() => setEditPatient(null)}>
                    <PatientForm
                        initial={editPatient}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditPatient(null)}
                        loading={updating}
                    />
                </Modal>
            )}
        </Layout>
    );
};

export default PatientsList;