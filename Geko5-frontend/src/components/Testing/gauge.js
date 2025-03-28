
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";

export default function GaugeChart(props) {

    const {title, um=undefined, color="primary", maxValue = 250, defaultValue = 0, status='Enabled'} = props;

    const step = 10;
    const [value, setValue] = useState( defaultValue );


    useEffect(() => {
        setValue( defaultValue );

      

    }, [])

    return (

        <Stack>

            <Typography variant="h6" gutterBottom  sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center' }}>{title}</Typography>

            <Divider />

            {/* <Gauge
                value={value}
                valueMax={maxValue}
                height={150}
                startAngle={-110}
                endAngle={110}

                sx={(theme) => (
                    
                    {[`& .${gaugeClasses.valueText}`]: {
                      fontSize: 28,
                      transform: 'translate(0px, 0px)',
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: theme.palette[color].main
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: theme.palette.text.disabled,
                    },
                  })}
              
                text={
                    ({ value }) => `${value}`
                }
            /> */}


            <Box sx={{pt: 2}}>
                <Box sx={{width: '100%', display: 'flex', flexDirection: 'column',  justifyContent: 'center', }} >
                    <Typography sx={{mb:1}} variant="h4">{value === 0 ? 'disabled' : value } {um}</Typography>

                    {um && <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>{`${( (value/maxValue * 100).toFixed(0) )}%`}</Typography>}
                    
                </Box>
            </Box>    
 
            <Stack justifyContent="space-between" alignItems="center" direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button fullWidth variant="contained" color={'primary'}>{status}</Button>
                <Button fullWidth variant="contained" color="secondary">Set</Button>
            </Stack>

        </Stack>
    )
}