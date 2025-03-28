import React, { useState, useRef, useEffect } from 'react';
import {
    FormControl,
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    ListItemText,
    Switch,
} from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ServerProxy from "../tools/serverProxy";
import { PhoneIphone } from '@mui/icons-material';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

export default function MyComponent(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSelectVisibleForStatusMultiple, setIsSelectVisibleForStatusMultiple] = useState(false);
    const selectRef = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsSelectVisibleForStatusMultiple(true);
    };

    const handleClose = () => {
        setIsSelectVisibleForStatusMultiple(false);
        setAnchorEl(null);
    };

    const changeOperationDisabledAll = () => {
        props.setChangeAllIds((prevState) => ({
            ...prevState,
            operation: 0,
        }));

        handleClose();
    };

    const changeOperationEnabledAll = () => {
        console.log("changeOperationEnabledAll")
        props.setChangeAllIds((prevState) => ({
            ...prevState,
            operation: 1,
        }));
        handleClose();
    };




    return (
        <FormControl variant="standard" ref={selectRef}>
            <IconButton
                title="Change All"
                color="primary"
                onClick={handleClick}
            >
                <PublishedWithChangesIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={isSelectVisibleForStatusMultiple}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={changeOperationDisabledAll}>
                    <ListItemIcon>
                        <Switch  fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Disable" />
                </MenuItem>

                <MenuItem onClick={changeOperationEnabledAll}>
                    <ListItemIcon>
                        <Switch checked fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Enable" />
                </MenuItem>
            </Menu>
        </FormControl>
    );
}
