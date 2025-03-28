import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Divider, Stack, Typography, useTheme } from '@mui/material';

export default function BasicBars(props) {

    const theme = useTheme();
    const valueMax = 12;

    const [xAxis, setX] = React.useState([]);
    const [yAxis, setY] = React.useState({p : [], q:[]});
   

    React.useEffect( () => {

        const xAxis = [];
        const yAxis = {p : [], q:[]};

        /*
        for (let index = 0; index < 10; index++) {
            xAxis.push(`Inverter ${index}`);
            yAxis.p.push( Math.floor(Math.random() * valueMax * 2) - valueMax)
            yAxis.q.push( Math.floor(Math.random() * valueMax * 2) - valueMax)
        }
        */

        console.log(props.rows);

        for (const iterator of props.rows) {
            xAxis.push(iterator[0]);
            yAxis.p.push( (iterator[2] / iterator[3]) * 100 )
            yAxis.q.push( iterator[5] )
        }

        setX(xAxis)
        setY(yAxis)

    }, [props.rows])

    return (
        
        <Stack>
            { props.title && (
                <>
                    <Typography variant="h5" gutterBottom  sx={{p: 1, width: '100%', fontWeight: 'bold', textAlign: 'center'}}>{props.title}</Typography>
                    <Divider />
                </>
            )}

            <BarChart
                xAxis={[{ scaleType: 'band', data: xAxis }]}
                
                series={[
                    { data : yAxis.p, color : theme.palette.primary.main, label: 'Active Power'}, 
                    { data : yAxis.q, stack: 'A', color : theme.palette.secondary.main, label: 'Reactive Power'}, 
                    
                ]}

                height={320}
            />

          

        </Stack>


    );
}