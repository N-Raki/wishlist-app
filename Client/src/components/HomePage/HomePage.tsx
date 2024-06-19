import { useTranslation } from "react-i18next";
import {User} from "../../models/user.model.ts";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../services/user.service.ts";

function HomePage() {
    const { t } = useTranslation();
    
    const {
        data: user,
        isSuccess: isConnected,
        isLoading
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});
    
    const navigate = useNavigate();
    
    if (isLoading) {
        return (
            <Container>{null}</Container>
        );
    }
    
    if (isConnected) {
        return (
            user && user.wishlists.length > 0
                ? (
                    <Container>
                        <h2 className="my-10 font-bold text-xl">{t("home_hello", { displayName: user.displayName })}</h2>
                        <div className={`px-6 w-full max-w-xl grid grid-cols-1 ${user.wishlists.length > 1 ? "lg:grid-cols-2" : ""} gap-4`}>
                            {
                                user.wishlists.map(wishlist => (
                                    <button key={wishlist.id} className="flex text-left rounded-xl bg-surface dark:bg-surfaceDark shadow-elevation p-4" onClick={() => navigate(`/wishlists/${wishlist.id}`)}>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold">{wishlist.name}</h2>
                                            <h5>{t("wishlist_item_unit", { count: wishlist.items.length})}</h5>
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                        <ButtonCallToAction size="lg" onClick={() => navigate("/wishlists/new")} className="mt-10">{t("home_create_wishlist")}</ButtonCallToAction>
                    </Container>
                )
                : (
                    <Container>
                        <h2 className="my-10 font-bold text-xl">{t("home_hello", { displayName: user.displayName })}</h2>
                        <div className="text-center">
                            <h3 className="py-4">{t("home_no_wishlist")}</h3>
                            <ButtonCallToAction size="lg" onClick={() => navigate("/wishlists/new")} className="m-auto">{t("home_create_wishlist")}</ButtonCallToAction>
                        </div>
                    </Container>
                )
        );
    }
    else {
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
}

export default HomePage;
