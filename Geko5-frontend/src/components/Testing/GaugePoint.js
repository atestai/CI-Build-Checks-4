import * as React from 'react';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
    gaugeClasses,
} from '@mui/x-charts/Gauge';
import { Stack, Typography, useTheme } from '@mui/material';


export default function GaugeComposition( props) {

    const {color="primary", title=undefined} = props;

    const [value, setValue] = React.useState( props.value );

    const theme = useTheme();

    
    const arcColor = (color === 'primary') ?  theme.palette.primary.main : theme.palette.secondary.main
    const pointerColor = (color === 'primary') ?  theme.palette.secondary.main : theme.palette.primary.main


    function GaugePointer() {
    
        const { valueAngle, outerRadius, cx, cy } = useGaugeState();
    
        if (valueAngle === null) {
            // No value to display
            return null;
        }
    
        const target = {
            x: cx + outerRadius * Math.sin(valueAngle),
            y: cy - outerRadius * Math.cos(valueAngle),
        };
        return (
            <g>
                <circle cx={cx} cy={cy} r={5} fill={pointerColor} />
                <path
                    d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                    stroke={pointerColor}
                    strokeWidth={3}
                />
            </g>
        );
    }
    

    


    return (
        <Stack>
        <GaugeContainer
            height={200}
            startAngle={-110}
            endAngle={110}
            value={value}

        >
            <GaugeReferenceArc  />
            <GaugeValueArc  />
            <GaugePointer />
        </GaugeContainer>

        <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>{title} {value}%</Typography>

        </Stack>
    );
}