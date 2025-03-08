import axios from 'axios';
import { useEffect, useState } from 'react';

import useAuth from '@/hooks/useAuth';

import Brokerdetail from '@/components/dashboard/Brokerdetail';
import MergedDashboard from '@/components/dashboard/MergedDashboard';

import { UserData } from '@/interfaces/Interface';

export default function Dashboard() {
  const { auth } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth?.userid) {
        const response = await axios.get(`https://api.houzie.in/profile`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setUserData(response.data);
      }
    };
    fetchUserData();
  }, [auth]);

  const capitalizeName = (name: string | undefined) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div>
      <h1 className='text-3xl font-semibold '>
        Welcome {capitalizeName(userData?.name)}
      </h1>
      <MergedDashboard />
      <Brokerdetail />
    </div>
  );
}
