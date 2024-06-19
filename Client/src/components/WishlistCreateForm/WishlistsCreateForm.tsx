import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {WishlistCreateRequest} from "../../models/requests/wishlist-create.model.ts";
import {Wishlist} from "../../models/wishlist.model.ts";
import {createWishlist} from "../../services/wishlists.service.ts";
import FormInput from "../FormInput/FormInput.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useTranslation} from "react-i18next";

class WishlistCreateFormData {
    name: string = '';
}

function WishlistsCreateForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const validationScheme: ObjectSchema<WishlistCreateFormData> = Yup.object({
        name: Yup.string().required(t("validation_name_required"))
    });
    
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<WishlistCreateFormData>({resolver: yupResolver(validationScheme), mode: 'onSubmit'});
    
    const mutation = useMutation({
        mutationFn: createWishlist,
        onSuccess: async (wishlist: Wishlist) => {
            toast.success(t("wishlist_create_toast_success"));
            navigate('/wishlists/' + wishlist.id);
        }
    });
    
    const onSubmit = async (data: WishlistCreateFormData) => {
        const request: WishlistCreateRequest = {
            name: data.name
        }
        await mutation.mutateAsync(request);
    }
    
    return (
        <Container>
            <h2 className="text-2xl mb-6 mt-20">{t("wishlist_create_title")}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl px-5 flex-col flex-grow">
                <div className="space-y-4">
                    <FormInput
                        required
                        autoFocus
                        id="name"
                        label={t("wishlist_create_label_name")}
                        type="text"
                        register={register}
                        errorMessage={errors.name?.message}
                    />
                </div>
                <div className="w-full flex justify-center mt-10">
                    <ButtonCallToAction size="lg" type="submit" className="py-1.5">
                        {t("wishlist_create_submit")}
                    </ButtonCallToAction>
                </div>
            </form>
        </Container>
    );
}

export default WishlistsCreateForm;