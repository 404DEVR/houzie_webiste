import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import useAuth from '@/hooks/useAuth';

const withAuthRedirect = (WrappedComponent: React.ComponentType) => {
  const AuthRedirect = (props: any) => {
    const { auth } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';

    useEffect(() => {
      if (auth?.accessToken) {
        router.push(redirectPath);
      }
    }, [auth, router, redirectPath]);

    // If authenticated, do not render the wrapped component
    if (auth?.accessToken) {
      return null;
    }

    // Otherwise, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  return AuthRedirect;
};

export default withAuthRedirect;