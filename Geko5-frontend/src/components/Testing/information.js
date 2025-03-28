import { Box, Button, Divider, Grid, Paper, Stack, Typography, styled } from "@mui/material";

import PieArcLabel from "../components/pie.js";
import BasicBars from "../components/basicBar.js";
import GaugeComposition from "../components/GaugePoint.js";
import BasicTable from "../components/table.js";
import InfoBox from "../components/infoBox.js";
import InverterInfoBox from "../components/inverterInfoBox.js";
import { useEffect, useState } from "react";
import CardPower from "../components/cardPower.js";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



export default function Information() {

  
    const [rows, setRows] = useState([]);


    useEffect( () => {

        const column = [ 
            0, 0, 2750]

        const rows = [];

        for (let index = 0; index < 10; index++) {
          rows.push([`Inverter A${index}`, 1, 
            Math.floor(Math.random() * (2400 - 2000 + 1)) + 2000,
                3000,
                79.99,
                Math.floor(Math.random() * (11 - 6 + 1)) + 6,
              
              ...column]);
        }
    
        setRows(rows);
    }, [])

    const mainCell = 10;

    return (
        <Box sx={{ display: 'flex', p: 1 }}>

            <Box>
                {/* <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={2} >
                        <CardPower title={"Active power"} color={"primary"} value={'19800 kW'} />
                    </Grid>

                    <Grid item xs={2} >
                        <CardPower title={"Reactive power"} color={"secondary"} value={'4950 kVAr'} />
                    </Grid>

                    <Grid item xs={2} >
                        <CardPower title={"Power Factor​"} color={"primary"} value={'0.970'} />
                    </Grid>

                    <Grid item xs={2} >
                        <CardPower title={"Voltage"} color={"secondary"} value={"30.0 kV"} />
                    </Grid>

                    <Grid item xs={2} >
                        <CardPower title={"Frequency"} color={"primary"} value={"50.0 Hz"} />
                    </Grid>

                    <Grid item xs={2} >
                        <CardPower title={"Nominal Power​"} color={"secondary"} value={"24750 kW"} />
                    </Grid>
                </Grid> */}

                <Grid container spacing={2}>
                    <Grid item xs={mainCell}>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Item>
                                    <BasicBars rows={rows} ></BasicBars>
                                </Item>
                            </Grid>

                            <Grid item xs={12}>
                                <BasicTable 
                                    // title={"Inverters list"} 
                                    rows={rows}>
                                </BasicTable>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={(12 - mainCell)}>
                        <Stack spacing={2} >
                        
                            <Item>
                                <InverterInfoBox rows={rows} title={"inverters Information"} />
                            </Item>

                        </Stack>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}