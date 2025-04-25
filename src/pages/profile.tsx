//src/pages/profile.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@/context/AppContext';
import apiRequest from '@/lib/axios';
import Navbar from '@/app/components/Navbar';
import ProfileInfo from '@/app/components/ProfileInfo';
import ProfileEditForm from '@/app/components/form/ProfileEditForm';
import { usePathname } from 'next/navigation';

  

interface Profile {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    age: number;
    phone_number: string;
    
}
const getProfile= async ( ): Promise<Profile> => {
  const token: string|null = localStorage.getItem("token")
  const {data: profile} = await apiRequest.get<Profile>('auth/profile',{
    headers:{
      Authorization: `token ${token}`
    }
  })
  return profile;
}

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const { token } = useAppContext() as { token: string };
  const pathname: string = usePathname();

    const { data: profile, isLoading, isError } = useQuery<Profile>({
        queryKey: ['profile', token],
        queryFn: getProfile,
        enabled: !!token, // Only fetch if token exists
        onError: () => {
          if (!['/login', '/register'].includes(pathname)) {
            window.alert("There has been an issue retrieving your user profile.");
          }
        }
      });
        
  const editingFalse = () => {
    setIsEditing(false)
  }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading profile</div>;
    }

    if (!isLoading && !isError && profile) {
        console.log(profile);
    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
         <div className="flex w-full max-w-6xl flex-wrap justify-center gap-8 lg:flex-nowrap lg:justify-between">
        {isEditing ? (
       <ProfileEditForm profile={profile} editing={editingFalse} /> 
        ):( 
        <ProfileInfo profile={profile} editing={() => {setIsEditing(true)}
} />
    )
    }
            </div>
    </div>
    );
}
};

Profile.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-grow'>{page}</main>
        </div>
    );
};

export default Profile;
