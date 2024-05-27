import './RecentPage.css';
import {User} from "../../models/user.model.ts";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../services/user.service.ts";
import {Wishlist} from "../../models/wishlist.model.ts";
import {getRecentWishlists} from "../../services/wishlists.service.ts";

function RecentPage() {
    const {
        data: user,
        isSuccess: isConnected,
        isLoading
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const {
        data: recentWishlists,
        isLoading: isLoadingRecentWishlists
    } = useQuery<Wishlist[]>({
        queryKey: ['recentWishlists'],
        queryFn: getRecentWishlists,
        retry: false,
        enabled: isConnected
    });

    // const ownerQueries = useQueries({
    //     queries: recentWishlists!.map((wishlist) => {
    //         return {
    //             queryKey: ['buyer', wishlist.userId],
    //             queryFn: () => getUserDisplayName(wishlist.userId),
    //             enabled: !!recentWishlists
    //         };
    //     })
    // });
    
    const navigate = useNavigate();
    
    if (isLoading || isLoadingRecentWishlists) {
        return (
            <Container>{null}</Container>
        );
    }
    
    if (isConnected) {
        return (
            user && recentWishlists && recentWishlists.length > 0
                ? (
                    <Container>
                        <h2 className="my-10 font-bold text-xl">Hello {user.displayName} !</h2>
                        <div className={`px-6 w-full max-w-xl grid grid-cols-1 ${user.wishlists.length > 1 ? "lg:grid-cols-2" : ""} gap-4`}>
                            {
                                recentWishlists.map(wishlist => (
                                    <button key={wishlist.id} className="flex text-left rounded-xl bg-surface dark:bg-surfaceDark shadow-elevation p-4" onClick={() => navigate(`/wishlists/${wishlist.id}`)}>
                                        <div className="flex-1">
                                            <div className="flex space-x-2 items-center">
                                                <h2 className="text-xl font-bold">{wishlist.name}</h2>
                                                <p className="text-sm">by {wishlist.ownerName}</p>
                                            </div>
                                            <h5>{wishlist.items.length} item{wishlist.items.length > 1 ? 's' : null}</h5>
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </Container>
                )
                : (
                    <Container>
                        <h2 className="my-10 font-bold text-xl">Hello {user.displayName} !</h2>
                        <div className="px-6 text-center">
                            <h2 className="py-4 text-lg">No recent wishlist.</h2>
                            <h3 className="">Visit someone's wishlist and find it here later.</h3>
                        </div>
                        <ButtonCallToAction size="sm" onClick={() => navigate("/")} className="mt-10">Go to your wishlists</ButtonCallToAction>
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

export default RecentPage;
