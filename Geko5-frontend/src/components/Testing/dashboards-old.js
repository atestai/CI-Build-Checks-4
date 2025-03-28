import config from '../../config.js';
import * as React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { Link as LinkRouter, Route, Routes } from 'react-router-dom';


import { Collapse, Link, Stack } from '@mui/material';
import {strings} from '../../strings.js'


import {Category, CellTower, Dashboard as DashboardIcon, DeveloperBoard, Devices, ExitToApp, ExpandLess, ExpandMore, Home as HomeIcon, ImportantDevices, OutputOutlined, Person, PowerInput, QueryBuilder, Settings as SettingsIcon, Storage } from '@mui/icons-material';
import BodyContent from '../bodyContent.js';
import { useMemo, useState } from 'react';


const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' }) (
	({ theme, open }) => ({
		flexGrow: 1,
		alignContent: 'stretch',
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: `-${drawerWidth}px`,
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 0,
		}),
	}),
);

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}));


function Dashboard() {

	const theme = useTheme();
	const [open, setOpen] = useState(true);
	
	const [subMenu, setSubMenu] = React.useState({});

	const [filter, setFilter] = React.useState('');

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);

		setLeftMenuOpen({
            "Dashboard" : false,
            "Device" : false,
            "Settoing" : false
        });
	};


	const onExit = () => {
		sessionStorage.clear();
		window.location.assign('/');
	}

	const leftMenu = useMemo(() => [ 
        {
            name : 'Dashboard',
            icon : <DashboardIcon />,
            list : [
                {
                    name : 'Home page',
                    icon : <HomeIcon />,
                    url : 'home'
                },{
                    name : 'Real-Time data',
                    icon : <QueryBuilder />,
                    url : 'realtimeValue'
                },{
                    name : 'Storical data',
                    icon : <Storage />,
                    url : 'storicalValue'
                }
            ]
        }, {
            name : 'Device',
            icon : <Category />,
            list : [
                {
                    name : 'Cpus',
                    icon : <DeveloperBoard />,
                    url : 'cpus'
                },
                {
                    name : 'Devices Type',
                    icon : <ImportantDevices />,
                    url : 'devicesType'
                },
                {
                    name : 'Devices',
                    icon : <Devices />,
                    url : 'devices'
                },

                {
                    name : 'Devices Modbus',
                    icon : <CellTower />,
                    url : 'devicesModbus'
                }
            ]
        },
        {
            name : 'Settings',
            icon : <SettingsIcon />,
            list: [
                {
                    name: 'Users',
                    icon: <Person />,
                    url: 'users'
                },{
                    name: 'Ads',
                    icon: <PowerInput />,
                    url: 'ads'
                }, {
                    name: 'Mqtt',
                    icon: <OutputOutlined />,
                    url: 'mqtt'
                }, {
                    name: 'Store & forward',
                    icon: <Storage />,
                    url: 'saf'
                }, {
                    name: 'System',
                    icon: <SettingsIcon />,
                    url: 'system'
                }
            ]
        }
    ], []);


	const [leftMenuOpen, setLeftMenuOpen] = useState({
        "Dashboard" : true,
        "Device" : false,
        "Settoing" : false
    });


   

	
	let lastDivider = false;

    return (
		<Box sx={{ display: 'flex', justifyContent: 'stretch', height: '100%' }}>
            <CssBaseline/>

            <AppBar position="fixed" open={open}>
				<Toolbar>

					<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} >
                    	<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center',  width: '100%' }} >
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								sx={{ mr: 2, ...(open && { display: 'none' }) }}
							>
								<MenuIcon />
							</IconButton>

							<SettingsBackupRestoreIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

							<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
								Game badges
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} >
							<Search>
								<SearchIconWrapper>
									<SearchIcon />
								</SearchIconWrapper>
								<StyledInputBase
									placeholder={strings.search}
									inputProps={{ 'aria-label': 'search' }}
									value={filter}
									onChange={(event) => {
										setFilter(event.target.value)
									}}
								/>
							</Search>
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }} >
							<Stack direction="row" spacing={1}>
								<IconButton title={strings.settings} color="inherit" aria-label="Settings"  component={LinkRouter} to={`/settings`} >
									<SettingsIcon />
								</IconButton>
								<IconButton color="inherit" aria-label="ExitToApp" onClick={onExit} >
									<ExitToApp title={strings.logout} />
								</IconButton>
							</Stack>
						</Box>
					</Box>

				</Toolbar>
			</AppBar>

			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</DrawerHeader>
				<Divider />

				<Box >
                    <List>
                        {leftMenu.map((item, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton onClick={ () => {

                                    //alert( item.name );
                                    setOpen(true);
                                    setLeftMenuOpen( state => {

                                        state[item.name] = !state[item.name];
                                        return {...state} 
                                    })
                                    
                                }}>
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}

                                    </ListItemIcon>
                                    <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />

                                    {  open && (leftMenuOpen[item.name] ? <ExpandLess /> : <ExpandMore />)} 

                                </ListItemButton>
                                
                                { item.list && 

                                    <Collapse in={leftMenuOpen[item.name]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>

                                            {item.list.map( (subItem, subIndex) => (

                                                <ListItemButton key={subIndex} sx={{ pl: 4 }}  
                                                    component={Link}
                                                    to={subItem.url} >
                                                    <ListItemIcon>
                                                        {subItem .icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={subItem.name} />
                                                </ListItemButton>

                                            ))}

                                        </List>
                                    </Collapse>
                                }
                                

                            </ListItem>
                        ))}
                    </List>
                </Box>

			</Drawer>

			<Main sx={{ height: '94vh', width: '100%' }} open={open}>
				<DrawerHeader />

				<BodyContent open={open} />

				{/* <Routes>
					<Route path="/platforms" element={<Platforms setSubMenu={setSubMenu} filter={filter}/>} />
					<Route path="/platforms/:id" element={<Platform setSubMenu={setSubMenu} />} />	
					<Route path="/platforms/:id/users" element={<DataGridPlatformUsers filter={filter} setSubMenu={setSubMenu} />} />	
					<Route path="/platforms/:id/rewards" element={<DataGridPlatformRewards filter={filter} setSubMenu={setSubMenu} />} />	
					<Route path="/platforms/:id/ranks" element={<DataGridPlatformRanks filter={filter} setSubMenu={setSubMenu} />} />	
					<Route path="/platforms/:id/logs" element={<DataGridPlatformLogs filter={filter} setSubMenu={setSubMenu} />} />	
					
					<Route path="/clients" element={<Clients setSubMenu={setSubMenu} /> } />
					<Route path="/clients/:id" element={<Client setSubMenu={setSubMenu} /> } />				

					<Route path="/users" element={<Users setSubMenu={setSubMenu} /> } />
					<Route path="/users/:id" element={<User setSubMenu={setSubMenu}/> } />				
					<Route path="/users/:id/rewards" element={<DataGridUserRewards setSubMenu={setSubMenu} />} />	
					<Route path="/users/:id/logs" element={<DataGridUserLogs setSubMenu={setSubMenu} />} />							

					<Route path="/settings" element={<Settings/>} />
					<Route path="/*" element={<Typography paragraph>{strings.pageNotFound}</Typography>} />
				</Routes> */}
			</Main>
        </Box>       

    );
}

export default Dashboard;
