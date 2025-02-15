import Brokerdetail from '@/components/dashboard/Brokerdetail';
import DashboardCards from '@/components/dashboard/DashboardCards';
import DashboardGraph from '@/components/dashboard/DashboardGraph';

export default function Dashboard() {
  return (
    <div>
      <h1 className='text-2xl font'>Welcome to "Full name"</h1>
      <DashboardCards />
      <DashboardGraph />
      <Brokerdetail />
      {/* Your other page content */}
    </div>
  );
}
