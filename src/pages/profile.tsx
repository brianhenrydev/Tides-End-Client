import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import apiRequest from '@/lib/axios';
import Navbar from '@/app/components/Navbar'; 
import PaymentForm from '@/app/components/payment/PaymentMethodList';
import ReservationList from '@/app/components/campsite/Reservations';
import ProfileInfo from '@/app/components/ProfileInfo';
import ProfileEditForm from '@/app/components/form/ProfileEditForm';
import { ProfileI } from '@/app/Interfaces';
import { AxiosResponse } from 'axios';


const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAppContext() as { token: string };
  
  const { data: profile, isLoading, isError } = useQuery<AxiosResponse<ProfileI>, Error>({
    queryKey: ['profile', token],
    queryFn: async () => { 
      apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
      const {data: profile} = await apiRequest.get('auth/profile');
      return profile;
    },
    enabled: !!token, // Only fetch if token exists
    onError: (error: any) => {
      const authRoutes = ['/login', '/register'];
      if (!authRoutes.includes(router.pathname)) {
        window.alert("There has been an issue retrieving your user profile.");
      }
    }
  });
    
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-medium text-red-600">Error loading profile</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Profile section - Takes up 3/5 on large screens */}
          <div className="lg:col-span-3">
            {isEditing ? (
              <ProfileEditForm profile={profile} editing={setIsEditing} />
            ) : (
              <ProfileInfo profile={profile} editing={setIsEditing} />
            )}
          </div>
          
          {/* Payment methods and reservations - Takes up 2/5 on large screens */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white/20 p-6 shadow-md">
              <PaymentForm paymentMethods={profile.payment_methods} />
            </div>
            
            <div className="rounded-lg bg-white/10 p-6 shadow-md">
              <ReservationList reservations={profile.reservation_history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.getLayout = function getLayout(page) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className='flex-grow'>{page}</main>
    </div>
  );
};

export default Profile;
