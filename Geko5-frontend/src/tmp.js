{open ? (

    <Box
        sx={{
            borderRight: "1px solid #DBDBDB",
            backgroundColor: "white",
            position: "relative",
            width: '270px',
            height: "100vh",

            zIndex: "3",
        }}
    >

        <IconButton
            sx={{
                position: "absolute",
                right: '-16px',
                top: "16px",
                backgroundColor: "white",
                border: "1px solid #DBDBDB",

                '&:hover': { backgroundColor: "white", border: "1px solid #DBDBDB" },
            }}
            onClick={handleDrawerClose}
        >
            {open ? <ChevronLeftIcon sx={{ fontSize: "14px" }} /> : <ChevronRightIcon sx={{ fontSize: "14px" }} />}
        </IconButton>

        <DrawerHeader sx={{ display: "flex", justifyContent: "center" }}>
           <Typography sx={{fontSize : '2.5rem', fontWeight: 'bold'}}  variant='h1' color="primary">Geko5</Typography>
        </DrawerHeader>

        <Box>
            <MenuList sx={{ overflowY: "auto", maxHeight: 'calc(100vh - 140px)' }}>
                {leftMenu.map((item, index) => (

                    <React.Fragment key={index}>
                        {item.divider === 1 && (
                            <Divider />
                        )}

                        <MenuItem sx={{ my: 1, mx: 1, '&:hover': { backgroundColor: "white" } }}>
                            <ListItemText
                                sx={{
                                    textTransform: 'uppercase',
                                    color: "#607D8B",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    borderRadius: '16px',
                                    backgroundColor: "transparent",
                                    '&:hover': { backgroundColor: "transparent" }
                                }}
                                primary={item.name}
                            />
                        </MenuItem>

                        <Divider sx={{ margin: 0 }} />

                        {item.list && item.list.map((subItem, subIndex) => (
                            <Link to={subItem.url} key={subIndex} style={{ textDecoration: 'none' }}>
                                <MenuItem
                                    sx={{
                                        borderRadius: '8px',
                                        mx: 1,
                                        my: 1,
                                        backgroundColor: stateNavigation[subItem.url] === 1 ? '#E0F2F1' : 'inherit'
                                    }}
                                >
                                    <ListItemIcon>
                                        {subItem.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        sx={{
                                            py: 1,
                                            color: "#607D8B",
                                            fontWeight: 400,
                                            fontSize: "16px",
                                            lineHeight: "24px"
                                        }}
                                        primary={subItem.name}
                                    />
                                </MenuItem>
                            </Link>
                        ))}
                    </React.Fragment>
                ))}

            </MenuList>

            {/* <Box sx={{ mt: 4, mb: 4, display: "flex", height:"50px", justifyContent: "center", textAlign: "center", fontSize: "16px", fontWeight: 400, lineHeight: "22px" }}>
                    {getFormattedDateTime()}
                </Box> */}
        </Box>
    </Box>



) : (
    <Box
        sx={{
            borderRight: "2px solid #DBDBDB",
            backgroundColor: "white",
            position: "relative",
            width: '160px',
            height: "100vh",
            zIndex: "3"
        }}
    >

        <IconButton
            sx={{
                position: "absolute",
                right: '-16px',
                top: "16px",
                backgroundColor: "white",
                border: "1px solid #DBDBDB",
                '&:hover': { backgroundColor: "white", border: "1px solid #DBDBDB" },
            }}
            onClick={handleDrawerClose}
        >
            {open ? <ChevronLeftIcon sx={{ fontSize: "13px" }} /> : <ChevronRightIcon sx={{ fontSize: "13px" }} />}
        </IconButton>

        <DrawerHeader sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{fontSize : '1.5rem', fontWeight: 'bold'}}  variant='h1' color="primary">Geko5</Typography>
        </DrawerHeader>

        <Box>
            <MenuList sx={{ overflowY: "auto", maxHeight: 'calc(100vh - 140px)' }}>
                {leftMenu.map((item, index) => (
                    <React.Fragment key={index}> {/* Aggiungi una chiave qui */}
                        <Divider sx={{ mx: 1 }} />

                        {item.list && item.list.map((subItem, subIndex) => ( // Controlla che item.list esista
                            <MenuItem
                                key={subIndex}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    borderRadius: '8px',
                                    mx: 1,
                                    my: 1,
                                    backgroundColor: stateNavigation[subItem.url] === 1 ? '#E0F2F1' : 'inherit'
                                }}
                            >
                                <Link to={subItem.url} style={{ textDecoration: 'none', textAlign: "center" }}>
                                    <ListItemIcon sx={{ justifyContent: "center" }}>
                                        {subItem.icon}
                                    </ListItemIcon>
                                </Link>
                            </MenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </MenuList>

            {/* <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center", fontSize: "13px", fontWeight: 400, lineHeight: "22px", textAlign: "center", textWrap: "wrap" }}>
                {getFormattedDateTime()}
            </Box> */}
        </Box>
    </Box>

)}
