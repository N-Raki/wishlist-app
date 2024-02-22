import {FC} from 'react';
import './UserProfile.css';
import {useMutation, useQuery, useQueryClient} from "react-query";
import getUser from "../../api/getUser.request.ts";
import logout from "../../api/logout.request.ts";


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
                <button onClick={() => mutation.mutate()}>Log Out</button>
            </div>
        );
    }
};

export default UserProfile;
