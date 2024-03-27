import {FC} from "react";
import {Wishlist} from "../../models/wishlist.model.ts";
import {useQuery} from "@tanstack/react-query";
import {getUserDisplayName} from "../../services/user.service.ts";
import {Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {stringToColor} from "../../helpers/avatarHelper.ts";
import {useNavigate} from "react-router-dom";

interface WishlistPreviewProps {
    wishlist: Wishlist,
    showOwner: boolean
}

const WishlistPreview: FC<WishlistPreviewProps> = ({wishlist}) => {
    const {
        data: ownerName
    } = useQuery<string>({queryKey: ['username', wishlist.userId], queryFn: () => getUserDisplayName(wishlist.userId), retry: false, staleTime: 1000 * 60 * 5});
    const navigate = useNavigate();
    
    return (
        <ListItem>
            <ListItemButton onClick={() => navigate('/wishlists/' + wishlist.id)}>
                <ListItemIcon>
                    <Avatar sx={{
                        width: 24,
                        height: 24,
                        fontSize: 14,
                        backgroundColor: stringToColor(ownerName ? ownerName : 'Anonymous')
                    }}>
                        {ownerName ? ownerName[0] : 'A'}
                    </Avatar>
                </ListItemIcon>
                <ListItemText
                    primary={(!wishlist.isOwner && ownerName ? ownerName + ' - ' : '') + wishlist.name}
                    secondary={wishlist.items.length + ' items'}
                />
            </ListItemButton>
        </ListItem>
    );
}

export default WishlistPreview;