import { useAuth } from "../../context/AuthContext";

const Navbar = ({ title }) => {
    const { user, role } = useAuth();

    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-40">
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{user?.email}</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    );
};

export default Navbar;