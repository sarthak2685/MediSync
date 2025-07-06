import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Landing from './component/pages/Landing';
import Dashboard from "./component/Admin/Dashboard";
import AdminUser from './component/Admin/AdminUser';
import AdminDoctor from './component/Admin/AdminDoctor';
import AdminReport from './component/Admin/AdminReport';
import DoctorManagement from './component/Admin/DoctorMangement';
import DoctorDashboard from './component/Doctor/Dashboard';
import DoctorProfile from './component/Doctor/Profile';
import DoctorSchedule from './component/Doctor/Schedule';
import DoctorAppointments from './component/Doctor/Appointment';
import DoctorPrescriptions from './component/Doctor/Prescription';
import PatientHistory from './component/Doctor/PatientHistory';
import BookAppointment from './component/patient/BookAppointment';
import MyAppointments from './component/patient/MyAppointment';
import PatientProfile from './component/patient/PatientProfile';
import Prescriptions from './component/patient/Prescriptions';
import Documents from './component/patient/Documents';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<AdminUser />} />
      <Route path="/admin/appointments" element={<AdminDoctor />} />
      <Route path="/admin/reports" element={<AdminReport />} />
      <Route path="/admin/doctors" element={<DoctorManagement />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/doctor/schedule" element={<DoctorSchedule />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
      <Route path="/doctor/history" element={<PatientHistory />} />
      <Route path="/patient/book-appointment" element={<BookAppointment />} />
      <Route path="/patient/appointment" element={<MyAppointments />} />
      <Route path="/patient/profile" element={<PatientProfile />} />
      <Route path="/patient/prescriptions" element={<Prescriptions />} />
      <Route path="/patient/documents" element={<Documents />} />



    </Routes>
  );
};

export default App;
