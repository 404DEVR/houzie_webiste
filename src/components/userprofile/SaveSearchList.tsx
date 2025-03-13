'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { SavedSearch } from '@/interfaces/Interface';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SaveSearchList = () => {
  const { auth } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      const parsedSearches = JSON.parse(storedSearches);
      const userSearches = parsedSearches.filter(
        (search: SavedSearch) => search.userId === auth?.userid
      );
      setSavedSearches(userSearches);
      console.log(userSearches);
    }
  }, [auth?.userid]);

  const handleDeleteSearch = (id: string) => {
    const updatedSearches = savedSearches.filter((search) => search.id !== id);
    const allSearches = JSON.parse(
      localStorage.getItem('savedSearches') || '[]'
    );
    const filteredAllSearches = allSearches.filter(
      (search: SavedSearch) => search.id !== id
    );
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(filteredAllSearches));
  };

  const formatRentRange = (min = 0, max = 0) => {
    if (min === 0 && max === 0) return 'Any';
    if (min === 0) return `Up to ₹ ${max}`;
    if (max === 0) return `₹ ${min}+`;
    return `₹ ${min} - ₹ ${max}`;
  };

  const handleEditSearch = (id) => {
    console.log(`Editing search with ID: ${id}`);
    // Add edit logic here
  };

  const handleViewNewListings = (id) => {
    console.log(`Viewing new listings for search ID: ${id}`);
    // Add navigation logic here
  };

  const toggleExpandCard = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const transformString = (str: string | null | undefined) => {
    if (!str) return '';
    // Replace underscores with spaces and convert to title case
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-4'>Saved Searches</h2>
      <div className='space-y-6'>
        {savedSearches.map((search) => (
          <motion.div
            key={search.id}
            layout
            className='bg-[#eff6ff] shadow-md rounded-lg overflow-hidden'
          >
            <Card className='flex flex-col sm:flex-row rounded-b-none justify-between bg-[#eff6ff] border-none items-start sm:items-center py-4 px-12'>
              {/* Left Section */}
              <div className='sm:w-1/3'>
                <h1 className='text-2xl font-semibold'>
                  {search.searchData?.location || 'Unknown Location'}
                </h1>
                <p className='text-xs text-gray-500'>
                  Saved on:{' '}
                  {new Date(search.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>

              {/* Middle Section */}
              <div className='sm:w-1/3 flex flex-col text-center items-center justify-center text-sm text-gray-600 space-y-1'>
                <div className='flex flex-col items-start justify-center'>
                  <h1 className='text-lg text-black font-semibold'>
                    Filters Applied
                  </h1>
                  <p>
                    <span className='font-medium'>Price Range:</span>{' '}
                    {formatRentRange(
                      search.searchData?.minRent,
                      search.searchData?.maxRent
                    )}
                  </p>
                  {search.searchData?.propertyType && (
                    <div className='flex items-center justify-center'>
                      <span className='font-medium mr-2'>Property Type:</span>{' '}
                      <div className='flex gap-2'>
                        {search.filters?.propertyType.map((e, index) => (
                          <p key={index}>{transformString(e)}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {search.filters?.bhkType.length > 0 && (
                    <div className='flex items-center justify-center'>
                      <span className='font-medium mr-2'>Configuration:</span>{' '}
                      <div>
                        {search.filters?.bhkType.map((e, index) => (
                          <p key={index}>{transformString(e)}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant='link'
                  onClick={() => toggleExpandCard(search.id)}
                  className='text-blue-500 hover:underline text-sm'
                >
                  {expandedCardId === search.id
                    ? 'View Less...'
                    : 'View More...'}
                </Button>
              </div>

              {/* Right Section */}
              <div className='sm:w-1/3 flex h-full flex-col my-0 justify-center items-center space-y-8 space-x-2'>
                <div className='flex gap-2 w-full justify-center items-center'>
                  <Button
                    variant='outline'
                    onClick={() =>
                      console.log(`Editing search with ID: ${search.id}`)
                    }
                    className='bg-[#f5f5fa] shadow-xl text-[#60a5fa] hover:bg-[#60a5fa] hover:text-[#f5f5fa] w-[30%] px-4 font-normal py-4 rounded-lg border-none'
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteSearch(search.id)}
                    variant='outline'
                    className='bg-[#f5f5fa] shadow-xl text-[#f66659] hover:bg-[#f66659] hover:text-[#f5f5fa] w-[30%] px-4 font-normal py-4 rounded-lg border-none'
                  >
                    Delete
                  </Button>
                </div>
                <Button
                  variant='default'
                  onClick={() =>
                    console.log(
                      `Viewing new listings for search ID: ${search.id}`
                    )
                  }
                  className='bg-[#f5f5fa] shadow-xl text-[#60a5fa] hover:bg-[#60a5fa] w-[60%] hover:text-[#f5f5fa] px-4 font-normal py-4 rounded-lg border'
                >
                  View New Listings <ArrowRight className='text-[#60a5fa]' />
                </Button>
              </div>
            </Card>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedCardId === search.id && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className='px-12 py-4 bg-[#eff6ff]  border-gray-300 grid grid-cols-2 w-full'
                >
                  <div className='flex gap-2 col-span-1 items-start justify-start'>
                    <h2 className='text-lg font-semibold mb-4'>
                      Filters Applied:
                    </h2>
                    <div className='gap-x-8 gap-y-2 text-sm text-gray-600 flex flex-col'>
                      <div className='flex items-center justify-start'>
                        <span className='font-medium mr-2'>Price Range:</span>{' '}
                        {formatRentRange(
                          search.searchData?.minRent,
                          search.searchData?.maxRent
                        )}
                      </div>
                      {search.searchData?.propertyType && (
                        <div className='flex items-center justify-start'>
                          <span className='font-medium mr-2'>
                            Property Type:
                          </span>{' '}
                          <div className='flex gap-2'>
                            {search.filters?.propertyType.map((e, index) => (
                              <p key={index}>{transformString(e)}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      {search.filters?.bhkType.length > 0 && (
                        <div className='flex items-center justify-start'>
                          <span className='font-medium mr-2'>
                            Configuration:
                          </span>{' '}
                          <div className='flex gap-2'>
                            {search.filters?.bhkType.map((e, index) => (
                              <p key={index}>{transformString(e)}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      {search.filters?.radius && (
                        <div className='flex items-center justify-start'>
                          <span className='font-medium mr-2'>Radius:</span>{' '}
                          {search.filters?.radius || 'Not specified'}
                        </div>
                      )}
                      {search.filters?.availableFor && (
                        <div className='flex items-center justify-start'>
                          <span className='font-medium mr-2'>
                            Available For:
                          </span>{' '}
                          <div className='flex gap-2'>
                            {search.filters?.availableFor.map((e, index) => (
                              <p key={index}>{transformString(e)}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-span-1 '>
                    {search.filters?.furnishing.length > 0 && (
                      <p className='flex gap-2 items-start justify-center'>
                        <h2 className='text-lg font-semibold mb-4'>
                          Furnishing Selected:
                        </h2>
                        <div>
                          {search.filters?.furnishing.map((e, index) => (
                            <p key={index}>{transformString(e)}</p>
                          ))}
                        </div>
                      </p>
                    )}
                    {search.filters?.amenities.length > 0 && (
                      <p className='flex gap-2 items-start justify-center'>
                        <h2 className='text-lg font-semibold mb-4'>
                          Amenities Selected:
                        </h2>
                        <div>
                          {search.filters?.amenities.map((amenity, index) => (
                            <p key={index}>{transformString(amenity)}</p>
                          ))}
                        </div>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SaveSearchList;
