import './WishlistsList.css'
import {FC} from "react";
import {Wishlist} from "../../models/wishlist.model.ts";
import {Box, Link, Stack, Typography} from "@mui/material";

interface WishlistsListProps {
    wishlists: Wishlist[];
}

const WishlistsList: FC<WishlistsListProps> = (props: WishlistsListProps) => {
    return (
        <Stack spacing={2}>
                {props.wishlists.map((wishlist) =>
                    <Box key={wishlist.id}>
                        <Link href={'/wishlists/' + wishlist.id} underline="hover">🔷 {wishlist.name}</Link>
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
                )}
        </Stack>
    );
};

export default WishlistsList;