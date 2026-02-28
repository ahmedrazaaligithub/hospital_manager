import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/common/Layout";
import PrescriptionForm from "../../components/forms/PrescriptionForm";
import usePrescriptions from "../../hooks/usePrescriptions";
import { useAuth } from "../../context/AuthContext";
import { getCollection } from "../../firebase/firestore";
import toast from "react-hot-toast";

const WritePrescription = () => {
    const { addPrescription } = usePrescriptions();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");

    useEffect(() => {
        getCollection("patients").then(setPatients);
    }, []);

    const handleSubmit = async (formData) => {
        if (!selectedPatient) { toast.error("Please select a patient"); return; }
        setLoading(true);
        try {
            await addPrescription({ ...formData, patientId: selectedPatient, doctorId: user.uid });
            toast.success("Prescription saved!");
            navigate("/doctor/appointments");
        } catch {
            toast.error("Failed to save prescription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Write Prescription">
            <div className="max-w-4xl mx-auto mt-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient *</label>
                        <select
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            className="w-full max-w-sm px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choose a patient</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <PrescriptionForm
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/doctor")}
                        loading={loading}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default WritePrescription;