import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import apiRequest from '@/lib/axios';
import Navbar from '@/app/components/Navbar'; 
import PaymentForm from '@/app/components/form/PaymentForm';
import ReservationList from '@/app/components/campsite/Reservations';
import ProfileInfo from '@/app/components/ProfileInfo';
import ProfileEditForm from '@/app/components/form/ProfileEditForm';

interface PaymentMethod {
    issuer: string;
    masked_card_number: string;
    cardholder_name: string;
    expiration_date: string;
    cvv: number;
    billing_address: string;
    is_default: boolean;
  }
  
interface Reservation {
        id: number;
        campsite: number;
        check_in_date: string;
        check_out_date: string;
        status: string;
}

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
    payment_methods: PaymentMethod[]
    reservation_history: Reservation[]
    
}

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false)
    const { token } = useAppContext() as { token: string };
    const { data: profile, isLoading, isError } = useQuery<AxiosResponse<Profile>, Error>({
        queryKey: ['profile', token],
        queryFn: async () => { 
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
            const {data: profile} = await apiRequest.get('auth/profile')
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
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading profile</div>;
    }

    if (!isLoading && !isError && profile) {
        console.log(profile);
    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
         <div className="flex flex-wrap justify-center gap-8 lg:justify-between lg:flex-nowrap w-full max-w-6xl">
        {isEditing ? (
       <ProfileEditForm profile={profile} editing={setIsEditing} /> 
        ):( 
        <ProfileInfo profile={profile} editing={setIsEditing} />
    )
    }
            </div>
            <div className="flex flex-col space-y-8 w-full max-w-lg">
         <PaymentForm paymentMethods={profile?.payment_methods} />
        <ReservationList reservations={profile?.reservation_history} />
        </div>
    </div>
    );
}
};

Profile.getLayout = function getLayout(page) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-grow'>{page}</main>
        </div>
    );
};

export default Profile;
