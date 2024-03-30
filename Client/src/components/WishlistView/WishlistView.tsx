import './WishlistView.css'
import {FC, useState} from "react";
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Wishlist} from "../../models/wishlist.model.ts";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Container,
    Modal,
    Paper,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import {useForm} from "react-hook-form";
import {ItemCreateRequest} from "../../models/requests/item-create.model.ts";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog.tsx";
import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import {User} from "../../models/user.model.ts";
import ItemTableRow from "../ItemTableRow/ItemTableRow.tsx";
import {deleteWishlist, getWishlist} from "../../services/wishlists.service.ts";
import {getCurrentUser} from "../../services/user.service.ts";
import {createItem} from "../../services/items.service.ts";

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
    const [editingItemId, setEditingItemId] = useState<string | undefined>(undefined);

    const [isDeleteWishlistDialogOpened, setIsDeleteWishlistDialogOpened] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const {guid} = useParams();
    if (!guid) {
        toast.error('No wishlist guid provided');
        return <Navigate to="/"/>;
    }

    const {
        isSuccess: userIsSuccess
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const {
        data: wishlist,
        isSuccess,
        isError
    } = useQuery<Wishlist>({
        queryKey: ['user', 'wishlist'],
        queryFn: () => getWishlist(guid),
        retry: false
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
        formState: {errors: itemErrors},
        reset: itemReset
    } = useForm<ItemCreateRequest>({resolver: yupResolver(itemSchema), mode: 'onChange'});

    const onAddItem = async (data: ItemCreateRequest) => {
        await createItemMutation.mutateAsync(data);
        setEditingItemId(undefined);
    }

    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
    }

    const isAuthenticatedAndNotOwner = userIsSuccess && !wishlist?.isOwner;

    if (isError) {
        return <Navigate to="/"/>;
    }

    if (isSuccess && wishlist) {
        return (
            <Box>
                <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}
                       aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Paper sx={{
                        position: 'absolute' as 'absolute',
                        justifyContent: 'center',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'fit-content',
                        height: 'fit-content',
                        p: 4
                    }}>
                        {
                            <Stack spacing={2} flexWrap="wrap" sx={{alignItems: 'center'}}>
                                <Typography sx={{textAlign: 'center'}}>You need to be logged in to pick an
                                    item</Typography>
                                <Button variant={'contained'} sx={{width: 'fit-content'}}
                                        onClick={handleLoginRedirect}>Login</Button>
                            </Stack>
                        }
                    </Paper>
                </Modal>
                <NavigationBar/>
                <Container sx={{
                    mt: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Typography variant={'h1'}>{wishlist.name}</Typography>
                    {
                        wishlist.items.length === 0 ?
                            <Typography variant={'h5'} sx={{my: '2rem'}}>This wishlist is empty</Typography> :
                            <TableContainer component={Paper} sx={{my: '2rem'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><Typography variant={'h6'}>Name</Typography></TableCell>
                                            {
                                                wishlist.isOwner ?
                                                    <TableCell><Typography
                                                        variant={'h6'}>Url</Typography></TableCell> :
                                                    null
                                            }
                                            <TableCell><Typography variant={'h6'}>Price</Typography></TableCell>
                                            {
                                                isAuthenticatedAndNotOwner ?
                                                    <TableCell><Typography
                                                        variant={'h6'}>Gifters</Typography></TableCell> :
                                                    null
                                            }
                                            <TableCell sx={{width: '20%'}}><Typography
                                                variant={'h6'}>Actions</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {wishlist.items.sort((a, b) => a.name.localeCompare(b.name)).map((item) =>
                                            <ItemTableRow key={item.id} item={item} isOwner={wishlist.isOwner}/>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    }
                    {
                        userIsSuccess && wishlist.isOwner ?
                            editingItemId === "new" ?
                                <Box component={'form'} noValidate onSubmit={itemHandleSubmit(onAddItem)}>
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        <TextField
                                            required
                                            label="Item name"
                                            {...itemRegister('name')}
                                            error={!!itemErrors.name}
                                            helperText={itemErrors.name?.message}
                                        />
                                        <TextField
                                            label="Item URL"
                                            {...itemRegister('url')}
                                            error={!!itemErrors.url}
                                            helperText={itemErrors.url?.message}
                                        />
                                        <TextField
                                            label="Item price"
                                            type="number"
                                            {...itemRegister('price')}
                                            error={!!itemErrors.price}
                                            helperText={itemErrors.price?.message}
                                        />
                                        <Button variant="outlined" size="large" type={'submit'}>Add item</Button>
                                    </Stack>
                                </Box> :
                                <Button variant={'outlined'} onClick={() => {
                                    itemReset({name: '', url: '', price: null});
                                    setEditingItemId("new");
                                }}>Add Item</Button> : null
                    }
                    {
                        userIsSuccess && wishlist.isOwner ?
                            <Stack spacing={2} direction={'row'} sx={{mt: '3rem'}}>
                                <Button variant={'outlined'} color={'error'}
                                        onClick={() => setIsDeleteWishlistDialogOpened(true)}>Delete Wishlist</Button>
                                <ConfirmationDialog
                                    open={isDeleteWishlistDialogOpened}
                                    title={'Delete wishlist'}
                                    content={'Are you sure you want to delete this wishlist ?'}
                                    onConfirm={() => deleteWishlistMutation.mutate(wishlist.id)}
                                    onCancel={() => setIsDeleteWishlistDialogOpened(false)}
                                />
                            </Stack> :
                            null
                    }
                </Container>
            </Box>
        );
    }
};

export default WishlistView;