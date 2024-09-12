import {useNavigate} from "react-router-dom";
import Container from "../Container/Container.tsx";
import {useTranslation} from "react-i18next";
import {useRecentWishlists} from "../../hooks/useRecentWishlists.ts";
import RecentWishlistsGrid from "./RecentWishlistGrid.tsx";
import NoRecentWishlists from "./NoRecentWishlists.tsx";

function RecentPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const { userQuery, recentWishlistsQuery } = useRecentWishlists();
    
    if (!userQuery.isSuccess)
    {
        navigate("/");
        return;
    }
    
    const user = userQuery.data;
    const recentWishlists = recentWishlistsQuery.data;
    
    return (
        <Container>
            <h2 className="my-10 font-bold text-xl">{t("home_hello", { displayName: user?.displayName })}</h2>
            {recentWishlists && recentWishlists.length > 0 ? (
                <RecentWishlistsGrid wishlists={recentWishlists} />
            ) : (
                <NoRecentWishlists />
            )}
        </Container>
    );
}

export default RecentPage;
