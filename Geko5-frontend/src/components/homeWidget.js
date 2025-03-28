import React from 'react';
import { Box, Button,  Paper, Stack, Typography, styled } from "@mui/material";
import { Add } from '@mui/icons-material';


import { strings } from "../strings";
import SubCard from '../subCard';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)'

}));


export default function HomeWidget(props) {

    const {title='title', data={}, sx=undefined } = props;

    return (
        <Item  sx={{...sx}}>
            <Stack >
                <Box sx={{display:'flex', justifyContent: "space-between", alignContent: 'center', mb: 2}} >   
                    <Typography flexGrow={1} textAlign={"left"} variant="subtitle1">{title}</Typography> 
                    
                    <Box>
                        {/* <Button sx={{mr:1}} variant="outlined">Outlined</Button> */}
                        <Button variant="contained" startIcon={<Add />} >{strings.add}</Button>
                    </Box>
                
                </Box>

                <Stack direction="row" spacing={2}>
                    <SubCard sx={{flexGrow: 1}} value={data.inactive} title={strings.inactive}></SubCard>
                    <SubCard sx={{flexGrow: 1}} value={data.enabled} title={strings.active}></SubCard>
                    <SubCard sx={{flexGrow: 1}} value={data.total} title={strings.total}></SubCard>
                </Stack>
            </Stack>
        </Item>
    ) 
}