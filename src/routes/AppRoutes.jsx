import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import NotFound from "../components/common/NotFound";
import Login from "../pages/auth/Login";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";

// Doctor pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";

// Receptionist pages
import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";

// Patient pages
import PatientDashboard from "../pages/patient/PatientDashboard";
import RegisterPatient from "../pages/receptionist/RegisterPatient";
import PatientsList from "../pages/receptionist/PatientsList";


import BookAppointment from "../pages/receptionist/BookAppointment";
import DailySchedule from "../pages/receptionist/DailySchedule";

import WritePrescription from "../pages/doctor/WritePrescription";
import MyAppointments from "../pages/doctor/MyAppointments";

import MedicalHistory from "../pages/patient/MedicalHistory";
import PatientDetail from "../pages/doctor/PatientDetail";
import DoctorPatientsList from "../pages/doctor/DoctorPatientsList";

import AdminAnalytics from "../pages/admin/AdminAnalytics";
import DoctorAnalytics from "../pages/doctor/DoctorAnalytics";

import ManageDoctors from "../pages/admin/ManageDoctors";
import ManageReceptionists from "../pages/admin/ManageReceptionists";
import SubscriptionPlans from "../pages/admin/SubscriptionPlans";

import PatientMyAppointments from "../pages/patient/MyAppointments";
import MyPrescriptions from "../pages/patient/MyPrescriptions";
// import MedicalHistory from "../pages/patient/MedicalHistory";
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminAnalytics />
                </ProtectedRoute>
            } />
            <Route path="/admin/doctors" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageDoctors />
                </ProtectedRoute>
            } />

            <Route path="/admin/receptionists" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageReceptionists />
                </ProtectedRoute>
            } />

            <Route path="/admin/plans" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <SubscriptionPlans />
                </ProtectedRoute>
            } />

            {/* Doctor */}
            <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorDashboard />
                </ProtectedRoute>
            } />
            <Route path="/doctor/appointments" element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <MyAppointments />
                </ProtectedRoute>
            } />

            <Route path="/doctor/write-prescription" element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <WritePrescription />
                </ProtectedRoute>
            } />
            <Route path="/doctor/patients" element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorPatientsList />
                </ProtectedRoute>
            } />

            <Route path="/doctor/patient/:id" element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <PatientDetail />
                </ProtectedRoute>
            } />
            <Route path="/doctor/analytics" element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorAnalytics />
                </ProtectedRoute>
            } />

            {/* Receptionist */}
            <Route path="/receptionist" element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                    <ReceptionistDashboard />
                </ProtectedRoute>
            } />
            {/* Add inside receptionist routes */}
            <Route path="/receptionist/register-patient" element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                    <RegisterPatient />
                </ProtectedRoute>
            } />

            <Route path="/receptionist/patients" element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                    <PatientsList />
                </ProtectedRoute>
            } />
            <Route path="/receptionist/book-appointment" element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                    <BookAppointment />
                </ProtectedRoute>
            } />

            <Route path="/receptionist/schedule" element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                    <DailySchedule />
                </ProtectedRoute>
            } />

            {/* Patient */}
            <Route path="/patient" element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <PatientDashboard />
                </ProtectedRoute>
            } />
            <Route path="/patient/appointments" element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <PatientMyAppointments />
                </ProtectedRoute>
            } />

            <Route path="/patient/prescriptions" element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <MyPrescriptions />
                </ProtectedRoute>
            } />

            <Route path="/patient/history" element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <MedicalHistory />
                </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;