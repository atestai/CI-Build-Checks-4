import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import { Alert, ListItem, ListItemText } from '@mui/material';
import { AccountCircle, Lock, Logout, Person } from '@mui/icons-material';
import ServerProxy from '../tools/serverProxy';
import { strings } from '../strings';
import PasswordChangeDialog from './passwordChangeDialog';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';



export default function AccountMenu(props) {

    const { user } = props;



    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const [openDialogPassword, setOpenDialogPassword] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onChangePassword = () => {
        setOpenDialogPassword(true);
        setAnchorEl(null);
    }



    const onSignOut = () => {
        sessionStorage.clear();
        window.location.assign('/');
    }


 
    



    return (
        <>

          
            <PasswordChangeDialog alert={props.alert} setAlert={props.setAlert} user={user} open={openDialogPassword} onClose={() => setOpenDialogPassword(false)} />

            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        aria-haspopup="true"
                        sx={{color:props.colorIcon}}
                    >
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ListItem>
                    <ListItemText primary={user?.name} secondary={user?.email} />
                </ListItem>

                <Divider />

                <MenuItem onClick={onChangePassword}>
                    <ListItemIcon>
                        <Lock fontSize="small" />
                    </ListItemIcon>
                    {strings.changePassword}
                </MenuItem>

                <MenuItem component={Link} to={`/user/${user?.id}`}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    {strings.editProfile}
                </MenuItem>

                <Divider />

                <MenuItem onClick={onSignOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    {strings.logout}
                </MenuItem>
            </Menu>
        </>
    );
}
