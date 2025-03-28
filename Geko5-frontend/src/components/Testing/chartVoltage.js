import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';


export default function ChartVoltage(props) {
    

    const theme = useTheme();

    //console.log( theme.palette.primary.main);

    const {showMark= false, area= true, color="primary"} = props;

    const [xAxis, setXAxis] = React.useState([{
        scaleType: 'point',
        data: [0]
    }]);

    const [series, setSeries] = React.useState([
        {data: [220], showMark, area , color : theme.palette[color].main, label: props.series1Title },
    ]);


    function getRandomNumber() {
        return Math.floor(Math.random() * 10);
    }


    React.useEffect(() => {

        let array = [];
        for (let i = 0; i < 10; i++) {
            array.push(getRandomNumber());
        }

        // setSeries([
        //     { data: [...array], showMark, area , color : theme.palette[color].main  },
        //     { data: [...array].map(i => 3), color:'red', curve: 'linear',  showMark: false,  },
        // ])

        // const d = new Date();
        // const xv = []
        // for (let i = 0; i < 10; i++) {
            
        //     d.setSeconds( i * 20 )
        //     console.log(d, `${d.getHours()}:${d.getMinutes()}:${d.getMinutes()}`);

        //     xv.push(`${d.getHours()}:${d.getMinutes()}:${d.getMinutes()}`)
        //     //xv.push("Q" + i );

        // }

        //setXAxis([{scaleType: 'point', data: [...xv]}])

        setInterval( () => {

            setXAxis(a =>{
        
                //const lastElement = a[0].data[a[0].data.length - 1];

                const d = new Date();

                const formattedHours = d.getHours().toString().padStart(2, '0');
                const formattedMinutes = d.getMinutes().toString().padStart(2, '0');
                const formattedSeconds = d.getSeconds().toString().padStart(2, '0')
    

                a[0].data.push(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
                a[0].data = a[0].data.slice(-10);

                //console.log(a);

                return [...a];
            })

            
            setSeries( s => {

                const min = 230, max = 230;
                
                const [value, sp] = s;

                s[0].data.push(Math.floor(Math.random() * (max - min + 1)) + min)
                //s[1].data.push(Math.floor(0))

                s[0].data = s[0].data.slice(-10);
                //s[1].data = s[1].data.slice(-10);

                return [...s];
            })
                
        }, 5000)

    }, [])

    /*
    console.log(xAxis[0].data);
    console.log(series[0].data);
*/

    return (
        <Stack>

            <LineChart
                xAxis={xAxis}
                series={series}

                height={200}
                grid={{ vertical: true, horizontal: true }}
            />

            <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>{props.title}</Typography>

        </Stack>
    );
}