import './WishlistView.css'
import {FC, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Wishlist} from "../../models/wishlist.model.ts";
import toast from "react-hot-toast";
import {useForm} from "react-hook-form";
import {ItemCreateRequest} from "../../models/requests/item-create.model.ts";
import * as Yup from "yup";
import {ObjectSchema} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {User} from "../../models/user.model.ts";
import {deleteWishlist, getWishlist} from "../../services/wishlists.service.ts";
import {getCurrentUser, getUserDisplayName} from "../../services/user.service.ts";
import {createItem} from "../../services/items.service.ts";
import Container from "../Container/Container.tsx";
import WishlistItem from "../WishlistItem/WishlistItem.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import {LinkIcon, PlusIcon, TrashIcon} from "@heroicons/react/20/solid";
import FormInput from "../FormInput/FormInput.tsx";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Modal from "../Modal/Modal.tsx";

interface WishlistViewProps {
}

const itemSchema: ObjectSchema<ItemCreateRequest> = Yup.object({
    name: Yup.string().required('Name is required'),
    url: Yup.string().url('Invalid URL'),
    price: Yup.number()
        .nullable()
        .transform((val, originalValue) => originalValue === "" ? undefined : val)
        .typeError('Price must be a number')
        .positive('Price must be positive')
});

const WishlistView: FC<WishlistViewProps> = () => {
    const [openAddItemModal, setOpenAddItemModal] = useState(false);
    const [openDeleteWishlistModal, setOpenDeleteWishlistModal] = useState(false);

    const queryClient = useQueryClient();
    const {guid} = useParams();
    if (!guid) {
        toast.error('No wishlist guid provided');
        return <Navigate to="/"/>;
    }

    const {
        isSuccess: isUserConnected
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const {
        data: wishlist,
        isLoading,
        isSuccess,
        isError
    } = useQuery<Wishlist>({
        queryKey: ['user', 'wishlist', guid],
        queryFn: () => getWishlist(guid),
        retry: false
    });
    
    const ownerUserId = wishlist?.userId;
    const {
        data: ownerDisplayName
    } = useQuery<string>({
        queryKey: ['owner', ownerUserId],
        queryFn: () => getUserDisplayName(ownerUserId!),
        enabled: !!wishlist && !wishlist.isOwner && !!ownerUserId
    });

    const deleteWishlistMutation = useMutation({
        mutationFn: deleteWishlist,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success('Wishlist deleted');
        },
    });

    const createItemMutation = useMutation({
        mutationFn: (data: ItemCreateRequest) => createItem(guid, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
            toast.success('Item added');
            itemReset();
        },
    });

    const {
        register: itemRegister,
        handleSubmit: itemHandleSubmit,
        formState: {errors: itemErrors, isDirty},
        reset: itemReset
    } = useForm<ItemCreateRequest>({resolver: yupResolver(itemSchema), mode: 'onChange', defaultValues: {
        name: '',
        url: '',
        price: null
    }});

    const onAddItem = async (data: ItemCreateRequest) => {
        await createItemMutation.mutateAsync(data);
        setOpenAddItemModal(false);
    }
    
    const onCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(_ =>
            toast.success('Link copied to clipboard')
        );
    }
    
    const mode = wishlist?.isOwner ? "owner" : isUserConnected ? "user" : "anonymous";
    
    if (isLoading) {
        return <Container>{null}</Container>;
    }

    if (isError) {
        return <Navigate to="/"/>;
    }
    
    if (isSuccess) {
        return (
            <Container>

                {/* Add item modal */}
                <Modal title="Add a new item" openModal={openAddItemModal} onClose={(value: boolean) => {
                    setOpenAddItemModal(value);
                    itemReset();
                }}>
                    <form onSubmit={itemHandleSubmit(onAddItem)} className="flex flex-col gap-y-4 py-4 px-8">
                        <FormInput required id="name" label="Name" register={itemRegister}
                                   errorMessage={itemErrors.name?.message}/>
                        <FormInput id="price" type="number" label="Price (€)"
                                   register={itemRegister} errorMessage={itemErrors.price?.message}/>
                        <FormInput id="url" label="Url" register={itemRegister}
                                   errorMessage={itemErrors.url?.message}/>
                        <div className="flex flex-row gap-4 m-auto">
                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => setOpenAddItemModal(false)}
                                    className="rounded-md bg-red-500 shadow-btn inline-flex gap-x-3 items-center px-4 py-2 text-white">
                                    <XMarkIcon className="h-4 w-4" aria-hidden="true"/> Cancel
                                </button>
                            </div>
                            <div className="flex-1">
                                <ButtonCallToAction size="md" className="gap-x-3" type="submit" disabled={!isDirty}>
                                    <PlusIcon className="h-4 w-4" aria-hidden="true"/> Add
                                </ButtonCallToAction>
                            </div>
                        </div>
                    </form>
                </Modal>
                
                <Modal openModal={openDeleteWishlistModal} onClose={setOpenDeleteWishlistModal}>
                    <div className="text-center p-4 space-y-2">
                        <h2 className="p-2">Are you sure you want to delete this wishlist ?</h2>
                        <div className="flex">
                            <div className="flex flex-1 justify-center">
                                <button type="button" className="shadow-md bg-secondary-300 rounded-md py-1.5 px-4 text-white" onClick={() => setOpenDeleteWishlistModal(false)}>
                                    Cancel
                                </button>
                            </div>
                            <div className="flex flex-1 justify-center">
                                <button type="button" className="flex flex-inline gap-x-2 items-center shadow-md bg-red-500 rounded-md py-1.5 px-2 sm:px-4 text-white" onClick={() => deleteWishlistMutation.mutateAsync(guid)}>
                                    <TrashIcon className="h-4 w-4 text-white"/>Delete wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
                
                {/* Title */}
                <div className="mt-4 mb-8 text-center">
                    <h1 className="text-3xl font-bold">{wishlist.name}</h1>
                    {
                        !wishlist.isOwner && ownerDisplayName
                            ? <p className="italic">by {ownerDisplayName}</p>
                            : null
                    }
                </div>

                {/* Items */}
                {
                    wishlist.items.length === 0
                        ? (
                            <h5 className="py-20">This wishlist is empty</h5>
                        )
                        : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 mb-10 w-full max-w-3xl">
                                {wishlist.items.map((item) =>
                                    <WishlistItem key={item.id} item={item} mode={mode} />
                                )}
                            </div>
                        )
                }

                {/* Action buttons */}
                {
                    wishlist.isOwner
                        ? (
                            <div className="flex flex-col gap-y-4 items-center">
                                <div className="justify-center hidden sm:flex gap-x-2">
                                    <ButtonCallToAction size="md" type="button" onClick={() => setOpenAddItemModal(true)}>
                                        <PlusIcon className="h-6 w-6" aria-hidden={true}/>
                                        Add item
                                    </ButtonCallToAction>
                                    <button type="button" onClick={onCopyLink} className="flex flex-auto rounded-md text-white bg-gradient-to-br from-violet-500 to-fuchsia-500 items-center px-2 text-sm gap-x-1">
                                        <LinkIcon className="h-5 w-5" aria-hidden={true}/>
                                        Copy link
                                    </button>
                                    <button className="flex flex-inline shadow-btn bg-red-500 rounded-md text-white px-3 py-1.5 items-center gap-x-3 text-sm" onClick={() => setOpenDeleteWishlistModal(true)}>
                                        <TrashIcon className="h-4 w-4 text-white"/>Delete wishlist
                                    </button>
                                </div>
                                <div className="fixed bottom-6 right-6 flex gap-x-3 items-center">
                                    <button onClick={() => setOpenDeleteWishlistModal(true)}
                                            className="justify-center mt-10 sm:hidden rounded-full w-10 h-10 bg-red-500 p-2 text-white shadow-btn">
                                        <TrashIcon className="h-5 w-5 m-auto" aria-hidden={true}/>
                                    </button>
                                    <button onClick={onCopyLink}
                                            className="justify-center mt-10 sm:hidden rounded-full w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2 text-white shadow-btn">
                                        <LinkIcon className="h-7 w-7 m-auto" aria-hidden={true}/>
                                    </button>
                                    <button onClick={() => setOpenAddItemModal(true)}
                                            className="justify-center mt-10 sm:hidden rounded-full w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2 text-white shadow-btn">
                                        <PlusIcon aria-hidden={true}/>
                                    </button>
                                </div>
                                <div className="justify-center">
                                </div>
                            </div>
                        )
                        : null
                }

            </Container>
        );
    } else {
        return (
            <Container>
                {null}
            </Container>
        )
    }
};

export default WishlistView;