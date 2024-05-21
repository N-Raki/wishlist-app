import {FC, Fragment, useState} from "react";
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
import {Dialog, Transition} from "@headlessui/react";
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

interface WishlistItemProps {
    item: Item;
    mode: "anonymous" | "user" | "owner";
}

class EditItemFormData {
    name: string = "";
    price?: number | null;
    url?: string | null;
}

const validationScheme = Yup.object({
    name: Yup.string().required("Name is required"),
    price: Yup.number()
        .nullable()
        .transform((val, originalValue) => originalValue === "" ? undefined : val)
        .typeError('Price must be a number')
        .positive('Price must be positive'),
    url: Yup.string().url("Invalid URL").nullable()
});

const WishlistItem: FC<WishlistItemProps> = ({item, mode}) => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [openEditModal, setOpenEditModal] = useState(false);
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
            toast.success('Item updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteItem(item.wishlistId, item.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success('Item deleted');
        },
    });

    const pickMutation = useMutation({
        mutationFn: () => pickItem(item.wishlistId, item.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success('Item picked');
        },
    });

    const unpickMutation = useMutation({
        mutationFn: () => unpickItem(item.wishlistId, item.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success('Item unpicked');
        },
    });

    const onSubmit = (data: EditItemFormData) => {
        const itemCreateRequest: ItemCreateRequest = {
            name: data.name,
            price: data.price,
            url: data.url
        }
        if (isDirty) updateItemMutation.mutate(itemCreateRequest);
        else setOpenEditModal(false);
    }

    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
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
        <div key={item.id}
             className="flex flex-col divide-y dark:divide-gray-700 rounded-lg bg-surface dark:bg-surfaceDark text-center shadow-elevation transition-colors">

            <Modal openModal={openLoginModal} setOpenModal={setOpenLoginModal}>
                <div className="flex flex-col gap-y-4 py-4 px-8">
                    <p>You need to be logged in to pick an item.</p>
                    <div className="m-auto">
                        <ButtonCallToAction size="md" className="gap-x-3" onClick={handleLoginRedirect}>
                            <CheckIcon className="h-4 w-4" aria-hidden="true"/> Log in
                        </ButtonCallToAction>
                    </div>
                </div>
            </Modal>

            <Transition.Root show={openEditModal} as={Fragment}>
                <Dialog className="relative z-10" onClose={setOpenEditModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-backgroundDark/25 dark:bg-background/25 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto content-center">
                        <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden rounded-lg bg-background dark:bg-surfaceDark text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 py-4 px-8">
                                        <FormInput required autoFocus id="name" label="Name" register={register}
                                                   errorMessage={errors.name?.message}/>
                                        <FormInput autoFocus id="price" type="number" label="Price (€)"
                                                   register={register} errorMessage={errors.price?.message}/>
                                        <FormInput autoFocus id="url" label="Url" register={register}
                                                   errorMessage={errors.url?.message}/>
                                        <div className="flex flex-row gap-4 m-auto">
                                            <div className="flex-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenEditModal(false)}
                                                    className="rounded-md bg-red-500 shadow-btn inline-flex gap-x-3 items-center px-4 py-2 text-white">
                                                    <XMarkIcon className="h-4 w-4" aria-hidden="true"/> Cancel
                                                </button>
                                            </div>
                                            <div className="flex-1">
                                                <ButtonCallToAction size="md" className="gap-x-3" type="submit" disabled={!isDirty}>
                                                    <CheckIcon className="h-4 w-4" aria-hidden="true"/> Save
                                                </ButtonCallToAction>
                                            </div>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <div className="flex flex-col flex-1 p-3">
                <div className="text-left">
                    <h2>{item.name}</h2>
                    {
                        item.price
                            ? <p className="text-sm text-gray-500">{item.price} €</p>
                            : <p className="text-xs text-gray-500 italic">No price</p>
                    }
                </div>
                {
                    mode == "user"
                        ? buyerQueries.length > 0
                            ? (
                                <div className="flex flex-row gap-2 pt-2">
                                    <div className="content-center">
                                        <p className="text-sm">Buyers:</p>
                                    </div>
                                    <div className="flex flex-row gap-3 flex-wrap">
                                        {
                                            buyerQueries.map((buyerQuery, index) => {
                                                if (buyerQuery.isSuccess) {
                                                    const displayName: string = buyerQuery.data;
                                                    return <div key={index}
                                                                className="h-7 w-7 flex-shrink-0 rounded-full p-1"
                                                                style={{backgroundColor: stringToColor(displayName)}}>
                                                        <p>{displayName[0].toUpperCase()}</p>
                                                    </div>
                                                }
                                                return null;
                                            })
                                        }
                                    </div>
                                </div>
                            )
                            : (
                                <div className="text-left flex-1 content-center pt-2 text-xs">
                                    No buyers yet.
                                </div>
                            )
                        : null
                }
            </div>
            <div>
                <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-700">
                    {
                        mode == "owner"
                            ? (
                                <button
                                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold"
                                    onClick={onEdit}
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/> Edit
                                </button>
                            )
                            :
                            item.url
                                ? (
                                    <div className="flex w-0 flex-1">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-3 text-sm font-semibold"
                                        >
                                            <LinkIcon className="h-5 w-5 text-gray-400"
                                                      aria-hidden="true"/>
                                            Visit website
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
                                        className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold"
                                        onClick={() => deleteMutation.mutate()}
                                    >
                                        <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/> Delete
                                    </button>
                                )
                                : isUserAuthenticated && item.buyerIds.includes(user.id)
                                    ? (
                                        <button
                                            type="button"
                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold"
                                            onClick={() => unpickMutation.mutate()}
                                        >
                                            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-gray-400"
                                                                         aria-hidden="true"/> Unpick
                                        </button>
                                    )
                                    : (
                                        <button
                                            type="button"
                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold"
                                            onClick={() => onPick()}
                                        >
                                            <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-400"
                                                                            aria-hidden="true"/> Pick
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