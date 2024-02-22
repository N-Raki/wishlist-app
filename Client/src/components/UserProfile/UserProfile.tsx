import {FC} from 'react';
import './UserProfile.css';
import getUser from "../../api/getUser.request.ts";
import logout from "../../api/logout.request.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";


interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
    const queryClient = useQueryClient();
    const query = useQuery('user', getUser);
    
    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: 'user'});
        }
    });
    
    if (query.isLoading) {
        return <div>Loading...</div>;
    }
    
    if (query.error) {
        return <div>Error: {(query.error as Error).message}</div>;
    }
    
    if (query.isSuccess)
    {
        const user = query.data;
        console.log(user);
        return (
            <div className="UserProfile">
                <pre>Id: {user?.id}</pre>
                <pre>Username: {user?.username}</pre>
                <pre>Email: {user?.email}</pre>
                <ul>
                    {user?.wishlists.map((wishlist) => 
                        <li key={wishlist.id}>{wishlist.id}
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
