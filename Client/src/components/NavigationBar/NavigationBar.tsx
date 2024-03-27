import {User} from "../../models/user.model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {getCurrentUser} from "../../services/user.service.ts";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {logout} from "../../services/auth.service.ts";
import {Bars3Icon} from "@heroicons/react/24/outline";
import {NavigationButton} from "../NavigationButton/NavigationButton.tsx";

const NavigationBar = () => {
    const queryClient = useQueryClient();
    const {isSuccess: isUserLoggedIn} = useQuery<User>({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user']});
            toast.success('Logged out successfully');
        }
    });

    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
    }

    return (
        <header className="bg-white dark:bg-black">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <button
                        type="button"
                        className="-m-1.5 p-1.5 text-3xl"
                        onClick={() => navigate("/")}>
                        🎁
                    </button>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                        onClick={() => {
                        }}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                    </button>
                </div>
                {
                    isUserLoggedIn
                        ? <div className="hidden lg:flex lg:gap-x-12">
                            <NavigationButton label={'Wishlists'} route={'/'}/>
                            <NavigationButton label={'Profile'} route={'/profile'}/>
                        </div>
                        : null
                }
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
                    {
                        isUserLoggedIn
                            ? <button
                                type="button"
                                className="text-sm font-semibold leading-6"
                                onClick={() => logoutMutation.mutate()}>
                                Log out
                            </button>
                            : <button
                                type="button"
                                className="text-sm font-semibold leading-6"
                                onClick={handleLoginRedirect}>
                                Log In
                            </button>
                    }
                    <DarkModeSwitch/>
                </div>
            </nav>
        </header>
    );
};

export default NavigationBar;
