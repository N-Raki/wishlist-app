import './WishlistCreateForm.css'
import {FC} from "react";
import {Box, Button, Container, Stack, styled, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {WishlistCreateRequest} from "../../models/requests/wishlist-create.model.ts";
import {Wishlist} from "../../models/wishlist.model.ts";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";
import {createWishlist} from "../../services/wishlists.service.ts";

const wishlistSchema: ObjectSchema<WishlistCreateRequest> = Yup.object({
    name: Yup.string().required('Name is required')
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
    const {
        register: wishlistRegister,
        handleSubmit: wishlistHandleSubmit,
        getValues: wishlistGetValues,
        formState: {errors: wishlistErrors}
    } = useForm<WishlistCreateRequest>({resolver: yupResolver(wishlistSchema), mode: 'onChange'});
    
    const navigate = useNavigate();
    
    const wishlistMutation = useMutation({
        mutationFn: createWishlist,
        onSuccess: async (wishlist: Wishlist) => {
            toast.success('Wishlist created successfully');
            navigate('/wishlists/' + wishlist.id);
        }
    });
    
    const onCreateWishlist = async () => {
        await wishlistMutation.mutateAsync(wishlistGetValues());
    }

    return (
        <Box>
            <ApplicationBar />
            <Container sx={{
                mt: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h4">Create a new wishlist</Typography>
                <Box component={'form'} noValidate onSubmit={wishlistHandleSubmit(onCreateWishlist)} sx={{mt: '1rem'}}>
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
                </Box>
            </Container>
        </Box>
    );
};

export default WishlistsCreateForm;