import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import React, {FC} from "react";

interface ContainerProps {
    children: React.ReactNode;
}

const Container: FC<ContainerProps> = (props: ContainerProps) => {
    return (
        <div className="flex flex-col h-screen bg-gifts bg-cover bg-right lg:bg-top items-center">
            <NavigationBar/>
            <div className="flex flex-col flex-1 items-center w-full">
                {props.children}
            </div>
            <Copyright className="py-4"/>
        </div>
    );
}

export default Container;