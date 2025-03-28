import { Box, CircularProgress, Divider, Grid, Paper, Stack, styled } from "@mui/material";

import { Gauge, gaugeClasses } from "@mui/x-charts";

import CardPower from "../components/cardPower.js";
import ChartPower from "../components/chartPower.js";
import MainMeasures from "../components/mainMeasures.js";
import GaugeChart from "../components/gauge.js";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import config from "../../config.js";
import HomeWidget from "../homeWidget.js";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function convertSecondsToUptime(seconds) {
    // Arrotondiamo i secondi al numero intero più vicino
    seconds = Math.round(seconds);

    const secondsInDay = 86400; // 24 * 60 * 60
    const secondsInHour = 3600; // 60 * 60
    const secondsInMinute = 60;

    const days = Math.floor(seconds / secondsInDay);
    seconds %= secondsInDay;

    const hours = Math.floor(seconds / secondsInHour);
    seconds %= secondsInHour;

    const minutes = Math.floor(seconds / secondsInMinute);

    return `${days} d, ${hours} h, ${minutes} m`;
}


export default function Home(props) {

    const { user } = props;

    const [message, setMessage] = useState(null);

    const [dataInfo, setDataInfo] = useState({

        uptime: {
            name: 'Up time',
            value: undefined,
            fontSize: '1.1rem',
            color: 'info',
            funValue: convertSecondsToUptime
        },

        currentDate: {
            name: 'Date & Time',
            value: undefined,
            color: 'info',
            fontSize: '1.1rem',
            funValue: (value) => formatDate(new Date(value))
        },

        timeZone: {
            name: 'Time Zone',
            value: undefined,
            color: 'info',
            funValue: (value) => value
        },

        internetStatus: {
            name: 'Internet Status',
            value: undefined,
            color: 'info',
            funValue: (value) => value
        },

        defaultGateway: {
            name: 'Default Gateway',
            value: undefined,
            color: 'info',
            funValue: (value) => value
        },

        intefaceFirst: {
            name: 'Network interface #1',
            value: undefined,
            color: 'warning',
            funValue: (value) => value
        },


        intefaceSecond: {
            name: 'Network interface #2',
            value: undefined,
            color: 'warning',
            funValue: (value) => value
        },


    });

    const [dataSetting, setDataSetting] = useState({

        ads: {
            name: 'Ads',
            value: undefined,
            color: 'info',
            funValue: (value) => value
        },

        mqtt: {
            name: 'Mqtt',
            value: undefined,
            color: 'info',
            funValue: (value) => value
        },

        size: {
            name: 'Disk size ',
            value: undefined,
            color: 'info',
            funValue: (value) => `${Number.parseFloat(value?.current).toFixed(2)} / ${Number.parseFloat(value?.max).toFixed(2)} Gb`
        },

        modbusExecutionTime: {
            name: 'Modbus',
            value: undefined,
            color: 'info',
            funValue: (value) => `${Number.parseFloat(value / 1000).toFixed(2)} Sec`
        },

    });



    useEffect(() => {
        try{
            const websocket = new WebSocket(`${ window.location.protocol === 'https:' ? 'wss' : 'ws'}://${config.server.host}${config.server.port ? ':' + config.server.port : ''}/info`);

            // Connection opened
            websocket.addEventListener("open", (event) => {
                websocket.send("Connection established")
            })

            // Listen for messages
            websocket.addEventListener("message", (event) => {
                //console.log("Message from server ", event.data)

                const data = JSON.parse(event.data);

                setMessage( data.message );
            })

            return () => websocket.close()
        }catch (connectionError) {
            console.error("Errore nella connessione WebSocket:", connectionError);
        }
    }, []);


    useEffect(() => {

        if (message) {

            //console.log('message', Date.now(),  message );

            const { systemInfo } = message;

            const d = { ...dataInfo }

            if (systemInfo){
                Object.keys(systemInfo).forEach(key => {

                    switch (key) {
    
                        case 'internetStatus':
                            d.internetStatus.value = systemInfo.internetStatus + "";
                            d.internetStatus.color = d.internetStatus.value === 'Online' ? 'success' : 'error'
    
                            break;
    
                        case 'activeInterfaces':
    
                            if (systemInfo.activeInterfaces.length > 0) {
                                const { name, address } = systemInfo.activeInterfaces[0]
    
                                d.intefaceFirst.value = address
                                d.intefaceFirst.color = systemInfo.linkStatuses[name] === 'Attivo' ? 'success' : 'error'
                            }
                            else {
                                d.intefaceFirst.value = '-'
                                d.intefaceFirst.color = 'warning'
                            }
    
    
                            if (systemInfo.activeInterfaces.length > 1) {
                                const { name, address } = systemInfo.activeInterfaces[1]
    
                                d.intefaceSecond.value = address
                                d.intefaceSecond.color = systemInfo.linkStatuses[name] === 'Attivo' ? 'success' : 'error'
    
                            }
                            else {
                                d.intefaceSecond.value = '-'
                                d.intefaceSecond.color = 'warning'
                            }
    
    
                            //d.intefaceSecond.value = systemInfo['activeInterfaces'].length > 1 ? systemInfo['activeInterfaces'][1].address + '' : '-'
    
                            break;
    
                        default:
                            if (d[key]) {
                                d[key].value = systemInfo[key] + "";
                            }
    
                            break;
                    }
                });
            }

            setDataInfo(d)

            const ds = { ...dataSetting }

            Object.keys(message).forEach(key => {

                switch (key) {

                    case 'ads':
                    case 'mqtt':
                        ds[key].value = message[key] + "";
                        ds[key].color = ds[key].value === 'connect' ? 'success' : 'error'

                        break;

                    case 'size':

                        const current = message[key] / Math.pow(1024, 3);
                        const max = message.maxDbSizeGB;

                        //console.log( current , max);

                        ds[key].value = {
                            current,
                            max
                        };

                        ds[key].color = (current < max * .8) ? 'success' : (current > max * .8 && current < max * .95) ? 'warning' : 'error'

                        break;

                    default:
                        if (ds[key]) {
                            ds[key].value = message[key] + "";
                        }

                        break;
                }
            });
        }


    }, [message]);

    useEffect(() => {
        // Funzione per azzerare tutti i valori, e poi settare quello desiderato
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
                home: 1 // Imposta il valore desiderato
            };
        });
    }, []); 



    return (
        <Box sx={{ display: 'flex', p: 0 }}>

            <Box sx={{ width: '100%' }}>

                <Grid container spacing={3} sx={{ mb: 2 }}>

                    <Grid item xs={12} sm={8} md={9} xl={10} >
                        {message ? (
                            <>

                                <Grid container spacing={2} sx={{ mb: 2 }}>

                                    <Grid item xs={12} sm={6}  >
                                        <HomeWidget user={user} data={message.devices} title={'Devices'}></HomeWidget>
                                    </Grid>

                                    <Grid item xs={12} sm={6}  >
                                        <CardPower title={1} value={1} />
                                    </Grid>

                               
                                    {dataSetting && Object.keys(dataSetting).map((key, index) => {

                                        const item = dataSetting[key];
                                        return (
                                            <Grid key={index} item xs={12} sm={6} md={3} xl={3} >
                                                <CardPower title={item.name} color={item.color} value={item.funValue(item.value)} fontSize={item.fontSize} />
                                            </Grid>
                                        )
                                    })}

                        
                                    {dataInfo && Object.keys(dataInfo).map((key, index) => {
                                        const item = dataInfo[key];
                                        return (
                                            <Grid key={index} item xs={12} sm={6} md={4} xl={3} >
                                                <CardPower title={item.name} color={item.color} value={item.funValue(item.value)} fontSize={item.fontSize} />
                                            </Grid>
                                        )
                                    })}

                                </Grid>

                              

                            </>

                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', p: 5 }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={4} md={3} xl={2} >
                        
                        <Item >
                            CMD hear
                        </Item>


                    </Grid>

                </Grid>



                {/* {message && <Box sx={{ overflow: 'auto'}} >{JSON.stringify(message)}</Box>} */}


                {/* <Grid container spacing={2}>
                    <Grid item xs={10} >
                        <Grid container spacing={2}>

                            <Grid item xs={6} >
                                <Item>
                                    <ChartPower
                                        title={"Power (kW)"} 
                                        series1Title={"Active Power"}
                                        series2Title={"Active Power Set Point"}
                                        data={[5000, 5000, 5000, 5000, 10000, 10000, 10000, 19800 , 19800 , 19800 ]}
                                        //dataSetPoint={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
                                        //times={['09:00:10', '09:00:20', '09:00:21', '09:00:30', '09:00:40', '09:00:50', '09:01:00', '09:01:20', '09:01:30', '09:01:40']}

                                    />
                                </Item>
                            </Grid>

                            <Grid item xs={6} >
                                <Item>
                                    <ChartPower title={"Power (kVAr)"} 
                                        area={true} 
                                        series1Title={"Reactive Power"} 
                                        series2Title={"Reactive Power Set Point"}    
                                        data={[-2500, -2500, -2500, -2500, -2500, -2500, 2500, 2500, 4980, 4980]}
                                        // dataSetPoint={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} 
                                    />
                                </Item>
                            </Grid>

                            <Grid item xs={12} >
                                <MainMeasures title={'Measures'} />
                            </Grid>

                        </Grid>

                    </Grid>

                    <Grid item xs={2} >

                        <Stack spacing={2}>
                            <Item>
                                <GaugeChart title={"Active Power Set point​"} um={"kW"} color={"primary"} defaultValue={19800} maxValue={24750} />
                            </Item>

                            <Item>
                                <GaugeChart title={"Reactive Power Set point​"} um={"kVAr"} color={"primary"} defaultValue={4950} maxValue={24750} />
                            </Item>

                            <Item>
                                <GaugeChart title={"Power Factor​ Set point​"} color={"primary"} defaultValue={0} status={'Disabled'} maxValue={1} />
                            </Item>
                        </Stack>
                    </Grid>
                </Grid> */}
            </Box>


        </Box>
    )
}