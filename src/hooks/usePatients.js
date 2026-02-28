import { useState, useEffect } from "react";
import { getCollection, addDocument, updateDocument, deleteDocument } from "../firebase/firestore";

const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        setLoading(true);
        const data = await getCollection("patients");
        setPatients(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const addPatient = async (data) => {
        const id = await addDocument("patients", data);
        await fetchPatients();
        return id;
    };

    const updatePatient = async (id, data) => {
        await updateDocument("patients", id, data);
        await fetchPatients();
    };

    const deletePatient = async (id) => {
        await deleteDocument("patients", id);
        await fetchPatients();
    };

    return { patients, loading, addPatient, updatePatient, deletePatient, fetchPatients };
};

export default usePatients;