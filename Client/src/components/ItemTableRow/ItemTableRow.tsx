import {FC, useState} from "react";
import {Item} from "../../models/item.model.ts";
import {
    Avatar,
    Button,
    IconButton,
    Link, Modal,
    Paper,
    Stack,
    TableCell,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useForm} from "react-hook-form";
import {ItemCreateRequest} from "../../models/requests/item-create.model.ts";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "../../models/user.model.ts";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import toast from "react-hot-toast";
import {useLocation, useNavigate} from "react-router-dom";
import {stringToColor} from "../../helpers/avatarHelper.ts";
import {getCurrentUser, getUserDisplayName} from "../../services/user.service.ts";
import {deleteItem, pickItem, unpickItem, updateItem} from "../../services/items.service.ts";

const itemSchema: ObjectSchema<ItemCreateRequest> = Yup.object({
    name: Yup.string().required('Name is required'),
    url: Yup.string().url('Invalid URL'),
    price: Yup.number()
        .nullable()
        .transform((val, originalValue) => originalValue === "" ? undefined : val)
        .typeError('Price must be a number')
        .positive('Price must be positive')
});

interface ItemTableRowProps {
    item: Item;
    isOwner: boolean;
}

const ItemTableRow: FC<ItemTableRowProps> = ({item, isOwner}) => {
    const queryClient = useQueryClient();

    const [editMode, setEditMode] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: {errors, isDirty},
    } = useForm<ItemCreateRequest>({resolver: yupResolver(itemSchema), mode: 'onChange'});

    const {
        data: user,
        isSuccess: isUserAuthenticated
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const buyerQueries = useQueries({
        queries: item.buyerIds.map((userId) => {
            return {
                queryKey: ['buyer', userId],
                queryFn: () => getUserDisplayName(userId),
            };
        }),
    });

    const updateMutation = useMutation({
        mutationFn: (data: ItemCreateRequest) => updateItem(item.wishlistId, item.id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user', 'wishlist']});
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

    const onEdit = () => {
        reset(item);
        setEditMode(true);
    }

    const onSave = async (data: ItemCreateRequest) => {
        if (isDirty) await updateMutation.mutateAsync(data);
        setEditMode(false);
    }

    const onPick = () => {
        if (isUserAuthenticated && !isOwner) {
            // Confirmation Modal + Add to buyer ids
            pickMutation.mutate();
        } else if (!isUserAuthenticated) {
            // Modal de connexion
            setIsLoginModalOpen(true);
        }
    }

    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
    }

    return (
        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            {/* Item name */}
            <TableCell>
                {
                    isOwner && editMode
                        ? <TextField
                            required
                            autoFocus
                            fullWidth
                            label={'Name'}
                            size={'small'}
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        : isOwner || !item.url
                            ? <Typography>{item.name}</Typography>
                            : <Link href={item.url} target={'_blank'} underline={'hover'}>
                                <Typography>{item.name}</Typography>
                            </Link>
                }
            </TableCell>

            {/* Item url */}
            {
                isOwner
                    ? <TableCell>
                        {
                            editMode
                                ? <TextField
                                    fullWidth
                                    label={'Url'}
                                    size={'small'}
                                    {...register('url')}
                                    error={!!errors.url}
                                    helperText={errors.url?.message}
                                />
                                : item.url
                                    ? <Link href={item.url} target={'_blank'} underline={'hover'}>
                                        <Typography>Link</Typography>
                                    </Link>
                                    : null
                        }
                    </TableCell>
                    : null
            }

            {/* Item price */}
            <TableCell>
                {
                    isOwner && editMode
                        ? <TextField
                            fullWidth
                            label={'Price'}
                            size={'small'}
                            type={'number'}
                            {...register('price')}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                        : <Typography>{item.price}</Typography>
                }
            </TableCell>

            {/* Item buyers */}
            {
                !isOwner && isUserAuthenticated
                    ? <TableCell>
                        <Stack direction={'row'} spacing={2}>
                            {
                                buyerQueries.map((buyerQuery, index) => {
                                    if (buyerQuery.isSuccess) {
                                        const displayName: string = buyerQuery.data;
                                        return <Avatar key={index} sx={{
                                            width: 24,
                                            height: 24,
                                            fontSize: 14,
                                            backgroundColor: stringToColor(displayName)
                                        }}>
                                            {displayName[0]}
                                        </Avatar>
                                    }
                                    return null;
                                })
                            }
                        </Stack>
                    </TableCell>
                    : null
            }

            {/* Item actions */}
            <TableCell>
                {
                    isOwner
                        ? editMode
                            ? <Stack direction={'row'} spacing={1}>
                                <Button key={'saveButton'} onClick={handleSubmit(onSave)}
                                        variant={'contained'}
                                        color={'success'}>Save</Button>
                                <Button key={'cancelButton'}
                                        variant={'outlined'} color={'error'}
                                        onClick={() => setEditMode(false)}>Cancel</Button>
                            </Stack>
                            : <Stack direction={'row'} spacing={1}>
                                <Button key={'editButton'}
                                        variant={'outlined'}
                                        onClick={onEdit}>Edit</Button>
                                <IconButton key={'deleteButton'}
                                            aria-label="delete"
                                            color={'error'}
                                            onClick={() => deleteMutation.mutate()}
                                >
                                    <DeleteOutlineIcon/>
                                </IconButton>
                            </Stack>
                        : isUserAuthenticated && item.buyerIds.includes(user.id)
                            ? <Button variant={'outlined'} color={'error'}
                                      onClick={() => unpickMutation.mutate()}>Unpick</Button>
                            : <Button variant={'outlined'} color={'success'}
                                      onClick={onPick}>Pick</Button>
                }
            </TableCell>


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
                            <Typography sx={{textAlign: 'center'}}>You need to be logged in to pick an item</Typography>
                            <Button variant={'contained'} sx={{width: 'fit-content'}}
                                    onClick={handleLoginRedirect}>Login</Button>
                        </Stack>
                    }
                </Paper>
            </Modal>
        </TableRow>

    );
}

export default ItemTableRow;