import axios from 'axios';
import { useEffect, useState } from 'react';

import useAuth from '@/hooks/useAuth';

import Brokerdetail from '@/components/dashboard/Brokerdetail';
import MergedDashboard from '@/components/dashboard/MergedDashboard';

import { ProfileCardProps } from '@/interfaces/PropsInterface';

export default function Dashboard() {
  const { auth } = useAuth();
  const [brokerData, setBrokerData] = useState<ProfileCardProps>();
  const [isLoading, setIsLoading] = useState(true);
  const brokerid = auth?.userid;
  useEffect(() => {
    const fetchBrokerData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.houzie.in/broker/${brokerid}`,
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        ); // Fetch data from API
        setBrokerData(response.data);
      } catch (error) {
        console.error('Failed to fetch broker data:', error);
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokerData();
  }, [brokerid]);

  const capitalizeName = (name: string | undefined) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div>
      <h1 className='text-2xl font'>
        Welcome to {capitalizeName(brokerData?.name)}
      </h1>
      <MergedDashboard />
      <Brokerdetail />
    </div>
  );
}
