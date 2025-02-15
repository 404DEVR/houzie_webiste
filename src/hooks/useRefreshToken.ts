// import useAuth from "@/hooks/useAuth";

// import axios from "@/api/axios";

// interface RefreshResponse {
//   refreshToken: string;
// }

// const useRefreshToken = () => {
//   const { auth, setAuth } = useAuth();

//   const refresh = async (): Promise<string | null> => {
//     try {
//       const response = await axios.post<RefreshResponse>('/auth/refresh', {
//         refreshToken: auth.refreshToken
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       });
      

//       const newRefreshToken = response.data.refreshToken;

//       setAuth(prev => ({
//         ...prev,
//         refreshToken: newRefreshToken
//       }));

//       console.log('New refresh token:', newRefreshToken);
//       return newRefreshToken;
//     } catch (error) {
//       console.error('Unexpected error during token refresh:', error);
//       return null;
//     }
//   };

//   return refresh;
// };

// export default useRefreshToken;
