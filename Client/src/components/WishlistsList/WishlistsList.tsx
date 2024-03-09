import './WishlistsList.css'
import {FC} from "react";
import {Wishlist} from "../../models/wishlist.model.ts";
import {List, Paper} from "@mui/material";
import WishlistPreview from "../WishlistPreview/WishlistPreview.tsx";

interface WishlistsListProps {
    wishlists: Wishlist[];
    showOwner: boolean;
}

const WishlistsList: FC<WishlistsListProps> = ({wishlists, showOwner}) => {
    return (
        <Paper sx={{width: '100%', maxWidth:'640px'}}>
            <List>
                {wishlists.map((wishlist) =>
                    <WishlistPreview wishlist={wishlist} showOwner={showOwner} key={wishlist.id} />
                )}
            </List>
        </Paper>
    );
};

export default WishlistsList;