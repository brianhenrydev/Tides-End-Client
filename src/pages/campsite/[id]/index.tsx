import React, { useState } from 'react';
import apiRequest from '@/lib/axios';
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/router';
import AvailabilityCalendar from '@/app/components/campsite/AvailabilityCalendar';
import ReviewList from '@/app/components/campsite/Review';
import ImageCarousel from '@/app/components/campsite/ImageCarousel';
import Navbar from '@/app/components/Navbar';
import { ImageInterface } from '@/app/Interfaces';
import { formatUSD } from '@/utils/currency_formatter';

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
    images: ImageInterface[];
    reviews: Review[];
}

const SiteDetails: React.FC = () => {
    const { token } = useAppContext() as { token: string };
    const router = useRouter();
    const { id: campId } = router.query;

    const [formData, setFormData] = useState<{ check_in_date: string | null; check_out_date: string | null; number_of_guests: number | null }>({
        check_in_date: null,
        check_out_date: null,
        number_of_guests: null
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['campsite', campId, token],
        queryFn: async () => {
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
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
                <div className='flex flex-col gap-4 lg:flex-row'>
                    {/* Calendar Section */}
                    <div className="w-full lg:w-1/2 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-2xl font-semibold text-gray-800">Select Your Dates</h3>
                        <AvailabilityCalendar
                            price_per_night={data?.price_per_night}
                            siteInfo={{
                                id: campId,
                                price_per_night: price_per_night,
                                number_of_guests: max_occupancy
                            }}
                            formData={formData}
                            setFormData={setFormData}
                        />
                        
                        <div className="mt-6">
                            {formData.check_in_date && formData.check_out_date ? (
                                <div className="rounded-lg bg-gray-100 p-4 text-center">
                                    <p className="text-lg font-semibold">Selected Dates:</p>
                                    <p>
                                        Check-in: <span className="font-medium">{formData.check_in_date}</span> <br />
                                        Check-out: <span className="font-medium">{formData.check_out_date}</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">
                                    Please select your arrival and departure dates.
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Campsite Details Section */}
                    <div className="w-full lg:w-1/2 rounded-lg border border-gray-300 bg-white shadow-lg">
                        {/* Image Carousel Container with controlled aspect ratio and padding */}
                        <div className="relative p-4">
                            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                                <ImageCarousel images={images} />
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {/* Campsite Details */}
                            <h2 className="mb-4 text-3xl font-bold text-gray-800">{name}</h2>
                            <p className="mb-6 text-lg text-gray-700">{description}</p>
                            <div className="space-y-2">
                                <p className="text-gray-800"><strong>Location:</strong> {location}</p>
                                <p className="text-gray-800"><strong>Price per night:</strong> {formatUSD(price_per_night)}</p>
                                <p className="text-gray-800"><strong>Max Occupancy:</strong> {max_occupancy}</p>
                                <p className="text-gray-800"><strong>Available:</strong> {available ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-6">
                    <div className="w-full rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        <ReviewList reviews={reviews} />
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
};

SiteDetails.getLayout = function getLayout(page) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-grow p-4'>{page}</main>
        </div>
    )
}

export default SiteDetails;
