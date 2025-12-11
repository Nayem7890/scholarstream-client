
const ManageUsers = () => {
    // Mock Data
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "student" },
        { id: 2, name: "Jane Admin", email: "admin@example.com", role: "admin" },
        { id: 3, name: "Moderator Mike", email: "mod@example.com", role: "moderator" },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">Manage Users<span className="text-[#a3e635]">.</span></h2>

            <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                <table className="table w-full">
                    <thead className="text-gray-400 border-b border-white/10">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                <th>{index + 1}</th>
                                <td className="font-bold text-white">{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <div className="badge badge-outline border-white/20 text-gray-300">{user.role}</div>
                                </td>
                                <td className="flex gap-2">
                                    <button className="btn btn-xs bg-[#a3e635] text-black border-none hover:bg-lime-400">Make Admin</button>
                                    <button className="btn btn-xs btn-error btn-outline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
