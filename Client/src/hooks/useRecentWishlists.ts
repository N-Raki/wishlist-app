import { useQuery } from "@tanstack/react-query";
import { getRecentWishlists } from "../services/wishlists.service.ts";
import { Wishlist } from "../models/wishlist.model.ts";
import {useCurrentUser} from "./useCurrentUser.ts";

export const useRecentWishlists = () => {
    const userQuery = useCurrentUser();

    const recentWishlistsQuery = useQuery<Wishlist[]>({
        queryKey: ['recentWishlists'],
        queryFn: getRecentWishlists,
        retry: false,
        enabled: userQuery.isSuccess,
    });

    return {
        userQuery,
        recentWishlistsQuery,
    };
};
