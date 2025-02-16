'use client';

import axios from 'axios'; // Assuming you have axios configured
import { Bath, Bed, Building2, Edit, Eye, Home, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { toast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import AddListings from '@/components/AddListings/AddListings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { populateEditForm, startEditing } from '@/redux/slices/formslices';

interface PropertyFeature {
  icon: React.ElementType;
  label: string;
}

interface Listing {
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

const MyListings = () => {
  const { auth } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const accessToken = auth?.accessToken;
        if (!accessToken) {
          throw new Error('No access token available');
        }
        const response = await axios.get(
          `https://api.houzie.in/broker/listings`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setListings(response.data.data);
      } catch (error) {
        toast({
          title: 'Failed To Fetch Listings',
          description: 'Please Check YOur Network Connection',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`https://api.houzie.in/listings/${id}`);
      const listingData = response.data;

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
        id: string;
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

      interface Restructuredinterface {
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

      const editFormData = {
        currentPage: 1,
        propertyDetails: {
          title: listingData.title,
          description: listingData.description,
          propertyType: listingData.propertyType,
          roomType: listingData.roomType || '',
          sharingType: listingData.sharingType || '',
          units: listingData.unitsAvailable || '',
          mainImage: listingData.mainImage,
          roomSize: listingData.roomSize || '',
          roomSizeDetails: '',
          furnishingLevel: listingData.furnishing || '',
          furnishings: listingData.furnishingExtras || [],
          configuration: listingData.configuration,
          balcony: listingData.balconies?.toString() || '',
          bathroom: listingData.bathrooms?.toString() || '',
          amenities: listingData.amenities,
          bedroom: listingData.bedrooms?.toString() || '',
          preoccupiedPropertyType: listingData.isPreoccupied ? 'Yes' : 'No',
          preferredTenantType: [listingData.preferredTenant],
          features: listingData.features,
          availableFrom: listingData.availableFrom,
          totalfloor: listingData.totalFloors?.toString() || '',
          floornumber: listingData.floorNumber,
          monthlyRent: listingData.price?.toString() || '',
          maintenanceCharges: listingData.isMaintenanceIncluded
            ? 'Included'
            : 'Excluded',
          maintenanceChargesAmount:
            listingData.maintenanceCharges?.toString() || '',
          securityDeposit: 'Fixed',
          securityDepositamount: listingData.security?.toString() || '',
          lockInPeriodMonths: listingData.lockInPeriod,
          brokerageCharges: 'Fixed',
          brokerageAmount: listingData.brokerage?.toString() || '',
          brokerageNegotiable: listingData.isNegotiable,
        } as PropertyDetails,
        propertyLocation: {
          id: listingData.location.id,
          fullAddress: '',
          city: listingData.location.city,
          state: listingData.location.state,
          country: listingData.location.country,
          latitude: listingData.location.latitude,
          longitude: listingData.location.longitude,
        } as PropertyLocation,
        photos: listingData.photos.map((photoUrl) => ({
          name: 'image',
          size: 0,
          type: 'image/jpeg',
          lastModified: 0,
          preview: photoUrl,
        })),
        verification: {
          selectedDate: null,
          phoneNumber: '',
        } as Verification,
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
        } as Restructuredinterface,
        isEditing: true,
        editingListingId: id,
      };

      dispatch(startEditing(id));
      dispatch(populateEditForm(editFormData));
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        title: 'Please Try Again',
        description: 'Please Check Your Netwrok Connection',
      });
    }
  };

  const handleViewDetails = (id) => {
    alert(`Viewing details for listing with id: ${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const accessToken = auth?.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await axios.delete(`https://api.houzie.in/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== id)
      );

      toast({
        title: 'Listing deleted successfully!',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete listing.',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const getPropertyFeatures = (listing: Listing): PropertyFeature[] => {
    const features: PropertyFeature[] = [];

    if (listing.bedrooms) {
      features.push({ icon: Bed, label: `${listing.bedrooms}-Bedroom` });
    }
    if (listing.bathrooms) {
      features.push({ icon: Bath, label: `${listing.bathrooms}-Bathroom` });
    }
    if (listing.balconies) {
      features.push({ icon: Building2, label: `${listing.balconies}-Balcony` });
    }
    features.push({ icon: Home, label: listing.propertyType });

    return features;
  };

  return (
    <div className='container mx-auto pb-8 pt-4 border px-2 sm:px-4 my-4 rounded-lg'>
      <h1 className='text-xl sm:text-2xl font-bold mb-4'>My Listings</h1>

      {isLoading ? (
        <p>Loading listings...</p>
      ) : listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className='space-y-4'>
          {listings.map((listing) => {
            const propertyFeatures = getPropertyFeatures(listing);
            return (
              <Card
                key={listing.id}
                className='shadow-md rounded-md bg-[#F9FAFB]'
              >
                <CardContent className='p-2 sm:p-4 flex flex-col md:flex-row gap-4'>
                  <div className='w-full md:w-[250px] lg:w-[300px] h-[200px] md:h-[250px] mx-auto md:mx-0 flex items-center justify-center p-1'>
                    <div className='relative w-full h-full'>
                      <Image
                        src={listing.mainImage}
                        alt={listing.title}
                        fill
                        className='object-cover rounded-md'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    </div>
                  </div>
                  <div className='w-full md:w-3/4 flex flex-col justify-between'>
                    <div>
                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2'>
                        <h2 className='text-base sm:text-lg font-semibold'>
                          {listing.title}
                        </h2>
                        <div className='py-1 px-3 text-white bg-[#42A4AE] rounded-md text-sm mt-2 sm:mt-0'>
                          {listing.views} Views
                        </div>
                      </div>
                      <p className='text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-4'>
                        {listing.description}
                        <Link href='#' className='text-blue-500 ml-1'>
                          Read More
                        </Link>
                      </p>
                      <div className='flex flex-wrap items-start justify-start gap-2 mb-2 sm:mb-0'>
                        {propertyFeatures &&
                          propertyFeatures.map((feature, index) => (
                            <Badge
                              key={index}
                              variant='outline'
                              className='bg-[#191919] text-white border-neutral-800 px-2 py-1 rounded-full text-xs'
                            >
                              <feature.icon className='w-3 h-3 inline-block mr-1' />
                              <span className='font-medium'>
                                {feature.label}
                              </span>
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 sm:mt-4'>
                      <div className='mb-2 sm:mb-0'>
                        <p className='font-medium flex flex-col text-xs sm:text-sm'>
                          Rent{' '}
                          <span className='text-base sm:text-lg'>
                            ₹ {listing.price}
                          </span>
                        </p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          className='text-white bg-[#42A4AE] text-xs sm:text-sm'
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(listing.id)}
                        >
                          <Edit className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                          Edit
                        </Button>
                        <Button
                          className='text-white bg-[#42A4AE] text-xs sm:text-sm'
                          variant='outline'
                          size='sm'
                          onClick={() => handleViewDetails(listing.id)}
                        >
                          <Eye className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                          View
                        </Button>
                        <Button
                          variant='destructive'
                          size='sm'
                          className='text-xs sm:text-sm'
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className='w-full sm:max-w-7xl h-[90%] my-auto overflow-y-auto'>
          <AddListings page='edit' />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListings;
