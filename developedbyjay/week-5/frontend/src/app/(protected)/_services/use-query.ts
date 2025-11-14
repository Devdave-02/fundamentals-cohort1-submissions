import { useQuery } from "@tanstack/react-query";
import { getUser } from "./query";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });
};
