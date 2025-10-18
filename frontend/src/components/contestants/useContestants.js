import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch all contestants from the backend API
 */
const fetchContestants = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-contestants`);
  // Get raw contestants
  const contestants = response.data.data;

  // Define contestant numbers to exclude (soft deleted)
  // const excludedNumbers = ["1", "2", "7"];
  const excludedNumbers = [];

  // Filter out excluded contestants
  const activeContestants = contestants.filter(
    (c) => !excludedNumbers.includes(String(c.contestant_number))
  );

  return activeContestants;
};

/**
 * Custom React Query hook for contestants
 */
export const useContestants = () => {
  const query = useQuery({
    queryKey: ["contestants"],
    queryFn: fetchContestants,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Expose refetch so other components can call it
  return {
    ...query,
    refetchContestants: query.refetch, // call this after successful payment
  };
};























// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// /**
//  * Fetch all contestants from the backend API
//  */
// const fetchContestants = async () => {
//   const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-contestants`);
//   console.log(response)
//   return response.data.data;
// };

// /**
//  * Custom React Query hook for contestants
//  */
// export const useContestants = () => {
//   const query = useQuery({
//     queryKey: ["contestants"],
//     queryFn: fetchContestants,
//     staleTime: 1000 * 60 * 60 * 24,
//     cacheTime: 1000 * 60 * 60 * 24,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   // Expose refetch so other components can call it
//   return {
//     ...query,
//     refetchContestants: query.refetch, // call this after successful payment
//   };
// };
