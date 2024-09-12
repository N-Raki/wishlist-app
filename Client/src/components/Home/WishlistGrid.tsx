import {Wishlist} from "../../models/wishlist.model.ts";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {FC} from "react";

interface WishlistGridProps {
    wishlists: Wishlist[];
}

const WishlistGrid: FC<WishlistGridProps> = ({ wishlists }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div
            className={`px-6 w-full max-w-xl grid grid-cols-1 ${wishlists.length > 1 ? "lg:grid-cols-2 lg:max-w-3xl" : ""} gap-4`}>
            {
                wishlists.map(wishlist => (
                    <button key={wishlist.id}
                            className="flex text-left rounded-xl bg-surface dark:bg-surfaceDark shadow-elevation p-4"
                            onClick={() => navigate(`/wishlists/${wishlist.id}`)}>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{wishlist.name}</h2>
                            <h5>{t("wishlist_item_unit", {count: wishlist.items.length})}</h5>
                        </div>
                    </button>
                ))
            }
        </div>
    );
};

export default WishlistGrid;