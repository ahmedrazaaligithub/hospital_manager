import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { getCollection, updateDocument } from "../../firebase/firestore";
import toast from "react-hot-toast";

const plans = ["free", "pro"];

const SubscriptionPlans = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        const data = await getCollection("users");
        setUsers(data.filter((u) => u.role !== "admin"));
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handlePlanChange = async (id, plan) => {
        try {
            await updateDocument("users", id, { subscriptionPlan: plan });
            toast.success("Plan updated!");
            fetchUsers();
        } catch {
            toast.error("Failed to update plan");
        }
    };

    return (
        <Layout title="Subscription Plans">
            <div className="mt-4 space-y-6">

                {/* Plan Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold">Free Plan</span>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>✅ Basic patient management</li>
                            <li>✅ Appointment booking</li>
                            <li>❌ AI features disabled</li>
                            <li>❌ Advanced analytics</li>
                            <li>❌ Limited to 10 patients</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl border-2 border-blue-500 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">Pro Plan</span>
                            <span className="text-xs text-blue-500 font-medium">Recommended</span>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>✅ Unlimited patients</li>
                            <li>✅ All appointment features</li>
                            <li>✅ AI features enabled</li>
                            <li>✅ Advanced analytics</li>
                            <li>✅ PDF prescriptions</li>
                        </ul>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Manage User Plans</h3>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["Name", "Email", "Role", "Current Plan", "Change Plan"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                        <td className="px-6 py-4 capitalize text-slate-600">{u.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.subscriptionPlan === "pro"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}>{u.subscriptionPlan || "free"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.subscriptionPlan || "free"}
                                                onChange={(e) => handlePlanChange(u.id, e.target.value)}
                                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {plans.map((p) => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SubscriptionPlans;