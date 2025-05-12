import React, { useState } from 'react';
import apiRequest from '@/lib/axios';
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/router';
import AvailabilityCalendar from '@/app/components/campsite/AvailabilityCalendar';
import ReviewList from '@/app/components/campsite/Review';
import ImageCarousel from '@/app/components/campsite/ImageCarousel';
import Navbar from '@/app/components/Navbar';
import { formatUSD } from '@/utils/currency_formatter';
import MapButton from '@/app/components/campsite/GMapsGoToButton';
import Link from 'next/link';
import { CampsiteI } from '@/app/Interfaces';


const SiteDetails: React.FC = () => {
    const { token } = useAppContext() as { token: string };
    const router = useRouter();
    const { id: siteId } = router.query;

    const [formData, setFormData] = useState<{ check_in_date: string | null; check_out_date: string | null; number_of_guests: number | null }>({
        check_in_date: null,
        check_out_date: null,
        number_of_guests: null
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['campsite', siteId, token],
        queryFn: async () => {
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
            const { data } = await apiRequest.get(`campsites/${siteId}`);
            return data as CampsiteI;
        },
        enabled: !!token && !!siteId, // Only fetch if token and siteId exist,
    });

    const campsite = data as CampsiteI | undefined;

    if (isLoading) {
        return <div className="mt-10 text-center text-gray-500">Loading...</div>;
    };

    if (isError) {
        return <div className="mt-10 text-center text-red-500">Error loading campsite details. Please try again later.</div>;
    };

    if (campsite) {
        const {id, site_number, description, coordinates:location, price_per_night, max_occupancy, available, images, reviews } = campsite;

        return (
            <div className='flex h-full flex-col'>
                <div className='flex flex-col gap-4 lg:flex-row'>
                    {/* Calendar Section */}
                    <div className="w-full lg:w-1/2 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-2xl font-semibold text-gray-800">Select Your Dates</h3>
                        <AvailabilityCalendar
                            price_per_night={data?.price_per_night}
                            siteInfo={{
                                id: siteId,
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
                            <h2 className="mb-4 text-3xl font-bold text-gray-800">{site_number}</h2>
                            <Link href={`/campsites/${id}/edit`} className='px-3 py-2 bg-blue-500 rounded-lg'>Edit Site Info</Link>
                            <p className="mb-6 text-lg text-gray-700">{description}</p>
                            <div className="space-y-2">
                                <p className="text-gray-800"><strong>Location:</strong> {location}</p>
                                <MapButton longitude={location.split(",")[1]} latitude={location.split(",")[0]} label='Get Directions'/>
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
                        <ReviewList reviews={reviews} siteId={siteId}  />
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
