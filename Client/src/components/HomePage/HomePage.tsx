import {FC} from 'react';
import './HomePage.css';
import {Button} from "@mui/material";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => (
    <div className="HomePage">
        <h1>Wishlists</h1>
        <p>Create. Share. Give.</p>
        <Button variant="contained" href="/register">
            Create your wishlist
        </Button>
        <p>You already have a wishlist? <a href="/login">Sign in</a></p>
    </div>
);

export default HomePage;
