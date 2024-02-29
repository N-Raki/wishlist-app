import {FC} from 'react';
import './UserProfile.css';
import {useMutation, useQuery} from "@tanstack/react-query";
import AuthService from "../../services/auth.service.ts";
import UserService from "../../services/user.service.ts";
import {Navigate, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {User} from "../../models/user.model.ts";

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
    const navigate = useNavigate();
    const query = useQuery<User>({queryKey: ['user'], queryFn: UserService.getCurrentUser, retry: false});
    
    const mutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: async () => {
            toast.success('Logged out successfully');
            navigate('/login');
        }
    });
    
    if (query.isLoading) {
        return <div>Loading...</div>;
    }
    
    if (query.isError) {
        return <Navigate to="/login" />
    }
    
    if (query.isSuccess)
    {
        const user = query.data;
        return (
            <div className="UserProfile">
                <pre>Id: {user?.id}</pre>
                <pre>Email: {user?.email}</pre>
                {user?.displayName ? <pre>Display Name: {user?.displayName}</pre> : <pre>No display name yet !</pre>}
                <ul>
                    {user?.wishlists?.map((wishlist) => 
                        <li key={wishlist.id}>{wishlist.id} - {wishlist.name}
                            <ul>
                                {wishlist.items.map((item) => 
                                    <li key={item.id}>
                                        <span>{item.name}</span>
                                        {item.url ? ( - <a href={item.url} target="_blank">Link</a>) : null}
                                        {item.price ? ( - <span>{item.price}</span>) : null}
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
                <button onClick={() => mutation.mutate()}>Log Out</button>
            </div>
        );
    }
};

export default UserProfile;
