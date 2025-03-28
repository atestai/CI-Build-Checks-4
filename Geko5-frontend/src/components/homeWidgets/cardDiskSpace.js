import { Box, CircularProgress, LinearProgress, Paper, Stack, Typography, styled } from "@mui/material";

import { Save } from "@mui/icons-material";
import { useEffect, useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
    padding: '20px'
}));


export default function CardDiskSpace(props) {

    const {
        title='title', 
        data,
        code,
        sx=undefined 
    } = props;


    // let progress = 0;
    // let value = 0;

    // if ( data ){

    //     const current = data[code] / Math.pow(1024, 3);
    //     const max = data.maxDbSizeGB;

    //     progress = ( current / max ) * 100;

    //     value = `${Number.parseFloat(current).toFixed(2)} / ${Number.parseFloat(max).toFixed(2)} Gb`;
    // }


    const [state, setState] = useState({
        progress : 0,
        value : 0
    });


    useEffect ( () => {

        if ( data ){

            const current = data[code] / Math.pow(1024, 3);
            const max = data.maxDbSizeGB;

            setState({
                progress : ( current / max ) * 100,
                value : `${Number.parseFloat(current).toFixed(2)} / ${Number.parseFloat(max).toFixed(2)} Gb`
            })
        }

    }, [data]);


    return (
        <Item sx={{...sx, minHeight: '142px'}}>

            <Stack spacing={2} >

                <Box sx={{ display: 'flex', justifyContent: "flex-start", alignContent: 'center' }} >
                    <Save color="primary" sx={{ fontSize: 32 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "flex-end", alignContent: 'center' }} >

                    <Stack sx={{width: '100%'}}>
                        <Box sx={{ display: 'flex', justifyContent: "flex-end", alignContent: 'center', mb: .4}} >
                            <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: 'black' }} variant="hd">{title}</Typography>
                        </Box>
                        
                        <LinearProgress sx={{width: '100%', mb: .4}} variant="determinate" value={state.progress} />

                        <Box sx={{ display: 'flex', justifyContent: "flex-end", alignContent: 'center' }} >
                            <Typography sx={{ fontWeight: '400', fontSize: '.8rem', color: 'black' }} variant="hd">{state.value}</Typography>
                        </Box>

                    </Stack>
                    
                </Box>

            </Stack>
        </Item>
    ) 
}