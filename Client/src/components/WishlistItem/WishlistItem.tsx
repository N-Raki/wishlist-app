import {FC, useState} from "react";
import {useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query";
import {getCurrentUser, getUserDisplayName} from "../../services/user.service.ts";
import {Item} from "../../models/item.model.ts";
import {
    ArrowLeftEndOnRectangleIcon,
    ArrowRightStartOnRectangleIcon,
    CheckIcon,
    LinkIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/20/solid";
import {stringToColor} from "../../helpers/avatarHelper.ts";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {ItemCreateRequest} from "../../models/requests/item-create.model.ts";
import {deleteItem, pickItem, unpickItem, updateItem} from "../../services/items.service.ts";
import toast from "react-hot-toast";
import FormInput from "../FormInput/FormInput.tsx";
import {XMarkIcon} from "@heroicons/react/24/outline";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import {User} from "../../models/user.model.ts";
import {useLocation, useNavigate} from "react-router-dom";
import Modal from "../Modal/Modal.tsx";
import { Tooltip } from 'react-tooltip'
import {useTranslation} from "react-i18next";

interface WishlistItemProps {
    item: Item;
    mode: "anonymous" | "user" | "owner";
}

class EditItemFormData {
    name: string = "";
    price?: number | null;
    url?: string | null;
}

const WishlistItem: FC<WishlistItemProps> = ({item, mode}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);

    const buyerQueries = useQueries({
        queries: item.buyerIds.map((userId) => {
            return {
                queryKey: ["buyer", userId],
                queryFn: () => getUserDisplayName(userId),
            };
        }),
    });
    
    const {
        data: user,
        isSuccess: isUserAuthenticated
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const validationScheme = Yup.object({
        name: Yup.string().required(t("validation_name_required")),
        price: Yup.number()
            .nullable()
            .transform((val, originalValue) => originalValue === "" ? undefined : val)
            .min(0, t("validation_no_negative_price")),
        url: Yup.string().url(t("validation_url_invalid")).nullable()
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: {errors, isDirty},
    } = useForm<EditItemFormData>({
        resolver: yupResolver(validationScheme), mode: "onSubmit", defaultValues: {
            name: item.name,
            price: item.price,
            url: item.url
        }
    });

    const updateItemMutation = useMutation({
        mutationFn: (data: ItemCreateRequest) => updateItem(item.wishlistId, item.id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            setOpenEditModal(false);
            toast.success(t("wishlist_item_update_toast_success"));
        },
    });


    const deleteItemMutation = useMutation({
        mutationFn: () => deleteItem(item.wishlistId, item.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success(t("wishlist_item_delete_toast_success"));
        },
    });

    const pickMutation = useMutation({
        mutationFn: () => pickItem(item.wishlistId, item.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success(t("wishlist_item_pick_toast_success"));
        },
    });

    const unpickMutation = useMutation({
        mutationFn: () => unpickItem(item.wishlistId, item.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success(t("wishlist_item_unpick_toast_success"));
        },
    });

    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location.pathname}});
    }

    const onSubmit = (data: EditItemFormData) => {
        const itemCreateRequest: ItemCreateRequest = {
            name: data.name,
            price: data.price,
            url: data.url
        }
        if (isDirty) updateItemMutation.mutate(itemCreateRequest);
        else setOpenEditModal(false);
    }
    
    const onEdit = () => {
        reset(item);
        setOpenEditModal(true);
    }
    
    const onPick = () => {
        if (isUserAuthenticated && mode != "owner") {
            pickMutation.mutate();
        } else if (!isUserAuthenticated) {
            setOpenLoginModal(true);
        }
    }

    return (
        <div key={item.id} className="flex flex-col divide-y divide-gray-200 rounded-lg bg-surface dark:bg-surfaceDark text-center shadow-elevation">
            
            <Modal openModal={openDeleteModal} onClose={setOpenDeleteModal}>
                <div className="text-center p-4 space-y-2">
                    <h2 className="p-2">{t("wishlist_item_delete_modal_title")}</h2>
                    <div className="flex">
                        <div className="flex flex-1 justify-center">
                            <button type="button" className="shadow-md bg-secondary-300 rounded-md py-1 px-4 text-white" onClick={() => setOpenDeleteModal(false)}>
                                {t("wishlist_item_delete_modal_cancel")}
                            </button>
                        </div>
                        <div className="flex flex-1 justify-center">
                            <button type="button" className="flex flex-inline gap-x-2 items-center shadow-md bg-red-500 rounded-md py-1.5 px-4 text-white" onClick={() => deleteItemMutation.mutate()}>
                                <TrashIcon className="h-4 w-4 text-white"/>{t("wishlist_item_delete_modal_submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            
            <Modal openModal={openLoginModal} onClose={setOpenLoginModal}>
                <div className="flex flex-col gap-y-4 py-4 px-8 text-center">
                    <p>{t("wishlist_item_pick_modal_login_title")}</p>
                    <div className="m-auto">
                        <ButtonCallToAction size="md" className="gap-x-3" onClick={handleLoginRedirect}>
                            <CheckIcon className="h-4 w-4" aria-hidden="true"/> {t("wishlist_item_pick_modal_login_submit")}
                        </ButtonCallToAction>
                    </div>
                </div>
            </Modal>
            
            <Modal title={t("wishlist_item_edit_modal_title")} openModal={openEditModal} onClose={setOpenEditModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 py-4 px-8">
                    <FormInput required id="name" label={t("wishlist_item_edit_label_name")} register={register}
                               errorMessage={errors.name?.message}/>
                    <FormInput autoFocus id="price" type="number" label={t("wishlist_item_edit_label_price")}
                               register={register} errorMessage={errors.price?.message}/>
                    <FormInput autoFocus id="url" label={t("wishlist_item_edit_label_url")} register={register}
                               errorMessage={errors.url?.message}/>
                    <div className="flex flex-row gap-4 m-auto">
                        <div className="flex-1">
                            <button
                                type="button"
                                onClick={() => setOpenEditModal(false)}
                                className="rounded-md bg-red-500 shadow-btn inline-flex gap-x-3 items-center px-4 py-2 text-white">
                                <XMarkIcon className="h-4 w-4" aria-hidden="true"/> {t("wishlist_item_edit_cancel")}
                            </button>
                        </div>
                        <div className="flex-1">
                            <ButtonCallToAction size="md" className="gap-x-3" type="submit" disabled={!isDirty}>
                                <CheckIcon className="h-4 w-4" aria-hidden="true"/> {t("wishlist_item_edit_submit")}
                            </ButtonCallToAction>
                        </div>
                    </div>
                </form>
            </Modal>

            <div className="flex flex-col flex-1 p-3">
                <div className="text-left">
                    <h2>{item.name}</h2>
                    {
                        item.price
                            ? <p className="text-sm text-gray-500">{t("wishlist_item_price", { price: item.price })}</p>
                            : <p className="text-xs text-gray-500 italic">{t("wishlist_item_no_price")}</p>
                    }
                    {
                        mode == "owner" && item.url
                            ? (
                                <button className="flex gap-x-1 text-left text-xs text-blue-500 items-end mt-2" onClick={() => window.open(item.url!, "_blank")}>
                                    <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    {t("wishlist_item_link_button")}
                                </button>
                            )
                            : null
                    }
                </div>
                {
                    mode == "user"
                        ? buyerQueries.length > 0
                            ? (
                                <div className="flex flex-row gap-2 pt-2">
                                    <div className="content-center">
                                        <p className="text-sm">{t("wishlist_item_buyers_title")}</p>
                                    </div>
                                    <div className="flex flex-row gap-3 flex-wrap">
                                        {
                                            buyerQueries.map((buyerQuery, index) => {
                                                if (buyerQuery.isSuccess) {
                                                    const displayName: string = buyerQuery.data;
                                                    return <a key={index}
                                                                data-tooltip-id="avatar-tooltip"
                                                                data-tooltip-content={displayName}
                                                                data-tooltip-place="top"
                                                                className="h-7 w-7 flex-shrink-0 rounded-full p-1"
                                                                style={{backgroundColor: stringToColor(displayName)}}>
                                                        <p>{displayName[0].toUpperCase()}</p>
                                                        <Tooltip id="avatar-tooltip" />
                                                    </a>
                                                }
                                                return null;
                                            })
                                        }
                                    </div>
                                </div>
                            )
                            : (
                                <div className="text-left flex-1 content-center pt-2 text-xs">
                                    {t("wishlist_item_no_buyers")}
                                </div>
                            )
                        : null
                }
            </div>
            <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                    {
                        mode == "owner"
                            ? (
                                <button
                                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-3 text-sm font-semibold focus-visible:outline-0"
                                    onClick={onEdit}
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/> {t("wishlist_item_edit_button")}
                                </button>
                            )
                            :
                            item.url
                                ? (
                                    <div className="flex w-0 flex-1">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-3 text-sm font-semibold focus-visible:outline-0"
                                        >
                                            <LinkIcon className="h-5 w-5 text-gray-400"
                                                      aria-hidden="true"/>
                                            {t("wishlist_item_link_button")}
                                        </a>
                                    </div>
                                )
                                : null
                    }
                    <div className="-ml-px flex w-0 flex-1">
                        {
                            mode == "owner"
                                ? (
                                    <button
                                        type="button"
                                        className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold focus-visible:outline-0"
                                        onClick={() => setOpenDeleteModal(true)}
                                    >
                                        <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/> {t("wishlist_item_delete_button")}
                                    </button>
                                )
                                : isUserAuthenticated && item.buyerIds.includes(user.id)
                                    ? (
                                        <button
                                            type="button"
                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold focus-visible:outline-0"
                                            onClick={() => unpickMutation.mutate()}
                                        >
                                            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-gray-400"
                                                                         aria-hidden="true"/> {t("wishlist_item_unpick_button")}
                                        </button>
                                    )
                                    : (
                                        <button
                                            type="button"
                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold focus-visible:outline-0"
                                            onClick={() => onPick()}
                                        >
                                            <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-400"
                                                                            aria-hidden="true"/> {t("wishlist_item_pick_button")}
                                        </button>
                                    )

                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishlistItem;