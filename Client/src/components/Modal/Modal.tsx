import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

interface ModalProps {
    children: React.ReactNode;
    openModal: boolean;
    onClose: (value: boolean) => void;
    title?: string | undefined;
}

const Modal: React.FC<ModalProps> = ({children, openModal, onClose, title}) => {
    return (
        <Transition.Root show={openModal} as={Fragment}>
            <Dialog className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-backgroundDark/25 dark:bg-background/25 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto my-12">
                    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-onSurface dark:text-onSurfaceDark bg-surface dark:bg-surfaceDark text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                                {title && (<h2 className="font-bold text-xl text-center pt-5">{title}</h2>)}
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Modal;