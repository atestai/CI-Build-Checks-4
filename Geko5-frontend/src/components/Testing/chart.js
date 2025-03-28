import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';


let c = 3;

export default function Chart(props) {
    

    const theme = useTheme();

    //console.log( theme.palette.primary.main);

    const {showMark= false, area= true, color="primary"} = props;

    const [xAxis, setXAxis] = React.useState([{
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }]);

    const [series, setSeries] = React.useState([
        {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
    ]);


    function getRandomNumber() {
        return Math.floor(Math.random() * 10);
    }


    React.useEffect(() => {

        let array = [];
        for (let i = 0; i < 10; i++) {
            array.push(getRandomNumber());
        }

        setSeries([
            { data: [...array], showMark, area , color : theme.palette[color].main, label: props.series1Title  },
            { data: [...array].map(i => 3), color:'red', curve: 'linear',  showMark: false, label: props.series2Title  },
        ])

        setInterval( () => {

            setXAxis(a =>{
        
                const lastElement = a[0].data[a[0].data.length - 1];

                a[0].data.push(lastElement + 1);
                a[0].data = a[0].data.slice(-10);

                //console.log(a);

                return [...a];
            })

            
            setSeries( s => {

                const [value, sp] = s;

                c += 0.1
                s[0].data.push(Math.floor(c))
                s[1].data.push(Math.floor(3))

                s[0].data = s[0].data.slice(-10);
                s[1].data = s[1].data.slice(-10);

                return [...s];
            })
                
        }, 3000)

    }, [])



    return (
        <Stack>



            <LineChart
                xAxis={xAxis}
                series={series}

                height={300}
                grid={{ vertical: true, horizontal: true }}
            />

            <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>{props.title}</Typography>

        </Stack>
    );
}