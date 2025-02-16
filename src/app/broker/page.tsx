import dynamic from 'next/dynamic';

const BrokerContent = dynamic(() => import('@/components/BrokerContent'), {
  ssr: false,
});

export default function BrokerPage() {
  return <BrokerContent />;
}
