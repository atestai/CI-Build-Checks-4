import { Box, Card, CardHeader, IconButton, CardContent, CircularProgress, Menu, MenuItem, } from "@mui/material";
import { Close } from '@mui/icons-material';

import ViewListIcon from '@mui/icons-material/ViewList';
import { useEffect, useRef, useState } from "react";


export default function Measure(props) {
    const { chartRef, loading, selectSignal, setSelectSignal, telemetryDevices, setTelemetryDevices, xsValues, datasets, setDataPoints } = props;

    const [anchorElMap, setAnchorElMap] = useState({});
    const [gridOrder, setGridOrder] = useState(datasets);
    const gridRefs = useRef({});

////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 

    const handleOpenMenu = (event, itemId) => {
        setAnchorElMap(prev => ({
            ...prev,
            [itemId]: event.currentTarget,
        }));
    };

    const handleCloseMenu = (itemId) => {
        setAnchorElMap(prev => ({
            ...prev,
            [itemId]: null,
        }));
    };

    const orderGrid = (deviceId, newPosition) => {



        const updatedGridOrder = { ...gridOrder };


        const oldPosition = updatedGridOrder[deviceId];
        const targetDeviceId = Object.keys(updatedGridOrder).find(id => updatedGridOrder[id] === newPosition);

        if (targetDeviceId) {
            updatedGridOrder[targetDeviceId] = oldPosition;
            updatedGridOrder[deviceId] = newPosition;

        }


        handleCloseMenu(deviceId)
        setGridOrder(updatedGridOrder);
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 



    useEffect(() => {


        const initialOrder = {};

        let length = 1;
        telemetryDevices.forEach((element) => {
            initialOrder[element.id] = length;
            length++;
        });

        sessionStorage.setItem('device', JSON.stringify(telemetryDevices));

        setGridOrder(initialOrder);
    }, [telemetryDevices]);



    return (
        <Box sx={{ borderRadius: 1 }}>


            <Box sx={{ display: "flex", flexWrap: "wrap" }} >



                {telemetryDevices.map((item, index) => {

                    const xsValue = xsValues[item.id] || "50%";


                    return (

                        <Box key={index} ref={el => gridRefs.current[item.id] = el} sx={{ order: gridOrder[item.id], width: { sm: "100%", md: `${xsValue}` }, px: 1, py: 1, height: '5%' }}>

                            <Card sx={{ boxShadow: 3 }}>
                                <CardHeader
                                    action={
                                        <Box sx={{ display: "flex" }}>
                                            <IconButton onClick={(e) => handleOpenMenu(e, item.id)} size="small" sx={{ ml: 2 }} aria-controls={Boolean(anchorElMap[item.id]) ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={Boolean(anchorElMap[item.id]) ? 'true' : undefined}>
                                                <ViewListIcon />
                                            </IconButton>

                                            <IconButton sx={{ "&:hover": { backgroundColor: "transparent" }, "&:active": { backgroundColor: "transparent" } }}
                                                onClick={() => {

                                                    setTelemetryDevices(oldState => {
                                                        const newState = [...oldState];
                                                        return newState.filter(device => device.id !== item.id);
                                                    })


                                                    setSelectSignal((prevState) => {
                                                        const updatedState = { ...prevState };
                                                        delete updatedState[item.id];
                                                        return updatedState;
                                                    });

                                                    setDataPoints(prevDataPoints => {
                                                        const updatedDataPoints = { ...prevDataPoints };
                                                        delete updatedDataPoints[item.id];
                                                        return updatedDataPoints;
                                                    });

                                                }}>

                                                <Close />

                                            </IconButton>


                                        </Box>
                                    } titleTypographyProps={{ fontSize: 16, fontFamily: "Roboto" }} title={`Chart of values for the device ${telemetryDevices.find(device => device.id === item.id)?.label ?? ''}`}
                                />


                                <Menu
                                    anchorEl={anchorElMap[item.id]}
                                    open={Boolean(anchorElMap[item.id])}
                                    onClose={() => handleCloseMenu(item.id)}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >

                                    {(() => {
                                        const menuItems = [];
                                        for (let i = 1; i <= Object.keys(gridOrder).length; i++) {
                                            menuItems.push(
                                                <MenuItem
                                                    key={i}
                                                    sx={{
                                                        backgroundColor: gridOrder[item.id] === i ? 'primary.main' : 'white',
                                                        color: gridOrder[item.id] === i ? 'white' : 'black',
                                                        '&:hover': {
                                                            backgroundColor: gridOrder[item.id] === i ? 'primary.main' : 'white',
                                                            color: gridOrder[item.id] === i ? 'white' : 'black',
                                                        }
                                                    }}
                                                    onClick={() => orderGrid(item.id, i)}
                                                >
                                                    Position {i}
                                                </MenuItem>
                                            );
                                        }
                                        return menuItems;
                                    })()}

                                </Menu>






                                <CardContent>
                                    <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>

                                        {selectSignal[item.id]?.length === 0 || !selectSignal[item.id] ? (
                                            <Box sx={{ display: "flex", justifyContent: "center", width: "100%", fontWeight: "400", fontSize: "18px", lineHeight: "20px", color: "primary.main" }}>
                                                Please select at least one signal to display the chart
                                            </Box>
                                        ) : (

                                            <Box sx={{ width: "100%", height: "50%", position: "relative" }}>
                                                <CircularProgress sx={{ display: loading[item.id] === 'hidden' ? 'block' : loading[item.id] === 'visible' && 'none', position: "absolute", left: "50%", top: "30%" }} color="primary" />

                                                <canvas
                                                    style={{ visibility: loading[item.id], width: "100%" }}
                                                    ref={el => chartRef.current[item.id] = el}
                                                    width="100%"
                                                    height="50px"
                                                    key={item.id}
                                                ></canvas>
                                            </Box>
                                            // )
                                        )}
                                    </Box>
                                </CardContent>

                            </Card>
                        </Box>
                    );
                })}





            </Box>



        </Box>
    );

}

