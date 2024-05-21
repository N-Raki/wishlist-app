import {User} from "../../models/user.model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {getCurrentUser} from "../../services/user.service.ts";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {logout} from "../../services/auth.service.ts";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {NavigationButton} from "../NavigationButton/NavigationButton.tsx";
import {Fragment, useState} from "react";
import {Dialog, Transition} from '@headlessui/react'

const NavigationBar = () => {
    const queryClient = useQueryClient();
    const {isSuccess: isUserLoggedIn} = useQuery<User>({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        retry: false
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
        <header className="w-full">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <button
                        type="button"
                        className={"-m-1.5 p-1.5 text-3xl"}
                        onClick={() => navigate("/")}>
                        ✨ <span className="hidden md:inline">Wishes</span>
                        <span className="sr-only">Wishes</span>
                    </button>
                </div>
                <button className="flex-1 md:hidden text-center text-3xl" onClick={() => navigate("/")}>
                    Wishes
                </button>
                <div className="flex mx-2 lg:hidden">
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
                            <NavigationButton label="My Wishlists" route="/"/>
                            <NavigationButton label="Recents" route="/recents" />
                            <NavigationButton label="Profile" route="/profile"/>
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
            <Transition.Root show={mobileMenuOpen}>
                <Dialog as="div" className="lg:hidden" onClose={setMobileMenuOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-100"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80 dark:bg-backgroundDark/70"/>
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel
                            className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-surface dark:bg-surfaceDark text-onSurface dark:text-onSurfaceDark px-6 py-6 sm:max-w-sm transition-colors">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="flex items-center gap-x-6 justify-end">
                                    <DarkModeSwitch/>
                                    <button type="button" className="-m-2.5 rounded-md p-2.5"
                                            onClick={() => setMobileMenuOpen(false)}>
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-onSurface/10 dark:divide-onSurfaceDark/10">
                                    {
                                        isUserLoggedIn
                                            ? <div className="space-y-2 py-6">
                                                <button type="button"
                                                        className={"-mx-3 block rounded-lg px-3 py-2 leading-7 hover:bg-background" + (location.pathname === '/' ? ' font-bold text-lg' : '')}
                                                        onClick={() => navigate("/")}
                                                >
                                                    My Wishlists
                                                </button>
                                                <button type="button"
                                                        className={"-mx-3 block rounded-lg px-3 py-2 leading-7 hover:bg-background" + (location.pathname === '/recents' ? ' font-bold text-lg' : '')}
                                                        onClick={() => navigate("/recents")}
                                                >
                                                    Recents
                                                </button>
                                                <button type="button"
                                                        className={"-mx-3 block rounded-lg px-3 py-2 leading-7" + (location.pathname === '/profile' ? ' font-bold text-lg' : '')}
                                                        onClick={() => navigate("/profile")}
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
                                                    className="-mx-3 block rounded-lg px-3 py-2.5 leading-7"
                                                    onClick={() => logoutMutation.mutate()}>
                                                    Log out
                                                </button>
                                                : <button
                                                    type="button"
                                                    className="-mx-3 block rounded-lg px-3 py-2.5 leading-7"
                                                    onClick={handleLoginRedirect}>
                                                    Log In
                                                </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>
        </header>
    );
};

export default NavigationBar;
