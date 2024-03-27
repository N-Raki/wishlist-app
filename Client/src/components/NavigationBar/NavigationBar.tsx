import {User} from "../../models/user.model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {getCurrentUser} from "../../services/user.service.ts";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {logout} from "../../services/auth.service.ts";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {NavigationButton} from "../NavigationButton/NavigationButton.tsx";
import {useState} from "react";
import {Dialog} from '@headlessui/react'

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
            setMobileMenuOpen(false);
        }
    });

    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
    }

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header>
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <button
                        type="button"
                        className="-m-1.5 p-1.5 text-3xl"
                        onClick={() => navigate("/")}>
                        ✨ Wishes
                        <span className="sr-only">Wishlists</span>
                    </button>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                        onClick={() => setMobileMenuOpen(true)}
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
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10 bg-background/50 dark:bg-backgroundDark/50 transition-colors" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-surface dark:bg-surfaceDark text-onSurface dark:text-onSurfaceDark px-6 py-6 sm:max-w-sm transition-colors">
                    <div className="flex items-center gap-x-6 justify-end">
                        <DarkModeSwitch/>
                        <button type="button" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-onSurface/10 dark:divide-onSurfaceDark/10">
                            {
                                isUserLoggedIn
                                    ? <div className="space-y-2 py-6">
                                        <button type="button"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-background"
                                                onClick={() => {
                                                    navigate("/");
                                                    setMobileMenuOpen(false);
                                                }}
                                        >
                                            Wishlists
                                        </button>
                                        <button type="button"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7"
                                                onClick={() => {
                                                    navigate("/profile");
                                                    setMobileMenuOpen(false);
                                                }}
                                        >
                                            Profile
                                        </button>
                                    </div>
                                    : null
                            }
                            <div className="py-6">
                                {
                                    isUserLoggedIn
                                        ? <button
                                            type="button"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7"
                                            onClick={() => logoutMutation.mutate()}>
                                            Log out
                                        </button>
                                        : <button
                                            type="button"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7"
                                            onClick={handleLoginRedirect}>
                                            Log In
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
};

export default NavigationBar;
