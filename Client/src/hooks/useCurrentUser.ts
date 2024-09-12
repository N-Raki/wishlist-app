import {useQuery} from "@tanstack/react-query";
import {User} from "../models/user.model.ts";
import {getCurrentUser} from "../services/user.service.ts";

export const useCurrentUser = () => {
    return useQuery<User>({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        retry: false
    });
};