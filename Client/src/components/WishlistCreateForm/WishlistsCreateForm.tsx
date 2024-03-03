import './WishlistCreateForm.css'
import {FC, useState} from "react";
import {Box, Button, Container, Stack, styled, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import WishlistsService from "../../services/wishlists.service.ts";
import {useNavigate} from "react-router-dom";
import {WishlistCreateRequest} from "../../models/requests/wishlist-create.model.ts";
import {ItemCreateRequest} from "../../models/requests/item-create.model.ts";
import ItemsService from "../../services/items.service.ts";
import {Wishlist} from "../../models/wishlist.model.ts";

const wishlistSchema: ObjectSchema<WishlistCreateRequest> = Yup.object({
    name: Yup.string().required('Name is required')
});

const itemSchema: ObjectSchema<ItemCreateRequest> = Yup.object({
    name: Yup.string().required('Name is required'),
    url: Yup.string().url('Invalid URL'),
    price: Yup.number()
        .transform((val, originalValue) => originalValue === "" ? undefined : val)
        .typeError('Price must be a number')
        .positive('Price must be positive')
});

interface WishlistCreateFormProps {
}

const CustomTextField = styled(TextField)({
    '& .MuiFormHelperText-root.Mui-error': {
        position: 'absolute',
        top: '100%'
    }
});

const WishlistsCreateForm: FC<WishlistCreateFormProps> = () => {
    const [step, setStep] = useState(0);
    const [items, setItems] = useState<ItemCreateRequest[]>([]);

    const {
        register: wishlistRegister,
        handleSubmit: wishlistHandleSubmit,
        getValues: wishlistGetValues,
        formState: {errors: wishlistErrors}
    } = useForm<WishlistCreateRequest>({resolver: yupResolver(wishlistSchema), mode: 'onChange'});

    const {
        register: itemRegister,
        handleSubmit: itemHandleSubmit,
        reset: itemReset,
        formState: {errors: itemErrors}
    } = useForm<ItemCreateRequest>({resolver: yupResolver(itemSchema), mode: 'onChange'});

    const onWishlistSubmit = () => {
        setStep(1);
    };

    const onAddItem = (data: ItemCreateRequest) => {
        setItems([...items, data]);
        itemReset();
    };
    
    const navigate = useNavigate();
    
    class ItemMutationData {
        wishlistId: string = '';
        item: ItemCreateRequest = new ItemCreateRequest();
    }
    
    const wishlistMutation = useMutation({
        mutationFn: WishlistsService.createWishlist,
        onSuccess: async (wishlist: Wishlist) => {
            for (const item of items) {
                await itemMutation.mutateAsync({
                    wishlistId: wishlist.id,
                    item: item
                });
            }
            toast.success('Wishlist created successfully');
            navigate('/profile');
        }
    });
    
    const itemMutation = useMutation<any, Error, ItemMutationData>({
        mutationFn: (data) => ItemsService.createItem(data.wishlistId, data.item)
    });
    
    const createWishlist = async () => {
        await wishlistMutation.mutateAsync(wishlistGetValues());
    }

    return (
        <Container sx={{
            mt: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h4">Create a new wishlist</Typography>
            {step === 0 ?
                <Box component={'form'} noValidate onSubmit={wishlistHandleSubmit(onWishlistSubmit)} sx={{mt: '1rem'}}>
                    <Stack direction="row" spacing={2} alignItems={'center'} sx={{my: '1rem'}}>
                        <CustomTextField
                            required
                            fullWidth
                            label="Enter a name"
                            error={!!wishlistErrors.name}
                            helperText={wishlistErrors.name?.message}
                            {...wishlistRegister('name')}
                        />
                        <Button variant="contained" size="large" type={'submit'}>Next</Button>
                    </Stack>
                </Box> :
                <Box>
                    <Typography variant="h5">{wishlistGetValues().name}</Typography>
                    <Box component="form" noValidate onSubmit={itemHandleSubmit(onAddItem)}>
                        <Grid container direction="row" spacing={2} alignItems={'center'} sx={{mt: '1rem', mb: '2rem'}}>
                            <Grid item xs={3}>
                                <CustomTextField
                                    required
                                    label="Item name"
                                    error={!!itemErrors.name}
                                    helperText={itemErrors.name?.message}
                                    {...itemRegister('name')}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <CustomTextField
                                    label="Item URL"
                                    error={!!itemErrors.url}
                                    helperText={itemErrors.url?.message}
                                    {...itemRegister('url')}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <CustomTextField
                                    label="Item price"
                                    type="number"
                                    error={!!itemErrors.price}
                                    helperText={itemErrors.price?.message}
                                    {...itemRegister('price')}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button variant="contained" size="large" type={'submit'}>Add item</Button>
                            </Grid>
                        </Grid>
                    </Box>
                    {items.map((item, _) => (
                        <Grid container spacing={2} alignItems={'center'}>
                            <Grid item xs={3}>
                                <Typography variant="h6">{item.name}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="h6">{item.url}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="h6">{item.price}</Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                        </Grid>
                    ))}
                    <Button variant="contained" size="large" onClick={() => setStep(0)}>Back</Button>
                    <Button variant="contained" size="large" onClick={createWishlist}>Create</Button>
                </Box>
            }

        </Container>
    );
};

export default WishlistsCreateForm;