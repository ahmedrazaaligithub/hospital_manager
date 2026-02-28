import { useState, useEffect } from "react";
import { getCollection, addDocument, updateDocument, deleteDocument } from "../firebase/firestore";

const usePrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPrescriptions = async () => {
        setLoading(true);
        const data = await getCollection("prescriptions");
        setPrescriptions(data);
        setLoading(false);
    };

    useEffect(() => { fetchPrescriptions(); }, []);

    const addPrescription = async (data) => {
        const id = await addDocument("prescriptions", data);
        await fetchPrescriptions();
        return id;
    };

    return { prescriptions, loading, addPrescription, fetchPrescriptions };
};

export default usePrescriptions;