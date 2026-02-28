import { useState, useEffect } from "react";
import { getCollection, addDocument, updateDocument, deleteDocument } from "../firebase/firestore";

const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        setLoading(true);
        const data = await getCollection("appointments");
        setAppointments(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const addAppointment = async (data) => {
        const id = await addDocument("appointments", data);
        await fetchAppointments();
        return id;
    };

    const updateAppointment = async (id, data) => {
        await updateDocument("appointments", id, data);
        await fetchAppointments();
    };

    const deleteAppointment = async (id) => {
        await deleteDocument("appointments", id);
        await fetchAppointments();
    };

    return { appointments, loading, addAppointment, updateAppointment, deleteAppointment, fetchAppointments };
};

export default useAppointments;