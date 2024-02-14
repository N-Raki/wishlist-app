import {FC} from 'react';
import './Copyright.css';
import {Link, SxProps, Theme, Typography} from "@mui/material";

interface CopyrightProps {
    sx?: SxProps<Theme>;
}

const Copyright: FC<CopyrightProps> = (props) => (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://raki.app/">
            Raki
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
);

export default Copyright;
