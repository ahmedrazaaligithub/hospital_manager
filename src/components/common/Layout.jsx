import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, title }) => {
    return (
        <div className="min-w-screen min-h-screen bg-slate-50">
            <Sidebar />
            <Navbar title={title} />
            <main className="ml-64 pt-16 p-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;