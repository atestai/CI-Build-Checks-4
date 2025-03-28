import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Link, MenuItem, MenuList } from '@mui/material';
import { Link as LinkRouter } from 'react-router-dom';
import Logo from '../icons/logoWisnam.svg'
import LogoSmallWisnam from '../icons/logoSmallWisnam.svg'

const DrawerHeader = styled('div')(({ theme }) => ({

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),


    ...theme.mixins.toolbar,


}));



export default function Menu(props) {

    const { stateNavigation, open, setOpen , isLGcreen , leftMenu } = props;





    return (
       






            (open && isLGcreen) ? (

                <Box sx={{ width: '270px', height: "100vh", position: { sm: "absolute", lg: "relative" }, display: { sm: "none", lg: "block" }, flexDirection: "column", justifyContent: "space-between", zIndex: 4, borderRight: "1px solid #DBDBDB", backgroundColor: "white", boxShadow: 2 }}>

                    <IconButton sx={{ width: "19px", height: "19px", position: "absolute", right: '-10px', top: "22px", backgroundColor: "white", border: "1px solid #DBDBDB", '&:hover': { backgroundColor: "white", border: "1px solid #DBDBDB" } }} onClick={() => setOpen(prevState => !prevState)}>
                        {open ? <ChevronLeftIcon sx={{ fontSize: "13px" }} /> : <ChevronRightIcon sx={{ fontSize: "13px" }} />}
                    </IconButton>



                    <Box sx={{ display: "flex", flexDirection: "column" }}>

                        <DrawerHeader sx={{ display: "flex", justifyContent: "center" }}>
                            <Link component={LinkRouter} to="/" sx={{ textDecoration: 'none' }}>
                                <img src={Logo} alt="logo" />
                            </Link>
                        </DrawerHeader>

                        <Box>
                            <MenuList sx={{ overflowY: "auto", maxHeight: 'calc(100vh - 140px)', paddingTop: 0 }}>
                                {leftMenu.map((item, index) => (
                                    <div key={index}>

                                        {item.divider === 1 && (
                                            <Divider />
                                        )}

                                        <MenuItem sx={{ my: 1, mx: 1, '&:hover': { backgroundColor: "white" } }}>

                                            <ListItemText primary={item.name} sx={{ textTransform: 'uppercase', color: "#607D8B", fontWeight: 500, fontSize: "14px", lineHeight: "20px", borderRadius: '16px', backgroundColor: "transparent", '&:hover': { backgroundColor: "transparent" } }} />

                                        </MenuItem>

                                        <Divider sx={{ margin: 0 }} />

                                        {item.list && item.list.map((subItem, subIndex) => (
                                            <LinkRouter to={subItem.url} key={subIndex} style={{ textDecoration: 'none' }}>
                                                <MenuItem sx={{ backgroundColor: stateNavigation[subItem.url] === 1 ? 'primary.menuBackground' : 'inherit', borderRadius: '8px', mx: 1, my: 1, py: 0, '&:hover': { backgroundColor: "primary.menuBackground" }, '&:active': { backgroundColor: "primary.menuBackground" }, '&:focus': { backgroundColor: "primary.menuBackground" } }}>

                                                    <ListItemIcon sx={{ color: stateNavigation[subItem.url] === 1 ? 'primary.main' : '' }}>
                                                        {subItem.icon}
                                                    </ListItemIcon>

                                                    <ListItemText primary={subItem.name} sx={{ color: stateNavigation[subItem.url] === 1 ? 'primary.main' : '#0000008F', fontWeight: 400, fontSize: "16px", lineHeight: "24px", py: 1 }} />
                                                </MenuItem>
                                            </LinkRouter>

                                        ))}
                                    </div>
                                ))}

                            </MenuList>


                        </Box>
                    </Box>

                </Box>

            ) : (

                <Box sx={{ width: '90px', height: "100vh", display: { sm: "none", lg: "block" }, position: "relative", borderRight: "2px solid #DBDBDB", backgroundColor: "white", zIndex: 3, boxShadow: 2 }}>


                    <IconButton sx={{ width: "19px", height: "19px", position: "absolute", right: '-10px', top: "22px", backgroundColor: "white", border: "1px solid #DBDBDB", '&:hover': { backgroundColor: "white", border: "1px solid #DBDBDB" } }} onClick={() => setOpen(prevState => !prevState)}>
                        {open ? <ChevronLeftIcon sx={{ fontSize: "13px" }} /> : <ChevronRightIcon sx={{ fontSize: "13px" }} />}
                    </IconButton>



                    <DrawerHeader sx={{ display: "flex", justifyContent: "center" }}>

                        <Link component={LinkRouter} to="/" sx={{ textDecoration: 'none' }}>
                            <img sx={{ width: "100%" }} src={LogoSmallWisnam} alt="logo" />
                        </Link>

                    </DrawerHeader>

                    <Box >
                        <Divider sx={{ mx: 1 }} />

                        <MenuList sx={{ overflowY: "auto", maxHeight: 'calc(100vh - 140px)' }}>
                            {leftMenu.map((item, index) => (
                                <div key={index}> 

                                    {item.list && item.list.map((subItem, subIndex) => ( 
                                        <MenuItem key={subIndex} sx={{ display: "flex", flexDirection: "column",  justifyContent: "center", borderRadius: '8px', mx: 1, my: 1, backgroundColor: stateNavigation[subItem.url] === 1 ? 'primary.menuBackground' : 'inherit', '&:hover': { backgroundColor: "primary.menuBackground"},'&:active': { backgroundColor: "primary.menuBackground"}, '&:focus': { backgroundColor: "primary.menuBackground"}}}   component={LinkRouter} to={subItem.url}   >
                                    
                                            <LinkRouter to={subItem.url} style={{ textDecoration: 'none', textAlign: "center", color: stateNavigation[subItem.url] === 1 ? 'primary.main' : '' }}>
                                                <ListItemIcon sx={{ justifyContent: "center", color: stateNavigation[subItem.url] === 1 ? 'primary.main' : '' }}>
                                                    {subItem.icon}
                                                </ListItemIcon>
                                            </LinkRouter>

                                        </MenuItem>
                                    ))}
                                </div>


                            ))}
                            <Divider sx={{ mx: 1 }} />

                        </MenuList>


                    </Box>
                </Box>

            )
      
    );
}