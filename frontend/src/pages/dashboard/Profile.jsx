import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Profile = () => {
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            const res = await API.get('/users/getUserDetail');
            setUser(res.data.data);
        } catch {
            setError('Failed to load user data.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!user.firstName || !user.lastName || !user.email) {
            setError('First name, Last name, and Email are required.');
            return;
        }

        try {
            const res = await API.put('/users/updateUserDetail', user);
            setMessage('✅ Profile updated successfully!');
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            setError(err?.response?.data?.message || '❌ Update failed.');
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 mt-8 rounded-xl shadow-lg relative animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="absolute left-4 top-4 text-gray-500 hover:text-black text-sm"
            >
                ← Back
            </button>

            <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">👤 Update Your Profile</h2>

            {error && <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded mb-4">{error}</div>}
            {message && <div className="text-green-700 bg-green-100 border border-green-300 p-3 rounded mb-4">{message}</div>}

            <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="First Name"
                            value={user.firstName || ''}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Last Name"
                            value={user.lastName || ''}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">User Name</label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="User Name"
                        value={user.userName || ''}
                        onChange={(e) => setUser({ ...user, userName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                        value={user.email || ''}
                        disabled
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Address</label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Address"
                        value={user.address || ''}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Age</label>
                        <input
                            type="number"
                            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Age"
                            value={user.age || ''}
                            onChange={(e) => setUser({ ...user, age: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Gender</label>
                        <select
                            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={user.gender || ''}
                            onChange={(e) => setUser({ ...user, gender: e.target.value })}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition duration-300"
                >
                    💾 Save Changes
                </button>
            </form>
        </div>
    );
};

export default Profile;
