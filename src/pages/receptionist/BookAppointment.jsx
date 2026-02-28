import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/common/Layout";
import AppointmentForm from "../../components/forms/AppointmentForm";
import useAppointments from "../../hooks/useAppointments";
import toast from "react-hot-toast";

const BookAppointment = () => {
    const { addAppointment } = useAppointments();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await addAppointment(formData);
            toast.success("Appointment booked successfully!");
            navigate("/receptionist/schedule");
        } catch {
            toast.error("Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Book Appointment">
            <div className="max-w-3xl mx-auto mt-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-base font-semibold text-slate-700 mb-6">Appointment Details</h3>
                    <AppointmentForm
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/receptionist")}
                        loading={loading}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default BookAppointment;