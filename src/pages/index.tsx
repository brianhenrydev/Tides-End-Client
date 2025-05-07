import React, { useState, useMemo, useRef } from 'react';
import CampSiteList from "@/app/components/campsite/CampsiteList";
import { useAppContext } from '@/context/AppContext';
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import Navbar from '@/app/components/Navbar';
import FilterModal from '@/app/components/FilterModal';
import { CampsiteInterface, AmenityInterface } from '@/app/Interfaces';



const HomePage = () => {
    const { token } = useAppContext() as { token: string };
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    // Fetch campsites data
    const query = useQuery({
        queryKey: ['campgrounds', token],
        queryFn: async () => { 
            apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
            const {data: campsites} = await apiRequest.get('campsites');
            return campsites;
        },
        enabled: !!token, // Only fetch if token exists
        onError: (error: any) => {
            window.alert("Oops...");
        },
    });

    // Extract all unique amenities from campsites
    const allAmenities = useMemo(() => {
        if (!query.data || !Array.isArray(query.data)) return [];
        
        const amenitiesSet = new Set<string>();
        const amenitiesMap = new Map<string, AmenityInterface>();
        
        query.data.forEach((campsite: CampsiteInterface) => {
            if (campsite.amenities && Array.isArray(campsite.amenities)) {
                campsite.amenities.forEach((amenity) => {
                    if (!amenitiesSet.has(amenity.id)) {
                        amenitiesSet.add(amenity.id);
                        amenitiesMap.set(amenity.id, amenity);
                    }
                });
            }
        });
        
        return Array.from(amenitiesMap.values());
    }, [query.data]);

    // Filter campsites based on selected amenities
    const filteredCampsites = useMemo(() => {
        if (!query.data || !Array.isArray(query.data) || selectedAmenities.length === 0) {
            return query.data;
        }
        
        return query.data.filter((campsite: CampsiteInterface) => {
            if (!campsite.amenities || !Array.isArray(campsite.amenities)) return false;
            
            // Check if campsite has any of the selected amenities
            return campsite.amenities.some(amenity => 
                selectedAmenities.includes(amenity.id)
            );
        });
    }, [query.data, selectedAmenities]);

    // Check if any filters are applied
    const hasActiveFilters = selectedAmenities.length > 0;

    return (
        <div className='bg-black-100 flex flex-col items-center justify-center'>
            <div className='mt-8 w-full'>
                <div className='relative mb-4 flex justify-end pr-2'>
                    <button 
                        ref={filterButtonRef}
                        onClick={() => setIsFilterModalOpen(prev => !prev)}
                        className={`flex items-center rounded-md px-4 py-2 hover:bg-gray-300 ${
                            hasActiveFilters ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        {hasActiveFilters ? `Filters (${selectedAmenities.length})` : 'Filter'}
                    </button>
                </div>
                
                {hasActiveFilters && (
                    <div className="mb-4 flex flex-wrap gap-2 px-2">
                        {selectedAmenities.map(amenityId => {
                            const amenity = allAmenities.find(a => a.id === amenityId);
                            return (
                                <div key={amenityId} className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                                    <span>{amenity ? amenity.name : amenityId}</span>
                                    <button 
                                        onClick={() => setSelectedAmenities(prev => prev.filter(id => id !== amenityId))}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                        <button 
                            onClick={() => setSelectedAmenities([])}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            Clear all
                        </button>
                    </div>
                )}
                
                <CampSiteList campgrounds={
                    {
                        ...query,
                        data: filteredCampsites || query.data 
                    }
                } />
                
                <FilterModal 
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    amenities={allAmenities}
                    selectedAmenities={selectedAmenities}
                    setSelectedAmenities={setSelectedAmenities}
                    buttonRef={filterButtonRef}
                />
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
