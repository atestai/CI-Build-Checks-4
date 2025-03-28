import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Badge, Typography } from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';
import { useState } from 'react';
import CardAlarms from './homeWidgets/cardAlarms'

export default function AlarmsMenu(props) {
  const { alarmMessage } = props;
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const open = Boolean(anchorElMenu);

  const handleClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Alarms">
          <IconButton
            onClick={handleClick}
            aria-controls={open ? 'menu-alarms' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ color: props.colorIcon }}
          >
            <Badge badgeContent={Object.keys(alarmMessage).length} color="error"  >
              <NotificationsActive  />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorElMenu}
        id="menu-alarms"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ 
          '& .MuiMenu-paper': { 
            transformOrigin: 'right top !important' 
          } 
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 'auto',
            p: 2,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
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
        }}
        disablePortal
        keepMounted
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {Object.keys(alarmMessage).length > 0 ? (
            <CardAlarms data={alarmMessage} code={'alarms'} title={'Alarms'} />
          ) : (
            <Typography>No alarms</Typography>
          )}
        </Box>
      </Menu>
    </>
  );
}