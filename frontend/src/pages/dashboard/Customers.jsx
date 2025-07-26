import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await API.post('/users/getUserList', {
                language: 'en',
                search,
                page,
                perPage,
            });

            if (res.data?.status) {
                setUsers(res.data.data || []);
                setTotalCount(res.data.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const totalPages = Math.ceil(totalCount / perPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">👥 User List</h2>
                <input
                    type="text"
                    placeholder="🔍 Search by username..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:ring-purple-300"
                />
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full text-sm text-left bg-white">
                    <thead className="bg-purple-600 text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">First Name</th>
                            <th className="p-3">Last Name</th>
                            <th className="p-3">Username</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Gender</th>
                            <th className="p-3">Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, i) => (
                                <tr
                                    key={user._id}
                                    className={i % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-100'}
                                >
                                    <td className="p-3">{user.firstName}</td>
                                    <td className="p-3">{user.lastName}</td>
                                    <td className="p-3">{user.userName}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.address}</td>
                                    <td className="p-3 capitalize">{user.gender}</td>
                                    <td className="p-3">{user.age}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <p className="text-gray-600">Showing page {page} of {totalPages || 1} ({totalCount} users)</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
