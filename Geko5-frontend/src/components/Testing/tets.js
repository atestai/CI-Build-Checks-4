import { Box, Grid, Paper, Stack, styled } from "@mui/material";
import DifferentLengthChart from "../DifferentLength";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import GaugeChart from "./gauge";
import ChartVoltage from "./chartVoltage";
import InfoBox from "./infoBox";
import ChartPower from "./chartPower";
import InverterInfoBox from "./inverterInfoBox";
import CardPower from "./cardPower";
import MainMeasures from "./mainMeasures";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



export default function Main() {

    const mainCell = 9;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>

                        <Grid item xs={2} >
                            <CardPower  title={"Active power"} color={"primary"} value={'19800 kW'} />
                        </Grid>

                        <Grid item xs={2} >
                            <CardPower  title={"Reactive power"} color={"secondary"} value={'19800 kVAr'} />
                        </Grid>

                        <Grid item xs={2} >
                            <CardPower  title={"Power Factor​"} color={"primary"} value={'disabled'} />
                        </Grid>

                        <Grid item xs={2} >
                            <CardPower  title={"Voltage"} color={"secondary"} value={"30.0 kV"} />
                        </Grid>

                        <Grid item xs={2} >
                            <CardPower  title={"Frequency"} color={"primary"} value={"50 Hz"} />
                        </Grid>

                        <Grid item xs={2} >
                            <CardPower  title={"Nominal Power​"} color={"secondary"} value={"24750 kW"} />
                        </Grid>


                        <Grid item xs={5}>
                            <Item>
                                <ChartPower 
                                    title={"Power (MW)"} series1Title={"Active Power"} 
                                    series2Title={"Active Power reference"} 
                                    data={ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} 
                                    dataSetPoint = {[ 10, 20, 30, 30, 30, 30, 30, 30, 30, 30]} 
                                    times={ ['09:00:10', '09:00:20', '09:00:21', '09:00:30', '09:00:40', '09:00:50', '09:01:00', '09:01:20', '09:01:30', '09:01:40']} 

                                    />
                            </Item>
                        </Grid>
                        <Grid item xs={5}>
                            <Item>
                                <ChartPower 
                                    title={"Power (MW)"} series1Title={"Active Power"} 
                                    series2Title={"Reactive Power reference"} 
                                    data={ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} 
                                    dataSetPoint = {[ 10, 20, 30, 30, 30, 30, 30, 30, 30, 30]} 
                                    times={ ['09:00:10', '09:00:20', '09:00:21', '09:00:30', '09:00:40', '09:00:50', '09:01:00', '09:01:20', '09:01:30', '09:01:40']} 

                                    />
                            </Item>
                        </Grid>



                        <Grid item xs={6}>
                            <MainMeasures title={"Measures"}/>
                                {/* <ChartVoltage title={"Voltage (KV)"} color={"secondary"} area={false} series1Title={"Current Voltage"} series2Title={"Max voltage"} />  */}
                            
                        </Grid>

                        <Grid item xs={6}>
                            <Item>
                                <ChartPower title={"Power (MW)"} area={false} series1Title={"Reactive Power"} series2Title={"Reactive Power reference"} data={ [38, 38, 38, 38, 38, -18, -18, -18, -18, -18]} />
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <GaugeChart  title={"Power (MW)"} color={"primary"} valueMax={200} ></GaugeChart>
                            </Item>
                        </Grid>

                    </Grid>
                </Grid>


                <Grid item xs={(12 - mainCell)}>

                    <Stack   >

                        <Grid container spacing={1} sx={{mb: 1}} >
                            <Grid item xs={6} >
                                {/* <Item >
                                    <GaugeChart  title={"Active power (MW)"} color={"primary"} defaultValue={200} valueMax={200} ></GaugeChart>
                                </Item> */}
                                
                                <CardPower  title={"Active power (kW)"} color={"primary"} value={19800} />
                            </Grid>

                            <Grid item xs={6} >
                                <CardPower  title={"Reactive power (kVAr)"} color={"secondary"} value={19800} />
                            </Grid>
                        </Grid>

                        <Item sx={{mb:1}}>
                            <InfoBox title={"Other measures"} />
                        </Item>


                        <Item sx={{mb:1}}>
                            <ChartVoltage title={"Voltage (KV)"} color={"secondary"} area={false} series1Title={"Current Voltage"} series2Title={"Max voltage"} />
                        </Item>


                        <Item>
                            <InverterInfoBox title={"inverter Global Information"} />
                        </Item>

                        {/* <Item>
                           <GaugeChart  title={"Power (MW)"} color={"primary"} valueMax={10000} ></GaugeChart>
                        </Item> */}
                        {/* <Item>
                            <GaugeChart title={"Voltage (V)"} color={"secondary"} ></GaugeChart>
                        </Item> */}
                     
                    </Stack>
                </Grid>
            </Grid>

        </Box>
    )
}