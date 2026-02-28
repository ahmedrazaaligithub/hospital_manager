import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/common/Layout";
import PatientForm from "../../components/forms/PatientForm";
import usePatients from "../../hooks/usePatients";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPatient = () => {
    const { addPatient } = usePatients();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await addPatient({ ...formData, createdBy: user.uid });
            toast.success("Patient registered successfully!");
            navigate("/receptionist");
        } catch (err) {
            toast.error("Failed to register patient");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Register New Patient">
            <div className="max-w-3xl mx-auto mt-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-base font-semibold text-slate-700 mb-6">Patient Information</h3>
                    <PatientForm
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/receptionist")}
                        loading={loading}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default RegisterPatient;