import { useTranslation } from "react-i18next";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import { useNavigate } from "react-router-dom";
import {FC} from "react";

const NoRecentWishlists: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="px-6 text-center flex flex-col items-center">
            <h2 className="py-4 text-lg">{t("recent_no_wishlist")}</h2>
            <h3>{t("recent_no_wishlist_subtitle")}</h3>
            <ButtonCallToAction size="sm" onClick={() => navigate("/")} className="mt-10">
                {t("recent_go_to_my_wishlists")}
            </ButtonCallToAction>
        </div>
    );
};

export default NoRecentWishlists;
