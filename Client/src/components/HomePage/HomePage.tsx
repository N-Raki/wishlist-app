import {FC} from 'react';
import './HomePage.css';
import {useQuery} from "@tanstack/react-query";
import {User} from "../../models/user.model.ts";
import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import {Wishlist} from "../../models/wishlist.model.ts";
import {getRecentWishlists} from "../../services/wishlists.service.ts";
import {getCurrentUser} from "../../services/user.service.ts";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Copyright from "../Copyright/Copyright.tsx";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => {
    const {
        data: user,
        isSuccess,
        isError
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const {
        data: recentWishlists
    } = useQuery<Wishlist[]>({
        queryKey: ['recentWishlists'],
        queryFn: getRecentWishlists,
        retry: false,
        enabled: isSuccess
    });

    const navigate = useNavigate();

    if (isError) {
        return (
            <div className="h-screen bg-gifts bg-cover bg-right lg:bg-top">
                <NavigationBar/>
                <div className="flex flex-col items-center pt-20">
                    <h1 className="text-3xl lg:text-6xl lg:max-w-xl text-center font-bold mx-5 mb-4">Share your wishlist
                        with your friends</h1>
                    <h2 className="lg:text-xl">Create. Share. Receive.</h2>

                    <ButtonCallToAction className="my-20" onClick={() => navigate('/register')}>
                        Create your wishlist
                    </ButtonCallToAction>

                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className=" flex flex-col h-screen bg-gifts bg-cover bg-right lg:bg-top items-center">
                <NavigationBar/>
                {
                    user && user.wishlists.length > 0
                        ? (
                            <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {
                                    user.wishlists.map(wishlist => (
                                        <div className="rounded bg-surfaceDark">{wishlist.name}</div>
                                    ))
                                }
                            </div>
                        )
                        : (
                        <div className="flex flex-col flex-1 w-full justify-center items-center space-y-3 pb-32">
                            <h3>You don't have any wishlist yet.</h3>
                            <ButtonCallToAction onClick={() => navigate("/wishlists/new")}>Create a wishlist</ButtonCallToAction>
                        </div>
                        )
                }
                <Copyright className="py-2"/>
            </div>
        );
    }

    return (
        <div>
            <NavigationBar/>
        </div>
    )
};

export default HomePage;
