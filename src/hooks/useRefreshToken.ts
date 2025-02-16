import useAuth from '@/hooks/useAuth';

interface RefreshResponse {
  refreshToken: string;
}

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async (): Promise<string | null> => {
    return null;
  };

  return refresh;
};

export default useRefreshToken;
