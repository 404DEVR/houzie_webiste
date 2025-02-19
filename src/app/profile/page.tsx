import dynamic from 'next/dynamic';

const ProfileContent = dynamic(
  () => import('@/components/userprofile/ProfileContent'),
  {
    ssr: false,
  }
);

export default function BrokerPage() {
  return <ProfileContent />;
}
