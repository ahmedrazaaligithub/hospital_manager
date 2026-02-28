import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-blue-500">404</h1>
                <p className="text-slate-600 text-xl mt-4">Page not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;