'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type PropertyType =
  | 'House'
  | 'Builder floor'
  | 'Villa'
  | 'Co living/PG'
  | 'Preoccupied property'
  | 'Flat/apartment'
  | string;
type BHKType = '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '4+ BHK' | string;
type AvailableFor = 'All' | 'Family' | 'Bachelor' | string;
type Furnishing = 'Full Furnish' | 'Semi Furnish' | 'No Furnish' | string;
type Amenity =
  | 'Owner Free'
  | 'Pet Friendly'
  | 'Couple Friendly'
  | 'Balcony'
  | 'Wifi'
  | 'Grocery Shop'
  | 'Gym'
  | 'Car Parking'
  | '24/7 Water Supply'
  | '24/7 Security'
  | 'Club House'
  | 'High Speed Elevators'
  | string;
type Parking = '2 Wheeler' | '4 Wheeler' | string;

interface Filters {
  rent: [number, number];
  propertyType: PropertyType[];
  bhkType: BHKType[];
  availableFor: AvailableFor[];
  furnishing: Furnishing[];
  amenities: Amenity[];
  parking: Parking[];
}

interface FilterContextType {
  filters: Filters;
  updateFilters: <K extends keyof Filters>(
    filterType: K,
    value: Filters[K]
  ) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    rent: [0, 50000],
    propertyType: [],
    bhkType: [],
    availableFor: [],
    furnishing: [],
    amenities: [],
    parking: [],
  });

  const updateFilters = <K extends keyof Filters>(
    filterType: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error('useFilters must be used within FilterProvider');
  return context;
};
