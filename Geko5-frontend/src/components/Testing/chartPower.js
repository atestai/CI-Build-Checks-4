import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Stack } from '@mui/material';
import { useTheme } from '@emotion/react';


let c = 3;

export default function ChartPower(props) {

    //console.log( props);

    const {dataSetPoint = [], times= undefined} = props;
    const theme = useTheme();

    //console.log( theme.palette.primary.main);

    const {showMark= false, area= true, color="primary"} = props;

    const [xAxis, setXAxis] = React.useState([]);

    const [series, setSeries] = React.useState(undefined);


    function getRandomNumber() {
        return Math.floor(Math.random() * 10);
    }


    React.useEffect(() => {

        const d = new Date();
        const xv = []

        if (!times){
            for (let i = 0; i < 10; i++) {    

                d.setSeconds( d.getSeconds() + (i * 1) )
    
                const formattedHours = d.getHours().toString().padStart(2, '0');
                const formattedMinutes = d.getMinutes().toString().padStart(2, '0');
                const formattedSeconds = d.getSeconds().toString().padStart(2, '0')
    
                xv.push(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
            }
    
            setXAxis([{scaleType: 'point', data: [...xv]}])
        }   
        else{
            setXAxis([{scaleType: 'point', data: times.map( item => new Date(item).toLocaleTimeString() )  }])
        }
     
        const array = props.data;
     
       
        setSeries([
            { data: [...array], showMark, area , color : theme.palette[color].main, label: props.series1Title  },
            { data: [...dataSetPoint], color:'red', curve: 'linear',  showMark: false, label: props.series2Title  },
        ])

        // setInterval( () => {

        //     setXAxis(a =>{
        
        //         const lastElement = a[0].data[a[0].data.length - 1];

        //         a[0].data.push(lastElement + 1);
        //         a[0].data = a[0].data.slice(-10);


        //         return [...a];
        //     })

            
        //     setSeries( s => {

        //         const [value, sp] = s;

        //         c += 0.1
        //         s[0].data.push(Math.floor(c))
        //         s[1].data.push(Math.floor(3))

        //         s[0].data = s[0].data.slice(-10);
        //         s[1].data = s[1].data.slice(-10);

        //         return [...s];
        //     })
                
        // }, 3000)

    }, [props.data])



    if (!series){
        return;
    }


    return (
        <Stack>

            {/* <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}> 
                    <Typography variant="body2" sx={{ fontWeight: "bold" }} gutterBottom>{props.series1Title}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }} gutterBottom>{props.series2Title}</Typography>
                </Stack> */}

            <LineChart

                xAxis={xAxis}
                series={series}

                height={300}
                grid={{ vertical: true, horizontal: true }}
            />

        </Stack>
    );
}