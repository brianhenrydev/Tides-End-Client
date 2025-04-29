export default function ProfileInfo({ profile, editing }) {
    return (
      <div className="w-full rounded-lg bg-white shadow-md">
        {/* Profile Header with Background */}
        <div className="rounded-t-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          {/* User Information Section */}
          <div className="mb-8">
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">User Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Username</span>
                <span className="font-medium text-gray-800">{profile.user?.username || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Email</span>
                <span className="font-medium text-gray-800">{profile.user?.email || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">First Name</span>
                <span className="font-medium text-gray-800">{profile.user?.first_name || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Last Name</span>
                <span className="font-medium text-gray-800">{profile.user?.last_name || "—"}</span>
              </div>
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div className="mb-8">
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">Contact Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Phone Number</span>
                <span className="font-medium text-gray-800">{profile.phone_number || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Age</span>
                <span className="font-medium text-gray-800">{profile.age || "—"}</span>
              </div>
            </div>
          </div>
          
          {/* Account Statistics */}
          <div className="mb-8">
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">Account Summary</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <span className="block text-2xl font-bold text-blue-600">{profile.payment_methods?.length || 0}</span>
                <span className="text-sm text-gray-600">Payment Methods</span>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <span className="block text-2xl font-bold text-green-600">{profile.reservation_history?.filter(({status})=>status === "confirmed" || "pending")?.length || 0}</span>
                <span className="text-sm text-gray-600">Reservations</span>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 text-center md:col-span-1">
                <span className="block text-2xl font-bold text-purple-600">
                  {profile.reservation_history?.filter(r => r.status === 'pending' || r.status === 'confirmed')?.length || 0}
                </span>
                <span className="text-sm text-gray-600">Upcoming Stays</span>
              </div>
            </div>
          </div>
          
          {/* Actions Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => editing(true)} 
              className="flex items-center rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
