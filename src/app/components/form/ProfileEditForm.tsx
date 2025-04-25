import { useState } from "react";
import FormInput from "../FormInput";

const ProfileEditForm = ({profile,setEditButtonClicked}) => {
    const [tempProfile,editProfile] = useState({
        "username": profile.user?.username,
        "email": profile.user?.email,
        "first_name": profile.user?.first_name,
        "last_name": profile.user?.last_name,
        "phone_number": profile.phone_number
    })
    const handleInput = ({target:{id,value}}) => {
        editProfile({
            ...tempProfile,
            [id]: value
        })
    }
    return  (
   
            <div className="w-full max-w-lg rounded-lg bg-white p-6 text-gray-800 shadow-md">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Edit Profile</h1>
                <div className="mb-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">User Information</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        <FormInput
                            id="first_name"
                            label="first name"
                            type="text"
                            onChange={handleInput}
                            value={tempProfile.first_name}
                        />
                        <FormInput
                            id="last_name"
                            type="text"
                            label="last name"
                            onChange={handleInput}
                            value={tempProfile.last_name}
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Contact Information</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        
                        <FormInput
                            id="phone_number"
                            type="phone"
                            label="Phone Number"
                            onChange={handleInput}
                            value={tempProfile.phone_number}
                        />
                    </div>
                </div>
                <button onClick={setEditButtonClicked} className="float-right mr-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Save
              </button>
            </div>
    )
}

               
               

export default ProfileEditForm;
   
;
