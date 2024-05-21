import './HomePage.css';
import {User} from "../../models/user.model.ts";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../services/user.service.ts";

function HomePage() {
    const {
        data: user,
        isSuccess: isConnected,
        isLoading
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    // const {
    //     data: recentWishlists
    // } = useQuery<Wishlist[]>({
    //     queryKey: ['recentWishlists'],
    //     queryFn: getRecentWishlists,
    //     retry: false,
    //     enabled: isSuccess
    // });
    
    const navigate = useNavigate();
    
    if (isLoading) {
        return (
            <Container>{null}</Container>
        );
    }
    
    if (isConnected) {
        return (
            user && user.wishlists.length > 0
                ? (
                    <Container>
                        <div className={`mt-20 md:mt-36 px-6 w-full max-w-xl grid grid-cols-1 ${user.wishlists.length > 1 ? "lg:grid-cols-2" : ""} gap-4`}>
                            {
                                user.wishlists.map(wishlist => (
                                    <button className="flex text-left rounded-xl bg-surface dark:bg-surfaceDark shadow-elevation p-4" onClick={() => navigate(`/wishlists/${wishlist.id}`)}>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold">{wishlist.name}</h2>
                                            <h5>{wishlist.items.length} items</h5>
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </Container>
                )
                : (
                    <Container>
                        <div className="mt-20 md:mt-36">
                            <h3 className="py-4">You don't have any wishlist yet.</h3>
                            <ButtonCallToAction size="lg" onClick={() => navigate("/wishlists/new")}>Create a wishlist</ButtonCallToAction>
                        </div>
                    </Container>
                )
        );
    }
    else {
        return (
            <Container>
                <h1 className="text-3xl lg:text-6xl lg:max-w-xl text-center font-bold mx-5 mb-4 mt-20">
                    Share your wishlist with your friends
                </h1>
                <h2 className="lg:text-xl">Create. Share. Receive.</h2>

                <ButtonCallToAction className="my-20" size="lg" onClick={() => navigate('/register')}>
                    Create your wishlist
                </ButtonCallToAction>
            </Container>
        );
    }
}

export default HomePage;
