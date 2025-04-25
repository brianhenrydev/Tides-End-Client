import React from 'react';
import CampSiteList from "@/app/components/CampsiteList"
import { useAppContext } from '@/context/AppContext';
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios"
import Navbar from '@/app/components/Navbar';

const HomePage = () => {
    const { token } = useAppContext() as { token: string };
    const query = useQuery({
        queryKey: ['campgrounds', token],
        queryFn: async () => { 
            apiRequest.defaults.headers.common['Authorization'] = `Token${token}`;
            const {data: campsites} = await apiRequest.get('campsites')
            return campsites;
        },
        enabled: !!token, // Only fetch if token exists
        onError: (error: any) => {
          const authRoutes = ['/login', '/register'];
          if (!authRoutes.includes(router.pathname)) {
            window.alert("There has been an issue retrieving your user profile.");
          }
        }
      });
    return (
        <div className='bg-black-100 flex flex-col items-center justify-center'>
            <h1 className=''></h1>
            <p className='text-xl'></p>
            <div className='mt-8'>
                <div className='flex justify-end pr-2'>
                </div>
                <CampSiteList campgrounds={query} />
            </div>
        </div>
    );
};
HomePage.getLayout = function getLayout(page) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-grow'>{page}</main>
        </div>
    );
}


export default HomePage;
