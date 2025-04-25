export default function ProfileInfo({profile,editing}) {
 return (
   
            <div className="w-full max-w-lg rounded-lg bg-white p-6 text-gray-800 shadow-md">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">User Profile</h1>
                <div className="mb-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">User Information</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <p><span className="font-medium text-gray-600">Username:</span> {profile.user?.username}</p>
                        <p><span className="font-medium text-gray-600">Email:</span> {profile.user?.email}</p>
                        <p><span className="font-medium text-gray-600">First Name:</span> {profile.user?.first_name}</p>
                        <p><span className="font-medium text-gray-600">Last Name:</span> {profile.user?.last_name}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Contact Information</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <p><span className="font-medium text-gray-600">Phone Number:</span> {profile.phone_number}</p>
                    </div>
                </div>
                <button onClick={()=> editing(true)} className="float-right mr-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Edit
              </button>
            </div>
        )
}
