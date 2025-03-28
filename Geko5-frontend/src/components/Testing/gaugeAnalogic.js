
import { Button, Stack, Typography } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";

export default function GaugeChartAnalogig(props) {


    const valueMax = 10000;
    const step = 10;
    const [value, setValue] = useState(1000);


    useEffect(() => {

        setInterval(() => {

            setValue(v => v < valueMax ? (v + step) : 0)

        }, 1000);

    }, [])

    return (

        <Stack>

            <Gauge
                value={value}
                valueMax={valueMax}
                height={150}
                startAngle={-110}
                endAngle={110}
                sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 28,
                        transform: 'translate(0px, 0px)',
                    },
                }}
                text={
                    ({ value, valueMax }) => `${value} KW`
                }
            />

            <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>{props.title}</Typography>

            <Stack justifyContent="space-between" alignItems="center" direction="row" spacing={2} sx={{ mt: 3, mb: 2 }}>
                <Button fullWidth variant="contained" color="primary">View</Button>
                <Button fullWidth variant="contained" color="secondary">Set</Button>
            </Stack>

        </Stack>
s
    )
}