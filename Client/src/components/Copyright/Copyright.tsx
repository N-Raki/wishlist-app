import './Copyright.css';
import {FC} from "react";

interface CopyrightProps {
    className?: string;
}

const Copyright: FC<CopyrightProps> = ({className}) => (
    <div className={className}>
        Copyright © 
        <button onClick={() => window.location.href = 'https://raki.app/'}>
            Raki
        </button>{' '}
        {new Date().getFullYear()}
        .
    </div>
);

export default Copyright;
