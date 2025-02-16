import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import useAuth from '@/hooks/useAuth';

const withAuthRedirect = (WrappedComponent: React.ComponentType) => {
  const AuthRedirect = (props: any) => {
    const { auth } = useAuth();

    useEffect(() => {
      if (auth?.accessToken) {
        redirect('/'); // Redirect to home or dashboard if authenticated
      }
    }, [auth]);

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
