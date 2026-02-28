import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import Modal from "../../components/common/Modal";
import { getCollection, deleteDocument } from "../../firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const ManageReceptionists = () => {
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", contact: "" });

    const fetchReceptionists = async () => {
        setLoading(true);
        const users = await getCollection("users");
        setReceptionists(users.filter((u) => u.role === "receptionist"));
        setLoading(false);
    };

    useEffect(() => { fetchReceptionists(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const auth = getAuth();
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await setDoc(doc(db, "users", cred.user.uid), {
                name: form.name,
                email: form.email,
                role: "receptionist",
                contact: form.contact,
                subscriptionPlan: "pro",
                createdAt: new Date().toISOString(),
            });
            toast.success("Receptionist added!");
            setShowModal(false);
            setForm({ name: "", email: "", password: "", contact: "" });
            fetchReceptionists();
        } catch (err) {
            toast.error(err.message || "Failed to add receptionist");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this receptionist?")) return;
        try {
            await deleteDocument("users", id);
            toast.success("Receptionist removed");
            fetchReceptionists();
        } catch {
            toast.error("Failed to remove");
        }
    };

    return (
        <Layout title="Manage Receptionists">
            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-slate-500">{receptionists.length} receptionist(s) registered</p>
                    <button onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
                        + Add Receptionist
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : receptionists.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No receptionists found</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["Name", "Email", "Contact", "Actions"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {receptionists.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">{r.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{r.email}</td>
                                        <td className="px-6 py-4 text-slate-600">{r.contact || "—"}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDelete(r.id)}
                                                className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <Modal title="Add New Receptionist" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "name", placeholder: "Full Name", type: "text" },
                                { name: "email", placeholder: "Email Address", type: "email" },
                                { name: "password", placeholder: "Password", type: "password" },
                                { name: "contact", placeholder: "Contact Number", type: "text" },
                            ].map((field) => (
                                <input
                                    key={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.name !== "contact"}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={saving}
                                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50">
                                {saving ? "Adding..." : "Add Receptionist"}
                            </button>
                            <button type="button" onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </Layout>
    );
};

export default ManageReceptionists;