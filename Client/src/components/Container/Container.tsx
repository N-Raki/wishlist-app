import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import React, {FC} from "react";

interface ContainerProps {
    children: React.ReactNode;
}

const Container: FC<ContainerProps> = (props: ContainerProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-gifts bg-cover bg-right lg:bg-top items-center">
            <NavigationBar/>
            <div className="flex flex-col flex-1 items-center w-full">
                {props.children}
            </div>
            <Copyright className="pt-6 pb-4"/>
        </div>
    );
}

export default Container;