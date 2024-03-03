import './WishlistView.css'
import {FC} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {Wishlist} from "../../models/wishlist.model.ts";
import WishlistsService from "../../services/wishlists.service.ts";
import toast from "react-hot-toast";
import {Box, Link, Stack, Typography} from "@mui/material";

interface WishlistViewProps {}

const WishlistView: FC<WishlistViewProps> = () => {
    const { guid } = useParams();
    if (!guid) {
        toast.error('No wishlist guid provided');
        return <Navigate to="/profile" />;
    }
    
    const query = useQuery<Wishlist>({
        queryKey: ['wishlist'],
        queryFn: () => WishlistsService.getWishlist(guid),
        retry: false
    });
    
    if (query.isError) {
        return <Navigate to="/profile" />;
    }
    
    if (query.isSuccess) {
        const wishlist: Wishlist = query.data;
        
        return (
            <Box>
                <Typography variant={'h1'}>{wishlist.name}</Typography>
                <Typography>{wishlist.id}</Typography>
                <ul>
                    {wishlist.items.map((item) =>
                        <li key={item.id}>
                            <Stack spacing={1} direction={'row'}>
                                {
                                    item.url ?
                                        <Link href={item.url} target="_blank">{item.name}</Link> :
                                        <Typography>{item.name}</Typography>
                                }
                                {item.price ? <span> - {item.price}$</span> : null}
                            </Stack>
                        </li>
                    )}
                </ul>
            </Box>
        );
    }
};

export default WishlistView;