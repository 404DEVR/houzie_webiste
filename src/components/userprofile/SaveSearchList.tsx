'use client';

import React, { useEffect, useState } from 'react';

interface SavedSearch {
  id: string;
  searchData: {
    location: string;
    propertyType: string[];
    configuration: string[];
    livingType: string[];
    minRent: number;
    maxRent: number;
  };
  createdAt: string;
}

const SaveSearchList = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleDeleteSearch = (id: string) => {
    const updatedSearches = savedSearches.filter((search) => search.id !== id);
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };

  const formatRentRange = (min = 0, max = 0) => {
    if (min === 0 && max === 0) return 'Any';
    if (min === 0) return `Up to ₹ ${max}`;
    if (max === 0) return `₹ ${min}+`;
    return `₹ ${min} - ₹ ${max}`;
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-4'>Saved Searches</h2>
      <div className='space-y-6'>
        {savedSearches.map((search) => (
          <div key={search.id} className='bg-white rounded-lg p-4 shadow-md'>
            <h3 className='text-lg font-semibold mb-2 text-teal-700'>
              {search.searchData?.location || 'Unknown Location'}
            </h3>
            <div className='text-sm text-gray-600 space-y-1'>
              <p>
                <span className='font-medium'>Property Type:</span>{' '}
                {search.searchData?.propertyType?.join(', ') || 'Not specified'}
              </p>
              {search.searchData?.configuration?.length > 0 && (
                <p>
                  <span className='font-medium'>Configuration:</span>{' '}
                  {search.searchData.configuration.join(', ')}
                </p>
              )}
              {search.searchData?.livingType?.length > 0 && (
                <p>
                  <span className='font-medium'>Living Type:</span>{' '}
                  {search.searchData.livingType.join(', ')}
                </p>
              )}
              <p>
                <span className='font-medium'>Rent Range:</span>{' '}
                {formatRentRange(
                  search.searchData?.minRent,
                  search.searchData?.maxRent
                )}
              </p>
              <p className='text-xs text-gray-500'>
                Created: {new Date(search.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className='mt-4 flex space-x-2'>
              <button
                className='border border-[#42A4AE] hover:bg-gray-100 text-[#42A4AE] font-semibold py-1.5 px-4 rounded-md text-sm shadow-sm'
                onClick={() => handleDeleteSearch(search.id)}
              >
                Delete Search
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaveSearchList;
