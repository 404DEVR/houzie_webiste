import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export default interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  mainImage: string;
  security: number;
  brokerage: number;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  availableFrom: string;
}

export interface Location {
  lat: number | null;
  lng: number | null;
}

export interface PropertyLocationState {
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Item {
  label: string;
  value: string;
  url: string;
}

export interface PropertyPost {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  mainImage: string;
  photos: string[];
  isActive: boolean;
  views: number;
  isPreoccupied: boolean;
  price: number;
  security: number;
  brokerage: number;
  isNegotiable: boolean;
  lockInPeriod: string;
  availableFrom: string;
  configuration: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floorNumber: string;
  totalFloors: number;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  roomType: string;
  sharingType: string;
  unitsAvailable: number;
  roomSize: number;
  amenities: string[];
  features: string[];
  furnishing: string;
  furnishingExtras: any[];
  preferredTenant: string;
  locationId: string;
  brokerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  broker: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
}

export interface Stats {
  inActiveListings: number;
  inActiveLeads: number;
  activeListings: number;
  activeLeads: number;
}

export interface PropertyFeature {
  icon: LucideIcon;
  label: string;
}

export interface FinancialDetails {
  icon: LucideIcon;
  label: string;
  amount: string;
}

export interface PropertyFeature {
  icon: LucideIcon;
  label: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string;
  alternatePhone: string | null;
  isActive: boolean;
  budgetMin: number;
  budgetMax: number;
  preferredLocations: string[];
  propertyTypes: string[];
  requirements: string | null;
  note: string;
  listingId: string | null;
  brokerId: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardsInterface {
  title: string;
  value: string;
  trendStatus: string;
  trend: string;
  icon: ReactNode;
  trendColor: string;
}

export interface CardData {
  title: string;
  value: string;
  trendStatus: 'up' | 'down';
  trend: string;
  icon: React.ReactNode;
  trendColor: string;
}

export interface ApiData {
  activeListings: number;
  inActiveListings: number;
  activeLeads: number;
  inActiveLeads: number;
}

export interface CityCard {
  name: string;
  imageUrl: string;
}

export interface PropertyFeature {
  icon: LucideIcon;
  label: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  brokerId: string;
  isActive: boolean;
  photos: string[];
  mainImage: string;
  bathrooms: number | null;
  bedrooms: number | null;
  balconies: number | null;
  propertyType: string;
  views: number;
  price: number;
  security: number;
  brokerage: number;
  isNegotiable: boolean;
  lockInPeriod: string;
  availableFrom: string;
  configuration: string;
  floorNumber: string;
  totalFloors: number | null;
  maintenanceCharges: number;
  isMaintenanceIncluded: boolean;
  roomType: string | null;
  sharingType: string | null;
  unitsAvailable: string | null;
  roomSize: string | null;
  amenities: string[];
  features: string[];
  furnishing: string | null;
  furnishingExtras: string[];
  preferredTenant: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  role: string;
  aadharNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyType {
  id: string;
  label: string;
  description: string;
}

export interface ConfigType {
  id: string;
  label: string;
}

export interface SharingType {
  id: string;
  label: string;
}

export interface PropertyFeature {
  icon: LucideIcon;
  label: string;
}

export interface FinancialDetail {
  icon: LucideIcon;
  label: string;
  amount: string;
}

export interface SavedSearch {
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

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
