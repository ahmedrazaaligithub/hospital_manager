import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebase/auth";
import { getUserRole } from "../../firebase/auth";
import { getRoleRedirect } from "../../utils/roleRedirect";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await loginUser(email.trim(), password);
            const role = await getUserRole(user.uid);
            const redirect = getRoleRedirect(role);
            toast.success("Login successful!");
            navigate(redirect);
        } catch (error) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">🏥</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Clinic SaaS</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5 text-black">
                    <div className="">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="doctor@clinic.com"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Contact your admin if you don't have an account.
                </p>
            </div>
        </div>
    );
};

export default Login;