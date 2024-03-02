import './WishlistView.css'
import {FC} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {Wishlist} from "../../models/wishlist.model.ts";
import WishlistsService from "../../services/wishlists.service.ts";
import toast from "react-hot-toast";

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
            <div className="WishlistView">
                <pre>Id: {wishlist?.id}</pre>
                <pre>Name: {wishlist?.name}</pre>
                <pre>Yours: {wishlist?.isOwner ? 'Yes' : 'No'}</pre>
                <ul>
                    {wishlist?.items.map((item) =>
                        <li key={item.id}>
                            <span>{item.name}</span>
                            {item.url ? (-<a href={item.url} target="_blank">Link</a>) : null}
                            {item.price ? (-<span>{item.price}</span>) : null}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
};

export default WishlistView;