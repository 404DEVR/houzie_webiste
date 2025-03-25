'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type PropertyType =
  | 'BUILDER_FLOOR'
  | 'VILLA'
  | 'CO_LIVING'
  | 'PG'
  | 'PREOCCUPIED_PROPERTY'
  | 'FLAT_APARTMENT'
  | string;
type BHKType =
  | 'ONE_RK'
  | 'ONE_BHK'
  | 'TWO_BHK'
  | 'THREE_BHK'
  | 'FOUR_BHK'
  | 'FOUR_PLUS_BHK'
  | string;
type AvailableFor = 'FAMILY' | 'BACHELOR' | 'COMPANY_LEASE' | 'ANY' | string;
type Furnishing = 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'NONE' | string;
type Amenity =
  | 'WIFI'
  | 'POWER_BACKUP'
  | 'FOUR_WHEELER_PARKING'
  | 'TWO_WHEELER_PARKING'
  | 'WATER_SUPPLY_24_7'
  | 'SECURITY_24_7'
  | 'DAILY_HOUSEKEEPING'
  | 'CCTV'
  | 'MEALS'
  | 'COUPLE_FRIENDLY'
  | 'PET_FRIENDLY'
  | 'OWNER_FREE'
  | 'BALCONY'
  | 'ATTACHED_BATHROOM'
  | 'GATED_COMMUNITY'
  | string;
type Parking = 'TWO_WHEELER_PARKING' | 'FOUR_WHEELER_PARKING' | string;
type Gender = 'MALE' | 'FEMALE' | 'OTHER' | string;
type SharingType = 'SINGLE' | 'SHARED' | string;
type Features = 'COUPLE_FRIENDLY' | 'PET_FRIENDLY' | 'OWNER_FREE' | string;

export interface Filters {
  location: string;
  rent: [number, number];
  propertyType: PropertyType[];
  bhkType: BHKType[];
  availableFor: AvailableFor[];
  furnishing: Furnishing[];
  amenities: Amenity[];
  parking: Parking[];
  features: Features[];
  sharingType: SharingType[];
  gender: Gender[];
  radius: [number, number];
}

interface FilterContextType {
  filters: Filters;
  updateFilters: <K extends keyof Filters>(
    filterType: K,
    value: Filters[K]
  ) => void;
  resetFilters: () => void;
}

const initialFilters: Filters = {
  location: '',
  rent: [0, 500000],
  propertyType: [],
  bhkType: [],
  availableFor: [],
  furnishing: [],
  amenities: [],
  parking: [],
  features: [],
  sharingType: [],
  gender: [],
  radius: [0, 100],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilters = <K extends keyof Filters>(
    filterType: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, resetFilters }}>
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
