import { useState } from "react";
import FormInput from "../Input";
import { CamperInterface } from "@/app/Interfaces";

interface ProfileEditFormProps {
  profile: CamperInterface;
  editing: React.Dispatch<React.SetStateAction<any>>;
}
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, editing }) => {
  const [tempProfile, editProfile] = useState<CamperInterface>({
    "username": profile.user?.username,
    "email": profile.user?.email,
    "first_name": profile.user?.first_name,
    "last_name": profile.user?.last_name,
    "phone_number": profile.phone_number
  });

  const handleInput = ({ target: { id: key, value } }) => {
    editProfile({
      ...tempProfile,
      [key]: value
    });
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-white shadow-md">
      {/* Profile Header with Background */}
      <div className="rounded-t-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
      </div>
      
      {/* Profile Content */}
      <div className="flex-grow p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-8">
            {/* User Information Section */}
            <div>
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">User Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <FormInput
                  id="username"
                  label="Username"
                  type="username"
                  onChange={handleInput}
                  value={tempProfile.username}
                />
                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  onChange={handleInput}
                  value={tempProfile.email}
                />
              </div>
            </div>
            
            {/* Contact Information Section */}
            <div>
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <FormInput
                  id="phone_number"
                  type="phone"
                  label="Phone Number"
                  onChange={handleInput}
                  value={tempProfile.phone_number}
                />
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-8">
            {/* Additional User Information */}
            <div>
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <FormInput
                  id="first_name"
                  label="First Name"
                  type="text"
                  onChange={handleInput}
                  value={tempProfile.first_name}
                />
                <FormInput
                  id="last_name"
                  type="text"
                  label="Last Name"
                  onChange={handleInput}
                  value={tempProfile.last_name}
                />
              </div>
            </div>
            
            {/* Account Information - Display Only */}
            <div>
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-700">Account Summary</h2>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-medium">Payment Methods:</span> {profile.payment_methods?.length || 0}
                </p>
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-medium">Reservations:</span> {profile.reservation_history?.length || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">User ID:</span> {profile.user?.id}
                </p>
              </div>
            </div>
          </div>
        </div>
        
            </div>
      
      {/* Actions Button */}
      <div className="rounded-b-lg border-t bg-gray-50 px-6 py-4">
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => editing(false)} 
            className="rounded bg-gray-400 px-4 py-2 text-white transition-colors hover:bg-gray-500"
          >
            Cancel
          </button>
          <button 
            onClick={() => editing(false)} 
            className="flex items-center rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
