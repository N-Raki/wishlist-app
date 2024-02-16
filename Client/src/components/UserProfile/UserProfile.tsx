import {FC, useEffect, useState} from 'react';
import './UserProfile.css';

const apiUrl: string = import.meta.env.VITE_API_URL;

interface UserProfileProps {}

const logout = () => {
    fetch(apiUrl + '/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const UserProfile: FC<UserProfileProps> = () => {
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        fetch(apiUrl + '/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                // if unauthorized, redirect to login
                if (response.status === 401) {
                    window.location.href = '/login';
                } else if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    
    return (
        <div className="UserProfile">
            <pre>{JSON.stringify(userData, null, 2)}</pre>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default UserProfile;
