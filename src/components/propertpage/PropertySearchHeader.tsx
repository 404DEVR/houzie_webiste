import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useAuth from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';

import { RootState } from '@/redux/store';

export function PropertySearchHeader() {
  const searchData = useSelector((state: RootState) => state.search);
  const { auth } = useAuth();
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [isSearchSaved, setIsSearchSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    // Check if the current search is already saved
    const isAlreadySaved = savedSearches.some(
      (search) =>
        JSON.stringify(search.searchData) === JSON.stringify(searchData)
    );
    setIsSearchSaved(isAlreadySaved);
  }, [savedSearches, searchData]);

  const handleSaveSearch = () => {
    if (!auth?.accessToken) {
      router.push('/login');
      return;
    }

    if (isSearchSaved) return;

    const newSearch = {
      searchData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
    setIsSearchSaved(true);
  };

  return (
    <div className='flex flex-col px-4 lg:flex-row items-start lg:items-center gap-3 mb-4'>
      <h2 className='text-2xl font-semibold'>
        20 Properties | Property near {searchData.location || '(location)'}
      </h2>
      <div className='flex gap-3'>
        <Button
          onClick={() => router.push('/')}
          size='custom'
          className='border-[#42A4AE] text-[#42A4AE] py-2 px-8 border rounded-xl hover:bg-accent hover:text-accent-foreground'
        >
          Edit Search
        </Button>
        <Button
          onClick={handleSaveSearch}
          size='custom'
          disabled={isSearchSaved}
          className={`py-2 px-8 rounded-xl ${
            isSearchSaved
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-[#42A4AE] text-white hover:bg-[#3a959e]'
          }`}
        >
          {isSearchSaved ? 'Search Saved' : 'Save Search'}
        </Button>
      </div>
    </div>
  );
}
