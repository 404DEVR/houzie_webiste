import Brokerdetail from '@/components/dashboard/Brokerdetail';
import MergedDashboard from '@/components/dashboard/MergedDashboard';

export default function Dashboard() {
  return (
    <div>
      <h1 className='text-2xl font'>Welcome to "Full name"</h1>
      {/* <DashboardCards />
      <DashboardGraph /> */}
      <MergedDashboard />
      <Brokerdetail />
      {/* Your other page content */}
    </div>
  );
}
