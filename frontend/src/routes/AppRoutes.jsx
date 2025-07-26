import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Customers from '../pages/dashboard/Customers';
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import ResetPassword from '../pages/auth/ResetPassword';
import Profile from '../pages/dashboard/Profile';
import ForgotPassword from '../pages/auth/ForgotPassword';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/users" element={<Customers />} />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
    );
}
