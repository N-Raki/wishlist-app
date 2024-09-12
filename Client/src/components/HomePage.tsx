import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "./ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "./Container/Container.tsx";
import {useCurrentUser} from "./../hooks/useCurrentUser.ts";
import WishlistGrid from "./WishlistGrid.tsx";

function HomePage() {
    const { t } = useTranslation();
    const { data: user, isSuccess: isConnected } = useCurrentUser();
    const navigate = useNavigate();
    
    if (!isConnected) {
        return (
            <Container>
                <h1 className="text-3xl lg:text-6xl lg:max-w-xl text-center font-bold mx-5 mb-4 mt-20">
                    {t("home_title")}
                </h1>
                <h2 className="lg:text-xl">{t("home_subtitle")}</h2>
                <ButtonCallToAction className="my-20" size="lg" onClick={() => navigate('/register')}>
                    {t("home_create_wishlist")}
                </ButtonCallToAction>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="my-10 font-bold text-xl">{t("home_hello", {displayName: user?.displayName})}</h2>
            {user?.wishlists.length > 0 ? (
                <WishlistGrid wishlists={user.wishlists}/>
            ) : (
                <div className="text-center">
                    <h3 className="py-4">{t("home_no_wishlist")}</h3>
                </div>
            )}
            <ButtonCallToAction className="mt-10" size="lg" onClick={() => navigate("/wishlists/new")} >
                {t("home_create_wishlist")}
            </ButtonCallToAction>
        </Container>
    );
}

export default HomePage;
