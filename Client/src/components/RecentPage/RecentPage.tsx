import {User} from "../../models/user.model.ts";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../services/user.service.ts";
import {Wishlist} from "../../models/wishlist.model.ts";
import {getRecentWishlists} from "../../services/wishlists.service.ts";
import {useTranslation} from "react-i18next";

function RecentPage() {
    const { t } = useTranslation();
    const {
        data: user,
        isSuccess: isConnected,
        isLoading
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const {
        data: recentWishlists,
        isLoading: isLoadingRecentWishlists
    } = useQuery<Wishlist[]>({
        queryKey: ['recentWishlists'],
        queryFn: getRecentWishlists,
        retry: false,
        enabled: isConnected
    });
    
    const navigate = useNavigate();
    
    if (isLoading || isLoadingRecentWishlists) {
        return (
            <Container>{null}</Container>
        );
    }
    
    if (!isConnected)
    {
        navigate("/");
        return;
    }
    
    return (
        recentWishlists && recentWishlists.length > 0
            ? (
                <Container>
                    <h2 className="my-10 font-bold text-xl">{t("home_hello", { displayName: user.displayName })}</h2>
                    <div className={`px-6 w-full max-w-xl grid grid-cols-1 ${user.wishlists.length > 1 ? "lg:grid-cols-2" : ""} gap-4`}>
                        {
                            recentWishlists.map(wishlist => (
                                <button key={wishlist.id} className="flex text-left rounded-xl bg-surface dark:bg-surfaceDark shadow-elevation p-4" onClick={() => navigate(`/wishlists/${wishlist.id}`)}>
                                    <div className="flex-1">
                                        <div className="flex space-x-2 items-center">
                                            <h2 className="text-xl font-bold">{wishlist.name}</h2>
                                            <p className="text-sm">{t("wishlist_by", { ownerName: wishlist.ownerName })}</p>
                                        </div>
                                        <h5>{t("wishlist_item_unit", { count: wishlist.items.length})}</h5>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                </Container>
            )
            : (
                <Container>
                    <h2 className="my-10 font-bold text-xl">{t("home_hello", { displayName: user.displayName })}</h2>
                    <div className="px-6 text-center">
                        <h2 className="py-4 text-lg">{t("recent_no_wishlist")}</h2>
                        <h3 className="">{t("recent_no_wishlist_subtitle")}</h3>
                    </div>
                    <ButtonCallToAction size="sm" onClick={() => navigate("/")} className="mt-10">{t("recent_go_to_my_wishlists")}</ButtonCallToAction>
                </Container>
            )
    );
}

export default RecentPage;
