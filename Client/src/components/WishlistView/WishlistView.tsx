import './WishlistView.css'
import {FC, useState} from "react";
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Wishlist} from "../../models/wishlist.model.ts";
import WishlistsService from "../../services/wishlists.service.ts";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import toast from "react-hot-toast";
import {
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Link, Modal,
    Paper,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import ItemsService from "../../services/items.service.ts";
import {deepOrange, deepPurple, pink} from "@mui/material/colors";
import {useForm} from "react-hook-form";
import {ItemCreateRequest} from "../../models/requests/item-create.model.ts";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog.tsx";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";
import {User} from "../../models/user.model.ts";
import UserService from "../../services/user.service.ts";

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
    } = useQuery<User>({queryKey: ['user'], queryFn: UserService.getCurrentUser, retry: false});

    const {
        data: wishlist,
        isSuccess,
        isError
    } = useQuery<Wishlist>({
        queryKey: ['user', 'wishlist'],
        queryFn: () => WishlistsService.getWishlist(guid),
        retry: false
    });

    const deleteWishlistMutation = useMutation({
        mutationFn: WishlistsService.deleteWishlist,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['wishlist']});
            toast.success('Wishlist deleted');
        },
    });

    class DeleteItemMutationData {
        itemId: string = '';
        wishlistId: string = '';
    }

    const createItemMutation = useMutation({
        mutationFn: (data: ItemCreateRequest) => ItemsService.createItem(guid, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['wishlist']});
            toast.success('Item added');
            itemReset();
        },
    });

    const updateItemMutation = useMutation({
        mutationFn: (data: ItemCreateRequest) => ItemsService.updateItem(guid, editingItemId!, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['wishlist']});
            toast.success('Item updated');
        },
    });

    const deleteItemMutation = useMutation({
        mutationFn: (data: DeleteItemMutationData) => ItemsService.deleteItem(data.wishlistId, data.itemId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['wishlist']});
            toast.success('Item deleted');
        },
    });

    const {
        register: itemRegister,
        handleSubmit: itemHandleSubmit,
        formState: {errors: itemErrors, isDirty: itemIsDirty},
        reset: itemReset
    } = useForm<ItemCreateRequest>({resolver: yupResolver(itemSchema), mode: 'onChange'});

    const onAddItem = async (data: ItemCreateRequest) => {
        await createItemMutation.mutateAsync(data);
        setEditingItemId(undefined);
    }

    const onEditItem = async (data: ItemCreateRequest) => {
        if (itemIsDirty) await updateItemMutation.mutateAsync(data);
        setEditingItemId(undefined);
    }

    const onCancel = () => {
        setEditingItemId(undefined);
    }
    
    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
    }

    const isAuthenticatedAndNotOwner = userIsSuccess && !wishlist?.isOwner;

    const onPick = () => {
        if (isAuthenticatedAndNotOwner) {
            // Confirmation Modal + Add to buyer ids
        } else if (!userIsSuccess) {
            // Modal de connexion
            setIsLoginModalOpen(true);
        }
    }

    if (isError) {
        return <Navigate to="/"/>;
    }

    if (isSuccess && wishlist) {
        return (
            <Box>
                <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Paper sx={{
                        position: 'absolute' as 'absolute',
                        justifyContent:'center',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'fit-content',
                        height: 'fit-content',
                        p: 4
                    }}>
                        {
                                <Stack spacing={2} flexWrap="wrap" sx={{alignItems:'center'}}>
                                    <Typography sx={{textAlign:'center'}}>You need to be logged in to pick an item</Typography>
                                    <Button variant={'contained'} sx={{width:'fit-content'}} onClick={handleLoginRedirect}>Login</Button>
                                </Stack>
                        }
                    </Paper>
                </Modal>
                <ApplicationBar/>
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
                                <Box component={'form'} noValidate onSubmit={itemHandleSubmit(onEditItem)}>
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
                                            {wishlist.items.sort((a, b) => a.name.localeCompare(b.name)).map((item) => {
                                                return (
                                                    <TableRow key={item.id}
                                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                        <TableCell>
                                                            {
                                                                editingItemId === item.id ?
                                                                    <TextField
                                                                        required
                                                                        autoFocus
                                                                        fullWidth
                                                                        label={'Name'}
                                                                        size="small"
                                                                        {...itemRegister('name')}
                                                                        error={!!itemErrors.name}
                                                                        helperText={itemErrors.name?.message}
                                                                    /> :
                                                                    wishlist.isOwner || !item.url ?
                                                                        <Typography>{item.name}</Typography> :
                                                                        <Link href={item.url} underline={'hover'}>
                                                                            <Typography>{item.name}</Typography>
                                                                        </Link>
                                                            }
                                                        </TableCell>
                                                        {
                                                            wishlist.isOwner ?
                                                                <TableCell>
                                                                    {
                                                                        editingItemId === item.id ?
                                                                            <TextField
                                                                                fullWidth
                                                                                label={'Url'}
                                                                                size="small"
                                                                                {...itemRegister('url')}
                                                                                error={!!itemErrors.url}
                                                                                helperText={itemErrors.url?.message}
                                                                            /> :
                                                                            item.url ?
                                                                                <Link href={item.url} target={'_blank'}
                                                                                      underline={'hover'}>
                                                                                    <Typography>Link</Typography>
                                                                                </Link> :
                                                                                null
                                                                    }
                                                                </TableCell> :
                                                                null
                                                        }
                                                        <TableCell>
                                                            {
                                                                editingItemId === item.id ?
                                                                    <TextField
                                                                        fullWidth
                                                                        label={'Price'}
                                                                        type={'number'}
                                                                        size="small"
                                                                        {...itemRegister('price')}
                                                                        error={!!itemErrors.price}
                                                                        helperText={itemErrors.price?.message}
                                                                    /> :
                                                                    <Typography>{item.price}</Typography>
                                                            }
                                                        </TableCell>
                                                        {
                                                            isAuthenticatedAndNotOwner ?
                                                                <TableCell>
                                                                    <Stack direction={'row'} spacing={2}>
                                                                        <Avatar sx={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            fontSize: '14px',
                                                                            backgroundColor: deepOrange[500]
                                                                        }}>M</Avatar>
                                                                        <Avatar sx={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            fontSize: '14px',
                                                                            backgroundColor: pink[500]
                                                                        }}>A</Avatar>
                                                                        <Avatar sx={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            fontSize: '14px',
                                                                            backgroundColor: deepPurple[500]
                                                                        }}>C</Avatar>
                                                                    </Stack>
                                                                </TableCell> :
                                                                null
                                                        }
                                                        <TableCell>
                                                            {
                                                                wishlist.isOwner ?
                                                                    editingItemId === item.id ?
                                                                        <Stack direction={'row'} spacing={1}>
                                                                            <Button key={'saveButton'} type={'submit'}
                                                                                    variant={'contained'}
                                                                                    color={'success'}>Save</Button> :
                                                                            <Button key={'cancelButton'}
                                                                                    variant={'outlined'} color={'error'}
                                                                                    onClick={onCancel}>Cancel</Button>
                                                                        </Stack> :
                                                                        <Stack direction={'row'} spacing={1}>
                                                                            <Button key={'editButton'}
                                                                                    variant={'outlined'}
                                                                                    onClick={() => {
                                                                                        itemReset(item);
                                                                                        setEditingItemId(item.id);
                                                                                    }}>Edit</Button>
                                                                            <IconButton key={'deleteButton'}
                                                                                        aria-label="delete"
                                                                                        color={'error'}
                                                                                        onClick={() => deleteItemMutation.mutate({
                                                                                            wishlistId: guid,
                                                                                            itemId: item.id
                                                                                        })}>
                                                                                <DeleteOutlineIcon/>
                                                                            </IconButton>
                                                                        </Stack> :
                                                                    <Stack direction={'row'} spacing={1}>
                                                                        <Button variant={'outlined'} color={'success'}
                                                                                onClick={onPick}>Pick</Button>
                                                                    </Stack>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Box>
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