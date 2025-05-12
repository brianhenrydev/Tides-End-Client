import React, { useState, useEffect, useRef } from 'react';
import { AmenityI } from '../Interfaces';


type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amenities: AmenityI[];
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  buttonRef: React.RefObject<HTMLButtonElement>; // Reference to the filter button
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  amenities,
  selectedAmenities,
  setSelectedAmenities,
  buttonRef,
}) => {
  const [localSelectedAmenities, setLocalSelectedAmenities] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen) {
      // When modal opens, initialize local state with current selected amenities
      setLocalSelectedAmenities([...selectedAmenities]);
      
      // Position the modal below the button
      if (buttonRef.current && modalRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        
        // Set the position for the filter modal
        setPosition({
          top: buttonRect.bottom + window.scrollY + 8, // 8px gap below button
          right: window.innerWidth - buttonRect.right
        });
      }
    }
  }, [isOpen, selectedAmenities, buttonRef]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        modalRef.current && 
        !modalRef.current.contains(event.target as Node) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  const handleAmenityToggle = (amenityId: string) => {
    setLocalSelectedAmenities(prev => {
      if (prev.includes(amenityId)) {
        return prev.filter(id => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  const handleApplyFilters = () => {
    setSelectedAmenities(localSelectedAmenities);
    onClose();
  };

  const handleClearFilters = () => {
    setLocalSelectedAmenities([]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-50 shadow-lg"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      ref={modalRef}
    >
      <div className="bg-white rounded-lg p-6 w-72 md:w-96 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter by Amenities</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-h-64 overflow-y-auto mb-4">
          {amenities.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity.id}`}
                    checked={localSelectedAmenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`amenity-${amenity.id}`}>{amenity.name}</label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No amenities available</p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
