import Property, { PropertyPost } from '@/interfaces/Interface';

export interface AddListingsProps {
  page?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AmenitiesDisplayinterface {
  data: string[];
  type: string;
}

export interface FileUploaderprops {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PropertyDetailsForminteface {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

export interface PropertyLocationProps {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

export interface PropertyReviewProps {
  data: any;
}

interface Step {
  id: number;
  label: string;
  status: 'inProgress' | 'pending' | 'complete';
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export interface ReviewProps {
  handleBack: () => void;
  page?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

export interface VerificationFormprops {
  handleNext: () => void;
  handleBack: () => void;
  page?: string;
}

export interface ItemGridProps {
  data: string[];
  title: string;
  type: 'amenities' | 'furnishing';
  itemsPerRow?: number;
  maxRows?: number;
}

export interface MapCardProps {
  propertyData?: PropertyPost;
}

export interface ProfileCardProps {
  propertyData?: PropertyPost;
  name?: string;
  rating?: number;
  listingCount?: number;
  totalDeals?: number;
  memberSince?: string;
  postedDate?: string;
  phoneNumber?: string;
  email?: string;
  showContact?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface PropertyCardProps {
  property: Property;
  iscreate?: boolean;
  loadImage: (url: string) => Promise<string>;
}

export interface PropertyHighlightprops {
  propertyData: PropertyPost;
}

export interface ScalableImageCardProps {
  name: string;
  imageUrl: string;
  className?: string;
}

export interface AboutPropertyProps {
  propertyData: PropertyPost;
}

export interface HeaderContainerprops {
  propertyData: PropertyPost;
}

export interface LeadformProps {
  onSubmit: (formdata: FormData) => void;
  propertyData: PropertyPost | undefined;
}

export interface Overviewprops {
  propertyData: PropertyPost;
}

export interface PropertyHighlightsprops {
  propertyData: PropertyPost;
}

export interface ImageGalleryprops {
  propertyData: PropertyPost;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface MapLocationDisplayProps {
  location: Location;
}

export interface MapLocationSelectorProps {
  onLocationSave: (location: Location) => void;
  initialLocation?: Location | null;
}

export interface ProfileFormInterface {
  page?: string;
}

export interface PropertyFiltersProps {
  onViewChange: (view: string) => void;
}

interface Checkpoint {
  label: string;
  placement: number;
}

export interface ProgressBarProps {
  checkpoints: Checkpoint[];
  currentpage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  page: string;
}

export interface UserMenuProps {
  user: {
    email: string;
    image?: string;
  };
}

export interface User {
  userid: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
  phoneNumber?: string;
  name?: string;
}

export interface AuthContextType {
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
}
