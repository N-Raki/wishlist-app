import './WishlistsList.css'
import {FC} from "react";
import {Wishlist} from "../../models/wishlist.model.ts";
import {Box, Link, Stack} from "@mui/material";

interface WishlistsListProps {
    wishlists: Wishlist[];
}

const WishlistsList: FC<WishlistsListProps> = (props: WishlistsListProps) => {
    return (
        <Stack spacing={2}>
                {props.wishlists.map((wishlist) =>
                    <Box key={wishlist.id}>
                        <Link href={'/wishlists/' + wishlist.id} underline="hover">🔷 {wishlist.name}</Link>
                    </Box>
                )}
        </Stack>
    );
};

export default WishlistsList;