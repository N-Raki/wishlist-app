import './WishlistsList.css'
import {FC} from "react";
import {Wishlist} from "../../models/wishlist.model.ts";
import {Link, Stack, Typography} from "@mui/material";

interface WishlistsListProps {
    wishlists: Wishlist[];
}

const WishlistsList: FC<WishlistsListProps> = (props: WishlistsListProps) => {
    return (
        <Stack spacing={2}>
                {props.wishlists.map((wishlist) =>
                    <Typography><Link href={'/wishlists/' + wishlist.id} underline="hover">🔷 {wishlist.name}</Link>
                        <ul>
                            {wishlist.items.map((item) =>
                                <li key={item.id}>
                                    <span>{item.name}</span>
                                    {item.url ? (-<a href={item.url} target="_blank">Link</a>) : null}
                                    {item.price ? (-<span>{item.price}</span>) : null}
                                </li>
                            )}
                        </ul>
                    </Typography>
                )}
        </Stack>
    );
};

export default WishlistsList;