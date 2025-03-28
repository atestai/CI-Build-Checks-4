import { ExpandMore, SignalWifiStatusbarConnectedNoInternet4, Close, SubtitlesOff, Subtitles } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, Grid, IconButton, Stack, Switch, TextField, Typography } from '@mui/material';

import * as React from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { strings } from '../strings'
import ServerProxy from '../tools/serverProxy';
import config from '../config';
import useWindowSize from '../components/useWindowSize';
import { Chart } from 'chart.js/auto';
import { Link as LinkRouter } from 'react-router-dom';
import Event from '../components/Event';
import Measure from '../components/Measure';
import { getRandomUniqueColor, generateYAxes, resizeGraph } from '../tools/helpers';


import HeaderPage from '../components/headerPage';

export default function RealTimeValue(props) {



    const colorMapRef = useRef({});
    const chartRef = useRef({});
    const chartInstance = useRef({});
    const [datasets, setDatasets] = useState([]);
    const [dataPoints, setDataPoints] = useState([]);
    const [devices, setDevices] = useState(null);
    const [error, setError] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState({});
    const [menuSignal, setMenuSignal] = useState(undefined);
    const resizeNotificationRef = useRef({});
    const [selectSignal, setSelectSignal] = useState({});
    const [telemetryDevices, setTelemetryDevices] = useState(() => {
        const storedDevices = sessionStorage.getItem('device');
        return storedDevices ? JSON.parse(storedDevices) : [];
    });
    const [telemetrySignals, setTelemetrySignals] = useState({});
    const token = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : '';
    const [valuesEvent, setValuesEvent] = useState([]);
    const [visualization, setVisualization] = useState({ event: false, measure: true })
    const [xsValues, setXsValues] = useState({});
    const windowSize = useWindowSize();
    const prevEvent = useRef(visualization.event);



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions

    const filterSignals = (key, item) => {
        const signalType = telemetrySignals[item.id].data[key].signalType;
        console.log("signalType", signalType);
        console.log("visualization", visualization);


        if (visualization.measure) {

            return signalType === 'measure';
        }

        if (visualization.event) {

            return signalType === 'bitmask' || signalType === 'enumeration';
        }


    };


    const handleCheckboxChange = (item, k, dataItem, signalType) => {
        if (visualization.measure) {
            signalTypeMeasure(item, k, dataItem);
        } else if (visualization.event) {
            signalTypeEvent(dataItem?.id, item.label, item.id, signalType, k);
        }
    };


    const isChecked = (k, item, dataItem) => {

        if (visualization.measure) {
            return selectSignal[item.id]?.some(signal => signal.k === k && signal.measureUnit === dataItem.measureUnit) || false;
        }


        if (visualization.event) {
            return valuesEvent?.some(item => Object.values(item)[0][2] == k) ?? false;
        }


    };


    const loadDevices = async () => {

        try {

            const devices = await ServerProxy.getDevices();
            setDevices([...devices
                .filter(item => item.enabled === "1")
                .map(item => ({ label: item.name, id: item.id, deviceTypeId: item.deviceTypeId }))])

        } catch (error) {

            setDevices(null);
            setError(true);


            if (error?.message) {
                console.log(error?.message)
            }
        }

    }


    const resizeGraph = (telemetryDevices) => {
        telemetryDevices.forEach(item => {
            const chart = chartInstance.current[item.id];
            if (chart) {
                chart.resize();
            }

        });
    }


    const signalTypeMeasure = (item, k, dataItem) => {
        setSelectSignal((prevSelectSignal) => {
            const newSignals = { ...prevSelectSignal };

            if (!newSignals[item.id]) {
                newSignals[item.id] = [];
            }

            const selectedSignal = { k, measureUnit: dataItem.measureUnit };

            const signalIndex = newSignals[item.id].findIndex(
                signal => signal.k === k && signal.measureUnit === dataItem.measureUnit
            );

            if (signalIndex > -1) {
                newSignals[item.id] = newSignals[item.id].filter(
                    (_, index) => index !== signalIndex
                );
            } else {
                newSignals[item.id] = [...newSignals[item.id], selectedSignal];
            }

            return newSignals;
        });

        setLoading(prevLoading => ({
            ...prevLoading,
            [item.id]: 'hidden'
        }));
    };


    const signalTypeEvent = async (idSignal, nameDevice, idDevice, signalType, nomeSignal) => {
        console.log("idSignal, nameDevice, idDevice, signalType, nomeSignal", idSignal, nameDevice, idDevice, signalType, nomeSignal);



        try {
            const exists = valuesEvent.some(item => Object.keys(item)[0] === idSignal.toString());

            if (exists) {
                setValuesEvent(prev => prev.filter(item => Object.keys(item)[0] !== idSignal.toString()));

            } else {
                let response;

                if (signalType === 'bitmask') {
                    response = await ServerProxy.getBitMasksForSignal(idSignal);
                } else {
                    response = await ServerProxy.getEnumerationsForSignal(idSignal);

                }

                const event = [response, nameDevice, nomeSignal, idDevice];

                setValuesEvent(prev => [...prev, { [idSignal]: event }]);
            }
        } catch (error) {
            console.log(error);
        }
    };





    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect





    useEffect(() => {
        document.title = "Real-Time data - Wisnam";
        loadDevices();
        props.setStateNavigation(() => {
            const resetValues = {
                home: 0,
                realtimeValue: 0,
                historicalValue: 0,
                dataLogger: 0,
                devicesType: 0,
                devices: 0,
                devicesModbus: 0,
                users: 0,
                ads: 0,
                mqtt: 0,
                saf: 0,
                system: 0
            };

            return {
                ...resetValues,
                realtimeValue: 1
            };
        });
    }, []);


    useEffect(() => {
        if (!telemetryDevices.length) return;

        const ids = telemetryDevices.map(item => item.id).join(',');
        const websocket = new WebSocket(
            `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${config.server.host}${config.server.port ? ':' + config.server.port : ''}/telemetry?device=${ids}&token=${encodeURIComponent(token.token)}`
        );
        websocket.addEventListener("open", () => websocket.send("Connection established"));

        websocket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data?.message) {



                const { deviceId, timestamp: ts, data: value } = data.message;
                const timestamp = new Date(ts);
                try {

                    setDataPoints(prevDataPoints => {
                        const updatedDeviceData = prevDataPoints[deviceId]
                            ? [...prevDataPoints[deviceId], { x: timestamp, y: value }]
                            : [{ x: timestamp, y: value }];

                        if (updatedDeviceData.length > 20) {
                            updatedDeviceData.shift();
                        }

                        return {
                            ...prevDataPoints,
                            [deviceId]: updatedDeviceData,
                        };
                    });

                    setTelemetrySignals(oldState => ({
                        ...oldState,
                        [deviceId]: data.message,
                    }));


                } catch (error) {
                    console.log("Errore nella gestione dei dati:", error);
                }
            }
        });

        return () => {
            websocket.close();
        };
    }, [telemetryDevices]);


    useEffect(() => {

        if (!Object.keys(dataPoints).length) {
            setDatasets({});
            return;
        }

        const newDatasets = {};

        Object.entries(dataPoints).forEach(([deviceId, points]) => {
            const uniqueSelectSignal = (selectSignal[deviceId] || []).map(signal => signal.k);

            const usedColors = Object.values(colorMapRef.current).map(c => c.borderColor);

            newDatasets[deviceId] = uniqueSelectSignal.map(signalKey => {
                if (!colorMapRef.current[signalKey]) {
                    const uniqueBorderColor = getRandomUniqueColor(usedColors);
                    const uniqueBackgroundColor = uniqueBorderColor.replace('1)', '0.2)');
                    colorMapRef.current[signalKey] = {
                        borderColor: uniqueBorderColor,
                        backgroundColor: uniqueBackgroundColor,
                    };
                    usedColors.push(uniqueBorderColor);
                }



                const values = points.map(point => point.y[signalKey]?.value);
                const measureUnit = points[0]?.y[signalKey]?.measureUnit || '';
                const deviceName = telemetryDevices.find(item => item.id == deviceId)?.label;


                return {
                    label: `Device ${deviceName}  - ${signalKey} (${measureUnit})`,
                    data: values,
                    borderColor: colorMapRef.current[signalKey].borderColor,
                    backgroundColor: colorMapRef.current[signalKey].backgroundColor,
                    borderWidth: 2,
                    fill: false,
                    measureUnit: measureUnit,
                };
            });
        });


        setDatasets(newDatasets);



    }, [dataPoints, selectSignal, visualization]);


    useEffect(() => {



        if (!Object.keys(dataPoints).length || !chartRef.current) return;


        Object.entries(datasets).forEach(([deviceId, dataset]) => {


            const selectedSignalsForDevice = selectSignal[deviceId];

            if (!selectedSignalsForDevice || selectedSignalsForDevice.length === 0) {
                if (chartInstance.current[deviceId]) {


                    chartInstance.current[deviceId].destroy();
                    delete chartInstance.current[deviceId];
                }
                return;
            }

            const yAxes = generateYAxes(dataset);

            const options = {
                responsive: true,
                animation: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    ...Object.fromEntries(yAxes.map(axis => [axis.id, axis]))
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    title: {
                        display: false,
                    },
                },
            };


            if (chartInstance.current[deviceId]) {
                chartInstance.current[deviceId].data = { labels: dataPoints[deviceId]?.map(point => point.x.toLocaleTimeString()) || [], datasets: dataset };
                chartInstance.current[deviceId].options = options;
                chartInstance.current[deviceId].update();
            } else {

                try {
                    chartInstance.current[deviceId] = new Chart(chartRef.current[deviceId], {
                        type: 'line',
                        data: { labels: dataPoints[deviceId]?.map(point => point.x.toLocaleTimeString()) || [], datasets: dataset },
                        options: options,
                    });
                } catch (error) {
                    console.log(`Errore nella creazione del grafico per dispositivo ${deviceId}:`, error);
                }
            }


            setLoading(prevLoading => {
                if (prevLoading[deviceId] === 'visible') {
                    return prevLoading;
                }

                return {
                    ...prevLoading,
                    [deviceId]: 'visible',
                };
            });




            Object.entries(resizeNotificationRef.current).forEach(([deviceId, needsResize]) => {
                if (needsResize) {
                    const chart = chartInstance.current[deviceId];

                    if (chart) {
                        chart.resize();

                    }
                    resizeNotificationRef.current[deviceId] = false;
                }
            });







        });


    }, [datasets]);


    useEffect(() => {
        const updatedXsValues = {};

        telemetryDevices.forEach(item => {
            const selectedSignals = selectSignal[item.id] || [];

            const signalsWithMeasureUnit = selectedSignals.filter(signal => signal.measureUnit !== null);
            const signalsWithoutMeasureUnit = selectedSignals.filter(signal => signal.measureUnit === null);

            const uniqueMeasureUnits = [
                ...new Set(signalsWithMeasureUnit.map(signal => signal.measureUnit)) 
            ];

            if (signalsWithoutMeasureUnit.length > 0) {
                uniqueMeasureUnits.push('Implicit Unit');
            }

            const totalSignals = signalsWithMeasureUnit.length + signalsWithoutMeasureUnit.length;

            const isScreenSmall = window.innerWidth < 1410;

            let xsValue = totalSignals >= (isScreenSmall ? 2 : 3) ? "100%" : "50%";

            if (telemetryDevices.length === 1) {
                xsValue = "100%";
            }




            if (xsValue === "100%" && !resizeNotificationRef.current[item.id]) {
                resizeNotificationRef.current[item.id] = true;
            }

            updatedXsValues[item.id] = xsValue;
        });

        setXsValues(updatedXsValues);




    }, [selectSignal, telemetryDevices]);


    useEffect(() => {

        resizeGraph(telemetryDevices)


    }, [menuSignal, props.open])


    useEffect(() => {
        if (prevEvent.current === true && visualization.event === false) {
            telemetryDevices.forEach(item => {
                const chart = chartInstance.current[item.id];
                if (chart) {
                    delete chartInstance.current[item.id];
                }
            });
        }

        prevEvent.current = visualization.event;
    }, [visualization.event]);




  



    return (

        <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', p: .2, overflowY: 'auto' }}>
            <Box sx={{ flexShrink: 0, mb: 3, mt: { sm: 5, lg: 2 } }}>

                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>



                    <HeaderPage title={strings.realTimedata} titleTwo={'Dashboard'} />



                    {!error ? (
                        <>
                            <Box sx={{ position: 'relative', height: `calc(90vh - ${config.heightBanner}px )`, display: "flex", flexDirection: { sm: 'column', lg: 'row' }, py: 2, px: 0 }}>

                                <IconButton onClick={() => setMenuSignal((prevState) => (prevState === 'none' ? undefined : 'none'))} sx={{ display: { sm: 'none', lg: 'inherit' }, position: 'absolute', zIndex: 9999, background: (theme) => `${theme.palette.primary.main}`, "&:hover": { backgroundColor: (theme) => `${theme.palette.primary.main}` }, right: 14, top: -30 }}>

                                    {menuSignal ? <Subtitles sx={{ color: 'white' }} /> : <SubtitlesOff sx={{ color: 'white' }} />}


                                </IconButton>

                                <Box sx={{ display: { sm: 'none', lg: 'inherit' }, position: 'absolute', zIndex: 9999, right: 75, top: -30 }}>

                                    <Stack direction="row" sx={{ backgroundColor: 'white', borderRadius: '16px', px: 2 }}>
                                        <Typography sx={{ alignContent: 'center' }}>   {strings.event} </Typography>

                                        <Switch
                                            color="default"
                                            checked={visualization.measure}
                                            onChange={() =>
                                                setVisualization((prev) => ({ ...prev, event: !prev.event, measure: !prev.measure }))
                                            }
                                            name="Active"
                                        />
                                        <Typography sx={{ alignContent: 'center' }}>   {strings.measure} </Typography>


                                    </Stack>
                                </Box>





                                <Box sx={{ position: "relative", height: "auto", display: { sm: 'block', lg: 'none' }, mx: 1, my: { sm: 1, lg: 0 } }}>

                                    <FormControl variant="standard" sx={{ minWidth: { sm: '100%', md: 300 } }}>
                                        <Autocomplete
                                            disablePortal
                                            options={devices || []}
                                            value={devices?.find((device) => device.label === inputValue) || null}

                                            onInputChange={(event, newInputValue) => {

                                                setInputValue(newInputValue);
                                            }}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    setTelemetryDevices(oldState => {
                                                        const deviceExists = oldState.some(device => device.id === newValue.id);
                                                        if (!deviceExists) {
                                                            return [...oldState, newValue];
                                                        }
                                                        return oldState;
                                                    });

                                                    setInputValue('');
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params}
                                                    variant="outlined"
                                                    label="Search devices"
                                                    placeholder="Search devices"
                                                    sx={{
                                                        borderRadius: 1,
                                                        '& .MuiInputLabel-root': {
                                                            color: 'primary.main',

                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: '1px solid primary.main',
                                                        },
                                                        '& .MuiInput-underline:hover:before': {
                                                            borderBottom: '1px solid primary.main',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottom: '2px solid primary.main',
                                                        },

                                                    }}
                                                    InputProps={{
                                                        ...params.InputProps
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>


                                </Box>


                                <Box sx={{ width: { sm: 'inherit', lg: '30%' }, minHeight: "200px", maxHeight: { sm: "300px", lg: "100vh" }, display: (menuSignal) ? menuSignal : 'block', order: { sm: 1, lg: 2 }, overflowY: "auto", boxShadow: 3, mx: 1, borderRadius: 1, my: { sm: 2, lg: 0 }, px: 2 }}>

                                    <Box sx={{ position: 'sticky', display: { sm: 'none', lg: 'block' }, backgroundColor: 'rgba(0, 0, 0, 0.2)', top: 0, mx: -2, py: 2, px: 2, zIndex: 10 }}>

                                        <FormControl variant="standard" sx={{ width: "100%", backgroundColor: "white", borderRadius: 2 }}>
                                            <Autocomplete
                                                disablePortal
                                                options={devices || []}
                                                value={devices?.find((device) => device.label === inputValue) || null}
                                                onInputChange={(event, newInputValue) => {
                                                    setInputValue(newInputValue);
                                                }}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        setTelemetryDevices(oldState => {
                                                            const deviceExists = oldState.some(device => device.id === newValue.id);
                                                            if (!deviceExists) {
                                                                return [...oldState, newValue];
                                                            }
                                                            return oldState;
                                                        });
                                                        setInputValue('');
                                                    }
                                                }}
                                                blurOnSelect={true}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        label="Search devices"
                                                        placeholder="Search devices"
                                                        sx={{
                                                            borderRadius: 1,
                                                            '& .MuiInputLabel-root': {
                                                                color: 'primary.main',
                                                                backgroundColor: "white",
                                                            },
                                                            '& .MuiInput-underline:before': {
                                                                borderBottom: '1px solid primary.main',
                                                            },
                                                            '& .MuiInput-underline:hover:before': {
                                                                borderBottom: '1px solid primary.main',
                                                            },
                                                            '& .MuiInput-underline:after': {
                                                                borderBottom: '2px solid primary.main',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            ...params.InputProps
                                                        }}
                                                    />
                                                )}
                                            />
                                        </FormControl>

                                    </Box>

                                    <Grid container spacing={2}>

                                        {telemetryDevices.map((item, index) => (
                                            <Grid key={index} item sm={6} lg={12}>

                                                <Accordion key={index} defaultExpanded sx={{ minHeight: telemetrySignals[item.id] ? "auto" : "30vh", width: "100%"  }}>

                                                    <AccordionSummary sx={{ bgcolor: '#f5f5f5' }}>
                                                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", }}>

                                                            <Box sx={{ width: '100%', display: "flex", justifyContent: 'space-between' }}>
                                                                <IconButton >
                                                                    <ExpandMore />
                                                                </IconButton>

                                                                <IconButton sx={{
                                                                    "&:hover": {
                                                                        backgroundColor: "transparent",
                                                                    },

                                                                    "&:active": {
                                                                        backgroundColor: "transparent",
                                                                    }
                                                                }} onClick={() => {



                                                                    setValuesEvent(oldState => {
                                                                        const newState = oldState.filter((item) => {
                                                                            const record = Object.values(item)[0];
                                                                            return record.id !== item.id;
                                                                        });


                                                                        return newState;
                                                                    });

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

                                                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'start', p: 0, flexDirection: "column", pl: 1 }}>
                                                                <Typography sx={{ cursor: 'pointer', textDecoration: 'none', color: "black" }} component={LinkRouter} to={`/devices`} variant='body1'> {item.label}</Typography>

                                                                {telemetrySignals[item.id] && (
                                                                    <Typography variant='body1'>{new Date(telemetrySignals[item.id].timestamp).toLocaleString()}</Typography>
                                                                )}
                                                            </Box>


                                                        </Box>


                                                    </AccordionSummary>

                                                    <AccordionDetails sx={{mt:1 , pb:1}} >
                                                        {telemetrySignals[item.id] ? (
                                                            <>
                                                                <Grid container columnSpacing={3} rowSpacing={2}  >
                                                                    {Object.keys(telemetrySignals[item.id].data)
                                                                        .filter(k => filterSignals(k, item))
                                                                        .map((k, ki) => {



                                                                            const dataItem = telemetrySignals[item.id].data[k];

                                                                            // const value = dataItem?.value;
                                                                            const value = typeof dataItem?.value === "object" ? dataItem?.value?.value : dataItem?.value;


                                                                            return (


                                                                                <Grid item xs={12} key={k} sx={{'&.MuiGrid-item' : {paddingTop : 0}}}>
                                                                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0  }}>

                                                                                        <FormControlLabel
                                                                                            control={<Checkbox
                                                                                                checked={isChecked(k, item, dataItem)}
                                                                                                onChange={() => handleCheckboxChange(item, k, dataItem, dataItem.signalType)}

                                                                                                sx={{ transition: 'none', '&:hover': { bgcolor: 'transparent' }, '&.Mui-checked': { bgcolor: 'transparent' }, '&.Mui-focusVisible': { bgcolor: 'transparent' }, '&:active': { bgcolor: 'transparent' } }}
                                                                                            />}
                                                                                            label={`${k} ${dataItem?.measureUnit ? `(${dataItem.measureUnit})` : ''}`}
                                                                                        />

                                                                                        <Box sx={{ display: { sm: "flex" }, mt: { sm: 2, md: 0 } }}>
                                                                                            <Typography variant='body1'>
                                                                                                {value}
                                                                                            </Typography>
                                                                                        </Box>

                                                                                    </Box>
                                                                                    <Divider />
                                                                                </Grid>

                                                                            );
                                                                        })}
                                                                </Grid>

                                                                <Box sx={{ width: "100%", textAlign: "center", mt: 1 }}>
                                                                    <Typography component={LinkRouter} to={`/devicesType/${item.deviceTypeId}/structures`} color="primary" sx={{ cursor: 'pointer', fontSize: "14px", lineHeight: "22px", fontWeight: "400", textDecoration: 'none' }}>
                                                                        {strings.settingsSignal}
                                                                    </Typography>



                                                                </Box>
                                                            </>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', justifyContent: "center", mt: 4 }}>
                                                                <CircularProgress size={32} />
                                                            </Box>
                                                        )}
                                                    </AccordionDetails>
                                                </Accordion>

                                            </Grid>
                                        ))}

                                    </Grid>


                                </Box>


                                <Box sx={{ width: { sm: 'inherit', lg: (menuSignal) ? '100%' : '80%' }, minHeight: "350px", maxHeight: "100%", overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: 3, order: { sm: 2, lg: 1 }, borderRadius: 1, mx: 1, mb: { sm: 2, lg: 0 }, ml: { lg: 0 }, px: 2, py: 2 }}>

                                    {visualization.measure && (
                                        <Measure chartRef={chartRef} loading={loading} datasets={datasets} setDataPoints={setDataPoints} selectSignal={selectSignal} setSelectSignal={setSelectSignal} telemetryDevices={telemetryDevices} setTelemetryDevices={setTelemetryDevices} xsValues={xsValues} />
                                    )}

                                    {visualization.event && (
                                        <Event valuesEvent={valuesEvent} setValuesEvent={setValuesEvent} dataPoints={dataPoints} />
                                    )}




                                </Box>

                            </Box>



                        </>
                    ) : (
                        <Box sx={{ minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "center" }} >
                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Typography sx={{ textAlign: "center" }}>
                                    <SignalWifiStatusbarConnectedNoInternet4 color="primary" sx={{ fontSize: "60px" }} />
                                </Typography>
                                <Typography sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "13px", color: "#0000008F", textAlign: "center" }}>
                                    {strings.status400}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>



            </Box>


        </Box>


    )
}