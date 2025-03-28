import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Link, MenuItem, MenuList } from '@mui/material';
import { Link as LinkRouter } from 'react-router-dom';
import Logo from '../icons/logoWisnam.svg'

const DrawerHeader = styled('div')(({ theme }) => ({

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),


    ...theme.mixins.toolbar,


}));



export default function MenuTablet(props) {

    const { stateNavigation , menuTablet , isLargeScreen , leftMenu } = props;



    return (
        (menuTablet && !isLargeScreen) && (
            <Box sx={{ width: '270px', height: "100vh", position: { sm: "absolute", lg: "relative" }, display: { sm: "block", lg: "none" }, flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #DBDBDB", backgroundColor: "white", zIndex: 4, boxShadow: 2 }}>



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
                                            <MenuItem
                                                sx={{ borderRadius: '8px', backgroundColor: stateNavigation[subItem.url] === 1 ? 'primary.menuBackground' : 'inherit', mx: 1, my: 1, py: 0, '&:hover': { backgroundColor: "primary.menuBackground" }, '&:active': { backgroundColor: "primary.menuBackground" } }}
                                            >
                                                <ListItemIcon sx={{ color: stateNavigation[subItem.url] === 1 ? 'primary.main' : '' }}>
                                                    {subItem.icon}
                                                </ListItemIcon>

                                                <ListItemText sx={{ fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: stateNavigation[subItem.url] === 1 ? 'primary.main' : '#0000008F', py: 1 }} primary={subItem.name} />
                                            </MenuItem>
                                        </LinkRouter>

                                    ))}
                                </div>
                            ))}

                        </MenuList>


                    </Box>
                </Box>



            </Box>
        )
    );
}