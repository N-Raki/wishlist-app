import {FC} from 'react';
import './UserProfile.css';
import getUser from "../../api/getUser.request.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import AuthService from "../../services/auth.service.ts";


interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
    const queryClient = useQueryClient();
    const query = useQuery({queryKey: ['user'], queryFn: getUser});
    
    const mutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
    
    if (query.isLoading) {
        return <div>Loading...</div>;
    }
    
    if (query.error) {
        return <div>Error: {query.error.message}</div>;
    }
    
    if (query.isSuccess)
    {
        const user = query.data;
        return (
            <div className="UserProfile">
                <pre>Id: {user?.id}</pre>
                <pre>Display Name: {user?.displayName}</pre>
                <pre>Email: {user?.email}</pre>
                <ul>
                    {user?.wishlists.map((wishlist) => 
                        <li key={wishlist.id}>{wishlist.id} - {wishlist.name}
                            <ul>
                                {wishlist.items.map((item) => 
                                    <li key={item.id}>{item.name}</li>
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
