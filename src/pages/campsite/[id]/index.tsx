import React, { useState } from 'react';
import apiRequest from '@/lib/axios';
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/router';
import AvailabilityCalendar from '@/app/components/AvailabilityCalendar';
import ReviewList from '@/app/components/campsite/Review';
import ImageCarousel from '@/app/components/ImageCarousel';
import Navbar from '@/app/components/Navbar';
const SiteDetails: React.FC = () => {
    const { token } = useAppContext() as { token: string };
    const router = useRouter();
    const { id: campId } = router.query;

    interface Review {
        id: number;
        text: string;
        rating: number;
        user: unknown;
    }

    interface Campsite {
        id: number;
        name: string;
        description: string;
        location: string;
        price_per_night: number;
        max_occupancy: number;
        available: boolean;
        images: string[];
        reviews: Review[];
    }

    const [formData, setFormData] = useState<{ check_in_date: string | null; check_out_date: string | null;number_of_guests: number | null }>({
        check_in_date: null,
        check_out_date: null,
        number_of_guests: null
    
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['campsite', campId, token],
        queryFn: async () => {
            apiRequest.defaults.headers.common['Authorization'] = `Token${token}`;
            const { data: profile } = await apiRequest.get(`campsites/${campId}`);
            return profile as Campsite;
        },
        enabled: !!token && !!campId, // Only fetch if token and campId exist,
    });

    const campsite = data as Campsite | undefined;

    if (isLoading) {
        return <div className="mt-10 text-center text-gray-500">Loading...</div>;
    };

    if (isError) {
        return <div className="mt-10 text-center text-red-500">Error loading campsite details. Please try again later.</div>;
    };

    if (campsite) {
        const { name, description, location, price_per_night, max_occupancy, available, images, reviews } = campsite;

        return (
<div className='flex h-full flex-col'>
  <div className='flex flex-col gap-2.5 lg:flex-row'>
    <div className="flex-1/3 rounded-lg border border-gray-300 bg-white p-8 shadow-lg">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">Select Your Dates</h3>
      <AvailabilityCalendar
        siteId={campId as string}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
    
    <div className="flex-1/3 rounded-lg border border-gray-300 bg-white p-8 shadow-lg">
      <ImageCarousel images={images} altText={name} />
      <div className="mt-4">
        {/* Campsite Details */}
        <h2 className="mb-4 text-3xl font-bold text-gray-800">{name}</h2>
        <p className="mb-6 text-lg text-gray-700">{description}</p>
        <div className="space-y-2">
          <p className="text-gray-800"><strong>Location:</strong> {location}</p>
          <p className="text-gray-800"><strong>Price per night:</strong> ${price_per_night}</p>
          <p className="text-gray-800"><strong>Max Occupancy:</strong> {max_occupancy}</p>
          <p className="text-gray-800"><strong>Available:</strong> {available ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <div className="mt-8">
        {formData.arrival_date && formData.depart_date ? (
          <div className="rounded-lg bg-gray-100 p-4 text-center">
            <p className="text-lg font-semibold">Selected Dates:</p>
            <p>
              Check-in: <span className="font-medium">{formData.arrival_date}</span> <br />
              Check-out: <span className="font-medium">{formData.depart_date}</span>
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Please select your arrival and departure dates.
          </p>
        )}
      </div>
    </div>
  </div>

  <div className="mt-4 flex justify-center">
    <div className="h-max w-full rounded-lg border border-gray-300 bg-white p-8 shadow-lg lg:w-3/4">
      <ReviewList reviews={reviews} />
    </div>
  </div>
</div>
        );
    }

};



SiteDetails.getLayout = function getLayout(page) {
return (
          <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-grow'>{page}</main>
        </div>

  )
}

export default SiteDetails;

