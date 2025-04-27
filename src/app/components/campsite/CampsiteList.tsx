import React from 'react';
import Image from 'next/image';
import ImageCarousel from './ImageCarousel';
import Link from 'next/link';

interface Site {
    id: number;
    site_number: string;
    description?: string;
    coordinates: string;
    price_per_night: string;
    max_occupancy: number;
    available: boolean;
    created_at: string;
    updated_at: string;
    images: Image[];
}
interface Campground {
    campgrounds: Site[];
}
interface Image {
    id: number;
    image_url: string;
    uploaded_at: string;
    campsite: number;
}


const CampsiteList: React.FC<Campground> = ({ campgrounds }) => {
   
     const { data: sites, isLoading, isError } = campgrounds
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
      return <div>There was an error...</div>;
  }
            
    return (
        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {
          sites?.map((site) => (
          <div key={site.id}>
            <SiteCard 
                id={site.id}
                site_number={site.site_number}
                coordinates={site.coordinates}
                price_per_night={site.price_per_night}
                max_occupancy={site.max_occupancy}
                available={site.available}
                images={site.images}
            />
    
            </div>
            ))
        }
        </div>
    );
};

export default CampsiteList;




const SiteCard: React.FC<Site> = ({
    id,
    site_number,
    description,
    coordinates,
    price_per_night,
    max_occupancy,
    available,
    images,
}) => {
    return (
        <div key={id} className="m-4 max-w-md rounded-lg border border-gray-300 bg-white p-4 shadow-md">
            <div className="relative h-48 w-full">
            <ImageCarousel images={images} altText={site_number} />
            </div>
            <Link href={`/campsite/${id}`} >
          
            <div className="mt-4"></div>
            <div className="text-xl font-bold text-gray-800">Site #{site_number}</div>
            <p className="text-gray-700">{description}</p>
            <p className="mt-2 text-gray-800"><strong>Location:</strong> {coordinates}</p>
            <p className="text-gray-800"><strong>Price per night:</strong> ${price_per_night}</p>
            <p className="text-gray-800"><strong>Max Occupancy:</strong> {max_occupancy}</p>
            <p className="text-gray-800"><strong>Available:</strong> {available ? 'Yes' : 'No'}</p>
            </Link>
            </div>
    
    );
};
