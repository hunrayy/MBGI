import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch all contestants from the backend API
 */
const fetchContestants = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-contestants`); // 🔁 replace with your backend URL
  console.log(response)
  return response.data.data;
};

/**
 * Custom React Query hook for contestants
 * - Fetches all contestants
 * - Caches results for 1 day (24 hours)
 */
export const useContestants = () => {
  return useQuery({
    queryKey: ["contestants"],
    queryFn: fetchContestants,
    staleTime: 1000 * 60 * 60 * 24, // data stays fresh for 24 hours
    cacheTime: 1000 * 60 * 60 * 24, // cached data kept for 24 hours
    refetchOnWindowFocus: false,
    retry: 2, // retry twice if request fails
  });
};
