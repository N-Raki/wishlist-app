import {FC} from 'react';
import './UserProfile.css';
import {User} from "../../user.model.ts";
import {useGet} from "../../hooks/useGet.ts";


interface UserProfileProps {}

// const logout = () => {
//     fetch(apiUrl + '/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//     })
//         .then(response => {
//             if (response.ok) {
//                 window.location.href = '/login';
//             }
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });
// }

const UserProfile: FC<UserProfileProps> = () => {
    const { data: userData } = useGet<User>('/api/users/me');
    
    return (
        <div className="UserProfile">
            <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
    );
};

export default UserProfile;
