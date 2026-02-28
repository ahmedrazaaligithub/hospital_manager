import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../firebase/auth";
import toast from "react-hot-toast";

const roleLinks = {
    admin: [
        { label: "Dashboard", path: "/admin", icon: "🏠" },
        { label: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️" },
        { label: "Receptionists", path: "/admin/receptionists", icon: "👩‍💼" },
        { label: "Subscription Plans", path: "/admin/plans", icon: "💳" },
        { label: "Analytics", path: "/admin/analytics", icon: "📊" },
    ],
    doctor: [
        { label: "Dashboard", path: "/doctor", icon: "🏠" },
        { label: "Appointments", path: "/doctor/appointments", icon: "📅" },
        { label: "Patients", path: "/doctor/patients", icon: "🧑‍🤝‍🧑" },
        { label: "Analytics", path: "/doctor/analytics", icon: "📊" },
    ],
    receptionist: [
        { label: "Dashboard", path: "/receptionist", icon: "🏠" },
        { label: "Register Patient", path: "/receptionist/register-patient", icon: "➕" },
        { label: "Book Appointment", path: "/receptionist/book-appointment", icon: "📅" },
        { label: "Daily Schedule", path: "/receptionist/schedule", icon: "🗓️" },
        { label: "All Patients", path: "/receptionist/patients", icon: "🧑‍🤝‍🧑" },
    ],
    patient: [
        { label: "Dashboard", path: "/patient", icon: "🏠" },
        { label: "My Appointments", path: "/patient/appointments", icon: "📅" },
        { label: "Prescriptions", path: "/patient/prescriptions", icon: "💊" },
        { label: "Medical History", path: "/patient/history", icon: "📋" },
    ],
};

const Sidebar = () => {
    const { role, user } = useAuth();
    const navigate = useNavigate();
    const links = roleLinks[role] || [];

    const handleLogout = async () => {
        await logoutUser();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">

            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-lg">
                        🏥
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">Abc Clinic</h1>
                        <p className="text-xs text-slate-400 capitalize">{role} Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === `/${role}`}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                                ? "bg-blue-500 text-white!"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white!"
                            }`
                        }
                    >
                        <span>{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info + Logout */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate">{user?.email}</p>
                        <p className="text-xs text-slate-400 capitalize">{role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500 hover:text-white transition"
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;