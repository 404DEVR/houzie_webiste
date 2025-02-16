import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface Photo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  preview: string;
}

interface PropertyDetails {
  title: string;
  description: string;
  propertyType: string;
  roomType: string;
  sharingType: string;
  units: string;
  mainImage: string;
  roomSize: string;
  roomSizeDetails: string;
  furnishingLevel: string;
  furnishings: string[];
  configuration: string;
  balcony: string;
  bathroom: string;
  amenities: string[];
  bedroom: string;
  preoccupiedPropertyType: string;
  preferredTenantType: string[];
  features: string[];
  availableFrom: string;
  totalfloor: string;
  floornumber: string;
  monthlyRent: string;
  maintenanceCharges: string;
  maintenanceChargesAmount: string;
  securityDeposit: string;
  securityDepositamount: string;
  lockInPeriodMonths: string;
  brokerageCharges: string;
  brokerageAmount: string;
  brokerageNegotiable: boolean;
}

interface PropertyLocation {
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

interface Verification {
  selectedDate: string | null;
  phoneNumber: string;
}

interface restructured {
  title: string;
  description: string;
  propertyType: string;
  location: {
    city: string;
    state: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
  price: number | null;
  security: number | null;
  brokerage: number | null;
  isNegotiable: boolean;
  lockInPeriod: string;
  availableFrom: string;
  configuration: string;
  bedrooms: number | null;
  bathrooms: number | null;
  balconies: number | null;
  floorNumber: string;
  totalFloors: number | null;
  maintenanceCharges: number | null;
  isMaintenanceIncluded: boolean;
  roomType: string;
  sharingType: string;
  unitsAvailable: number | null;
  roomSize: number | null;
  furnishing: string;
  furnishingExtras: string[];
  amenities: string[];
  features: string[];
  preferredTenant: string;
  mainImage: string;
  photos: string[];
  isPreoccupied: boolean;
}

// Define separate state interfaces
interface AddFormState {
  currentPage: number;
  propertyDetails: PropertyDetails;
  propertyLocation: PropertyLocation;
  photos: Photo[];
  verification: Verification;
  restructuredData: restructured;
}

interface EditFormState {
  currentPage: number;
  propertyDetails: PropertyDetails;
  propertyLocation: PropertyLocation;
  photos: Photo[];
  verification: Verification;
  restructuredData: restructured;
  isEditing: boolean;
  editingListingId: string | null;
}

// Define separate initial states
const initialAddFormState: AddFormState = {
  currentPage: 1,
  propertyDetails: {
    title: '',
    description: '',
    propertyType: '',
    roomType: '',
    sharingType: '',
    configuration: '',
    roomSize: '',
    roomSizeDetails: '',
    bedroom: '',
    furnishingLevel: '',
    floornumber: '',
    totalfloor: '',
    preoccupiedPropertyType: '',
    furnishings: [],
    balcony: '',
    mainImage: '',
    bathroom: '',
    amenities: [],
    units: '',
    preferredTenantType: [],
    features: [],
    availableFrom: '',
    monthlyRent: '',
    maintenanceCharges: '',
    maintenanceChargesAmount: '',
    securityDeposit: '',
    securityDepositamount: '',
    lockInPeriodMonths: '',
    brokerageCharges: '',
    brokerageAmount: '',
    brokerageNegotiable: false,
  },
  propertyLocation: {
    fullAddress: '',
    city: '',
    state: '',
    country: '',
    latitude: null,
    longitude: null,
  },
  photos: [],
  verification: {
    selectedDate: null,
    phoneNumber: '',
  },
  restructuredData: {
    title: '',
    description: '',
    propertyType: '',
    location: {
      city: '',
      state: '',
      country: '',
      latitude: null,
      longitude: null,
    },
    price: null,
    security: null,
    brokerage: null,
    isNegotiable: false,
    lockInPeriod: '',
    availableFrom: '',
    configuration: '',
    bedrooms: null,
    bathrooms: null,
    balconies: null,
    floorNumber: '',
    totalFloors: null,
    maintenanceCharges: null,
    isMaintenanceIncluded: false,
    roomType: '',
    sharingType: '',
    unitsAvailable: null,
    roomSize: null,
    furnishing: '',
    furnishingExtras: [],
    amenities: [],
    features: [],
    preferredTenant: '',
    mainImage: '',
    photos: [],
    isPreoccupied: false,
  },
};

const initialEditFormState: EditFormState = {
  currentPage: 1,
  propertyDetails: {
    title: '',
    description: '',
    propertyType: '',
    roomType: '',
    sharingType: '',
    configuration: '',
    roomSize: '',
    roomSizeDetails: '',
    bedroom: '',
    furnishingLevel: '',
    floornumber: '',
    totalfloor: '',
    preoccupiedPropertyType: '',
    furnishings: [],
    balcony: '',
    mainImage: '',
    bathroom: '',
    amenities: [],
    units: '',
    preferredTenantType: [],
    features: [],
    availableFrom: '',
    monthlyRent: '',
    maintenanceCharges: '',
    maintenanceChargesAmount: '',
    securityDeposit: '',
    securityDepositamount: '',
    lockInPeriodMonths: '',
    brokerageCharges: '',
    brokerageAmount: '',
    brokerageNegotiable: false,
  },
  propertyLocation: {
    fullAddress: '',
    city: '',
    state: '',
    country: '',
    latitude: null,
    longitude: null,
  },
  photos: [],
  verification: {
    selectedDate: null,
    phoneNumber: '',
  },
  restructuredData: {
    title: '',
    description: '',
    propertyType: '',
    location: {
      city: '',
      state: '',
      country: '',
      latitude: null,
      longitude: null,
    },
    price: null,
    security: null,
    brokerage: null,
    isNegotiable: false,
    lockInPeriod: '',
    availableFrom: '',
    configuration: '',
    bedrooms: null,
    bathrooms: null,
    balconies: null,
    floorNumber: '',
    totalFloors: null,
    maintenanceCharges: null,
    isMaintenanceIncluded: false,
    roomType: '',
    sharingType: '',
    unitsAvailable: null,
    roomSize: null,
    furnishing: '',
    furnishingExtras: [],
    amenities: [],
    features: [],
    preferredTenant: '',
    mainImage: '',
    photos: [],
    isPreoccupied: false,
  },
  isEditing: false,
  editingListingId: null,
};

// Create separate slices
const addFormSlice = createSlice({
  name: 'addForm',
  initialState: initialAddFormState,
  reducers: {
    setAddCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    updateAddPropertyDetails: (
      state,
      action: PayloadAction<Partial<PropertyDetails>>
    ) => {
      state.propertyDetails = { ...state.propertyDetails, ...action.payload };
    },
    updateAddPropertyLocation: (
      state,
      action: PayloadAction<Partial<PropertyLocation>>
    ) => {
      state.propertyLocation = { ...state.propertyLocation, ...action.payload };
    },
    setAddPhotos: (state, action: PayloadAction<Photo[]>) => {
      const newPhotos = action.payload.filter(
        (newPhoto) =>
          !state.photos.some(
            (existingPhoto) =>
              existingPhoto.name === newPhoto.name &&
              existingPhoto.size === newPhoto.size
          )
      );
      state.photos = [...state.photos, ...newPhotos];
    },
    removeAddPhoto: (state, action: PayloadAction<number>) => {
      state.photos = state.photos.filter(
        (_, index) => index !== action.payload
      );
    },
    updateAddVerification: (
      state,
      action: PayloadAction<Partial<Verification>>
    ) => {
      state.verification = { ...state.verification, ...action.payload };
    },
    resetAddForm: (state) => {
      Object.assign(state, initialAddFormState);
    },
    restructureAddFormData(state) {
      const { propertyDetails, propertyLocation, photos } = state;
      state.restructuredData = {
        title: propertyDetails.title,
        description: propertyDetails.description,
        propertyType: propertyDetails.propertyType.toUpperCase(),
        location: {
          city: propertyLocation.city,
          state: propertyLocation.state,
          country: propertyLocation.country,
          latitude: propertyLocation.latitude || 0,
          longitude: propertyLocation.longitude || 0,
        },
        price: parseInt(propertyDetails.monthlyRent) || 0,
        security: parseInt(propertyDetails.securityDepositamount) || 0,
        brokerage: parseInt(propertyDetails.brokerageAmount) || 0,
        isNegotiable: propertyDetails.brokerageNegotiable,
        lockInPeriod: propertyDetails.lockInPeriodMonths.toUpperCase(),
        availableFrom: propertyDetails.availableFrom || '',
        configuration: propertyDetails.configuration.toUpperCase(),
        bedrooms: parseInt(propertyDetails.bedroom) || 0,
        bathrooms: parseInt(propertyDetails.bathroom) || 0,
        balconies: parseInt(propertyDetails.balcony) || 0,
        floorNumber: propertyDetails.floornumber || '',
        totalFloors: parseInt(propertyDetails.totalfloor) || 0,
        maintenanceCharges:
          parseInt(propertyDetails.maintenanceChargesAmount) || 0,
        isMaintenanceIncluded:
          propertyDetails.maintenanceCharges === 'Included',
        roomType: propertyDetails.roomType || '',
        sharingType: propertyDetails.sharingType
          ? propertyDetails.sharingType.toUpperCase()
          : 'SINGLE',
        unitsAvailable: parseInt(propertyDetails.units) || 0,
        roomSize: parseInt(propertyDetails.roomSize) || 0,
        furnishing: propertyDetails.furnishingLevel
          ? propertyDetails.furnishingLevel.toUpperCase()
          : 'NONE',
        furnishingExtras: propertyDetails.furnishings || [],
        amenities: propertyDetails.amenities.map((amenity) =>
          amenity.toUpperCase()
        ),
        features: propertyDetails.features.map((feature) =>
          feature.toUpperCase()
        ),
        preferredTenant:
          propertyDetails.preferredTenantType[0]?.toUpperCase() || 'FAMILY',
        mainImage: propertyDetails.mainImage || '',
        photos: photos.map((photo) => photo.preview || ''),
        isPreoccupied: propertyDetails.preoccupiedPropertyType !== '',
      };
    },
  },
});

const editFormSlice = createSlice({
  name: 'editForm',
  initialState: initialEditFormState,
  reducers: {
    startEditing: (state, action: PayloadAction<string>) => {
      state.isEditing = true;
      state.editingListingId = action.payload;
    },
    stopEditing: (state) => {
      Object.assign(state, initialEditFormState);
    },
    setEditCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    updateEditPropertyDetails: (
      state,
      action: PayloadAction<Partial<PropertyDetails>>
    ) => {
      state.propertyDetails = { ...state.propertyDetails, ...action.payload };
    },
    updateEditPropertyLocation: (
      state,
      action: PayloadAction<Partial<PropertyLocation>>
    ) => {
      state.propertyLocation = { ...state.propertyLocation, ...action.payload };
    },
    setEditPhotos: (state, action: PayloadAction<Photo[]>) => {
      const newPhotos = action.payload.filter(
        (newPhoto) =>
          !state.photos.some(
            (existingPhoto) =>
              existingPhoto.name === newPhoto.name &&
              existingPhoto.size === newPhoto.size
          )
      );
      state.photos = [...state.photos, ...newPhotos];
    },
    removeEditPhoto: (state, action: PayloadAction<number>) => {
      state.photos = state.photos.filter(
        (_, index) => index !== action.payload
      );
    },
    updateEditVerification: (
      state,
      action: PayloadAction<Partial<Verification>>
    ) => {
      state.verification = { ...state.verification, ...action.payload };
    },
    restructureEditFormData(state) {
      const { propertyDetails, propertyLocation, photos } = state;
      state.restructuredData = {
        title: propertyDetails.title,
        description: propertyDetails.description,
        propertyType: propertyDetails.propertyType.toUpperCase(),
        location: {
          city: propertyLocation.city,
          state: propertyLocation.state,
          country: propertyLocation.country,
          latitude: propertyLocation.latitude || 0,
          longitude: propertyLocation.longitude || 0,
        },
        price: parseInt(propertyDetails.monthlyRent) || 0,
        security: parseInt(propertyDetails.securityDepositamount) || 0,
        brokerage: parseInt(propertyDetails.brokerageAmount) || 0,
        isNegotiable: propertyDetails.brokerageNegotiable,
        lockInPeriod: propertyDetails.lockInPeriodMonths.toUpperCase(),
        availableFrom: propertyDetails.availableFrom || '',
        configuration: propertyDetails.configuration.toUpperCase(),
        bedrooms: parseInt(propertyDetails.bedroom) || 0,
        bathrooms: parseInt(propertyDetails.bathroom) || 0,
        balconies: parseInt(propertyDetails.balcony) || 0,
        floorNumber: propertyDetails.floornumber || '',
        totalFloors: parseInt(propertyDetails.totalfloor) || 0,
        maintenanceCharges:
          parseInt(propertyDetails.maintenanceChargesAmount) || 0,
        isMaintenanceIncluded:
          propertyDetails.maintenanceCharges === 'Included',
        roomType: propertyDetails.roomType || '',
        sharingType: propertyDetails.sharingType
          ? propertyDetails.sharingType.toUpperCase()
          : 'SINGLE',
        unitsAvailable: parseInt(propertyDetails.units) || 0,
        roomSize: parseInt(propertyDetails.roomSize) || 0,
        furnishing: propertyDetails.furnishingLevel
          ? propertyDetails.furnishingLevel.toUpperCase()
          : 'NONE',
        furnishingExtras: propertyDetails.furnishings || [],
        amenities: propertyDetails.amenities.map((amenity) =>
          amenity.toUpperCase()
        ),
        features: propertyDetails.features.map((feature) =>
          feature.toUpperCase()
        ),
        preferredTenant:
          propertyDetails.preferredTenantType[0]?.toUpperCase() || 'FAMILY',
        mainImage: propertyDetails.mainImage || '',
        photos: photos.map((photo) => photo.preview || ''),
        isPreoccupied: propertyDetails.preoccupiedPropertyType !== '',
      };
    },

    populateEditForm: (state, action: PayloadAction<EditFormState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setAddCurrentPage,
  updateAddPropertyDetails,
  updateAddPropertyLocation,
  setAddPhotos,
  removeAddPhoto,
  updateAddVerification,
  resetAddForm,
  restructureAddFormData,
} = addFormSlice.actions;

export const {
  startEditing,
  stopEditing,
  setEditCurrentPage,
  updateEditPropertyDetails,
  updateEditPropertyLocation,
  setEditPhotos,
  removeEditPhoto,
  updateEditVerification,
  restructureEditFormData,
  populateEditForm,
} = editFormSlice.actions;

export const addFormReducer = addFormSlice.reducer;
export const editFormReducer = editFormSlice.reducer;
