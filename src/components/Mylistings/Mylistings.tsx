import { DialogTitle } from '@radix-ui/react-dialog';
import axios from 'axios';
import {
  ArrowDown,
  Bath,
  Bed,
  Building2,
  ChevronDown,
  Home,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { useCustomToast } from '@/hooks/use-custom-toast';
import useAuth from '@/hooks/useAuth';

import AddListings from '@/components/AddListings/AddListings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { Lead, Listing, PropertyFeature } from '@/interfaces/Interface';
import {
  populateEditForm,
  PropertyDetails,
  PropertyLocation,
  restructured,
  startEditing,
} from '@/redux/slices/formslices';

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

const MyListings = () => {
  const toast = useCustomToast();
  const router = useRouter();
  const [leadsData, setLeadsData] = useState<Lead[] | null>([]);
  const { auth } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = `https://api.houzie.in/broker/listings`;
  const [refreshListings, setRefreshListings] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null); // Track which card is expanded

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const accessToken = auth?.accessToken;
        if (!accessToken) {
          throw new Error('No access token available');
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setListings(response.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [auth?.accessToken, url, refreshListings]);

  const handleEdit = async (id: string) => {
    try {
      const response = await axios.get(`https://api.houzie.in/listings/${id}`);
      const listingData = response.data.data;
      const editFormData = {
        currentPage: 1,
        propertyDetails: {
          title: listingData.title,
          description: listingData.description,
          propertyType: listingData.propertyType,
          roomType: listingData.roomType || '',
          sharingType: listingData.sharingType || '',
          unitsAvailable: listingData.unitsAvailable || '',
          mainImage: listingData.mainImage,
          roomSize: listingData.roomSize || '',
          roomSizeDetails: '',
          furnishing: listingData.furnishing || '',
          furnishingExtras: listingData.furnishingExtras || [],
          configuration: listingData.configuration,
          balconies: listingData.balconies?.toString() || '',
          bathrooms: listingData.bathrooms?.toString() || '',
          amenities: listingData.amenities,
          bedrooms: listingData.bedrooms?.toString() || '',
          preoccupiedPropertyType: listingData.propertyType,
          preferredTenant: [listingData.preferredTenant],
          features: listingData.features,
          availableFrom: listingData.availableFrom,
          totalFloors: listingData.totalFloors?.toString() || '',
          floorNumber: listingData.floorNumber,
          price: listingData.price?.toString() || '',
          maintenanceCharges: listingData.maintenanceCharges,
          securityDeposit: 'Fixed',
          security: listingData.security?.toString() || '',
          lockInPeriod: listingData.lockInPeriod,
          brokerageCharges: 'Fixed',
          brokerage: listingData.brokerage?.toString() || '',
          isNegotiable: listingData.isNegotiable,
          preferredGender: listingData.preferredGender,
        } as PropertyDetails,
        propertyLocation: {
          city: (listingData.location && listingData.location.city) || '',
          state: (listingData.location && listingData.location.state) || '',
          country: (listingData.location && listingData.location.country) || '',
          latitude: listingData.location && listingData.location.latitude,
          longitude: listingData.location && listingData.location.longitude,
        } as PropertyLocation,
        photos:
          listingData.photos && Array.isArray(listingData.photos)
            ? listingData.photos.map((photoUrl) => ({
                name: 'image',
                size: 0,
                type: 'image/jpeg',
                lastModified: 0,
                preview: photoUrl,
              }))
            : [],
        verification: {
          selectedDate: '',
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
          preferredGender: [],
          occupants: [],
          totalOccupants: null,
        } as restructured,
        isEditing: true,
        editingListingId: id,
      };

      dispatch(startEditing(id));
      dispatch(populateEditForm(editFormData));
      setIsDialogOpen(true);
    } catch (error) {
      toast.error({
        title: 'Please Try Again',
        description: 'Please Check Your Network Connection',
      });
    }
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

      toast.success({
        title: 'Deleted successfully',
        description: 'Listing deleted successfully!',
      });
    } catch (error) {
      toast.error({
        title: 'Failed to delete listing.',
        description: 'Please try again later.',
      });
    }
  };

  const getPropertyFeatures = (listing: Listing): PropertyFeature[] => {
    const features: PropertyFeature[] = [];
    if (listing.bedrooms) {
      features.push({ icon: Bed, label: `${listing.bedrooms} Beds` });
    }
    if (listing.bathrooms) {
      features.push({ icon: Bath, label: `${listing.bathrooms} Baths` });
    }
    if (listing.balconies) {
      features.push({
        icon: Building2,
        label: `${listing.balconies} Balconies`,
      });
    }
    features.push({
      icon: Home,
      label: transformString(listing.propertyType),
    });

    return features;
  };

  const toggleCardExpansion = async (id) => {
    console.log(id);
    console.log(auth?.accessToken);
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      try {
        const response = await axios.get(
          `https://api.houzie.in/leads/filter/listing?listingId=${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        );
        setLeadsData(response.data);
      } catch {
        setExpandedCardId(id);
      }
      setExpandedCardId(id);
    }
  };

  return (
    <div className='mx-auto pb-8 pt-4 border px-2 sm:px-4 my-4 rounded-lg'>
      <h1 className='text-xl sm:text-2xl font-bold mb-4'>My Listings</h1>

      {isLoading ? (
        <p>Loading listings...</p>
      ) : Array.isArray(listings) && listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className='space-y-4'>
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className={`shadow-md rounded-2xl bg-[#eff6ff] border transition-all duration-300 ${
                expandedCardId === listing.id
                  ? 'max-h-[500px]'
                  : 'max-h-[200px]'
              } overflow-hidden`}
            >
              <CardContent className='p-2 flex flex-col md:flex-row gap-4'>
                <div className='w-full md:w-[350px] h-[180px] flex items-center justify-center'>
                  <div className='relative w-full h-full'>
                    <Image
                      src={listing.mainImage || '/svg/no-results.svg'}
                      alt={listing.title}
                      fill
                      className='object-cover rounded-2xl'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                </div>

                <div className='w-full flex flex-col md:flex-row'>
                  <div className='md:w-[70%] pt-4 md:pt-10'>
                    <div className='flex flex-col justify-between items-center md:items-start mb-6'>
                      <h2 className='text-base sm:text-xl font-semibold mb-2'>
                        {listing.title}
                      </h2>
                      <h3 className='text-xs font-normal line-clamp-2 w-[90%] text-center md:text-start'>
                        {listing.description}
                      </h3>
                    </div>

                    {getPropertyFeatures(listing).length > 0 && (
                      <div className='flex flex-wrap items-center md:items-start justify-center md:justify-start mt-2 mb-4 md:mb-0'>
                        {getPropertyFeatures(listing).map((feature, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className=' border-none flex gap-1 justify-center items-center'
                          >
                            <feature.icon className='w-[14px] h-[14px]' />
                            <span className='font-medium text-xs'>
                              {feature.label}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col items-center p-2 md:items-start '>
                    <div className='flex gap-6 mb-4 flex-wrap md:flex-nowrap '>
                      <div className='mb-1'>
                        <p className='text-gray-500 text-xs'>Rent</p>
                        <span className='text-black text-2xl font-semibold flex gap-2'>
                          <span>₹</span> {listing.price}
                        </span>
                      </div>
                      <div className='mb-1'>
                        <p className='text-gray-500 text-xs'>Location:</p>
                        <span className='text-black text-2xl font-semibold'>
                          Gurgaon
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-4 md:gap-6 mt-2 w-full md:w-auto'>
                      <Button
                        className='text-blue-500 bg-blue-50 hover:bg-blue-100 border text-lg rounded-md shadow-sm w-full md:w-auto'
                        size='sm'
                        onClick={() => handleEdit(listing.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        className='text-red-500 bg-blue-50 hover:bg-red-100 border text-lg rounded-md shadow-sm w-full md:w-auto'
                        size='sm'
                        onClick={() => handleDelete(listing.id)}
                      >
                        Unpost
                      </Button>
                    </div>
                    <Button
                      variant='link'
                      onClick={() => toggleCardExpansion(listing.id)}
                      className='flex items-center gap-2 text-gray-500 text-md font-semibold mt-2 md:mt-6'
                    >
                      Views and Leads
                      <ChevronDown
                        className={`w-[17px] h-[17px] transition-transform ${
                          expandedCardId === listing.id ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
              {expandedCardId === listing.id &&
                (Array.isArray(leadsData) && leadsData.length > 0 ? (
                  <div className='space-y-4 mx-2 mb-2'>
                    {leadsData?.map((lead) => (
                      <div
                        key={lead.id}
                        className='flex flex-col sm:flex-row justify-between gap-4 bg-[#eff5ff] rounded-xl py-4 px-4 sm:px-6 md:px-8 lg:px-20 items-start sm:items-center border'
                      >
                        {/* Lead Info */}
                        <div className='flex items-center space-x-4 w-full sm:w-auto'>
                          <Image
                            src='/images/Dummy profile.png'
                            alt={lead.name}
                            width={50}
                            height={50}
                            className='rounded-full object-cover'
                          />
                          <div>
                            <p className='text-sm md:text-md text-[#42A4AE]'>
                              {new Date(lead.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                            <p className='text-sm md:text-md font-semibold'>
                              {lead.name}
                            </p>
                          </div>
                        </div>

                        {/* Interested In */}
                        <div className='w-full sm:w-auto mt-2 sm:mt-0'>
                          <p className='text-sm md:text-md text-[#42A4AE]'>
                            Interested In
                          </p>
                          <p className='text-sm md:text-md font-semibold'>
                            Property Name
                          </p>
                        </div>

                        {/* Contact Details */}
                        <div className='flex flex-col items-start justify-center w-full sm:w-auto mt-2 sm:mt-0'>
                          <div className='text-sm md:text-md text-[#42A4AE]'>
                            Contact Details
                          </div>
                          <div className='flex items-center justify-end space-x-2'>
                            <FaPhoneAlt className='text-sm md:text-md font-semibold' />
                            <p className='text-sm md:text-md font-semibold'>
                              +91 {lead.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-4 mx-2 mb-2 rounded-xl bg-[#eff5ff] border'>
                    No leads data available
                  </div>
                ))}
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setRefreshListings((prev) => !prev);
          }
        }}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className='w-full sm:max-w-7xl h-[90%] my-auto overflow-y-auto'>
          <DialogTitle></DialogTitle>
          <AddListings page='edit' setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListings;
