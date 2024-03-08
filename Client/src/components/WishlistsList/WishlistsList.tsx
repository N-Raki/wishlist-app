import './WishlistsList.css'
import {FC} from "react";
import {Wishlist} from "../../models/wishlist.model.ts";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper} from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface WishlistsListProps {
    wishlists: Wishlist[];
}

const WishlistsList: FC<WishlistsListProps> = (props: WishlistsListProps) => {
    return (
        <Paper sx={{width: '100%', maxWidth:'640px'}}>
            <List>
                {props.wishlists.map((wishlist) =>
                    <ListItem key={wishlist.id}>
                        <ListItemButton href={'/wishlists/' + wishlist.id}>
                            <ListItemIcon>
                                <ChevronRightIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={wishlist.name}
                                secondary={wishlist.items.length + ' items'}
                            />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Paper>
    );
};

export default WishlistsList;