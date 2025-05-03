import React from 'react';
import ImageCarousel from './ImageCarousel';
import Link from 'next/link';
import { Campground,CampSite } from '@/app/Interfaces';
import { formatUSD } from '@/utils/currency_formatter';

interface CampsiteListProps {
    campgrounds: Campground;
}

const CampsiteList: React.FC<CampsiteListProps> = ({ campgrounds }) => {
   
     const { data: sites, isLoading, isError } = campgrounds
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
      return <div>There was an error...</div>;
  }
            
    return (
        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
          {
          sites?.map((site) => (
          <div key={site.id}>
            <SiteCard 
                site={site}
            />
    
            </div>
            ))
        }
        </div>
    );
};

export default CampsiteList;


interface SiteCardProps {
    site: CampSite;
}

export const SiteCard: React.FC<SiteCardProps> = ({
   site
}) => {
    return (
<div key={site.id} className="site-card">
    <div className="relative h-48 w-full">
        <ImageCarousel images={site.images} altText={site.site_number} />
    </div>
    <Link href={`/campsite/${site.id}`}>
        <div className="mt-4"></div>
        <div className="site-card-text text-xl font-bold">Site #{site.site_number}</div>
        <p className="site-card-text h-12 truncate">{site.description}</p>
        <p className="site-card-text"><strong>Location:</strong> {site.coordinates}</p>
        <p className="site-card-text"><strong>Price per night:</strong> {formatUSD(site.price_per_night)}</p>
        <p className="site-card-text"><strong>Max Occupancy:</strong> {site.max_occupancy}</p>
        <p className="site-card-text"><strong>Available:</strong> {site.available ? 'Yes' : 'No'}</p>
 <div className='min-h-14 mt-4 flex flex-wrap gap-2 rounded-lg bg-gray-100 p-2'>
            {
            site.amenities.map(({ name, id }) => (
                <div 
                    key={id}
                    className='flex items-center overflow-scroll rounded-lg border bg-blue-500/90 p-1 text-white transition duration-300 hover:bg-blue-600'
                >
                    <span className="mr-1">
                        {/* Replace with appropriate icons */}
                        <i className={`icon-${name.toLowerCase()}`}></i> 
                    </span>
                    {name}
                </div>
            )
          )
          }
        </div>
    </Link>
</div>
    
    );
};
