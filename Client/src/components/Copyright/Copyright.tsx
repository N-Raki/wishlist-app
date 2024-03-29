import './Copyright.css';
import {FC} from "react";

interface CopyrightProps {
    className?: string;
}

const Copyright: FC<CopyrightProps> = ({className}) => (
    <div className={className}>
        Copyright © 
        <button onClick={() => window.open("https://raki.app", "_blank")}>
            Raki
        </button>{' '}
        {new Date().getFullYear()}
        .
    </div>
);

export default Copyright;
