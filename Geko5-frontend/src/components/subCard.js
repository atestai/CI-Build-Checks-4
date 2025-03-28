import { Box,  Paper, Stack, Typography, styled } from "@mui/material";
import { alpha } from '@mui/material/styles';

import InfoIcon from '@mui/icons-material/Info';


const Item = styled(Paper)(({ theme }) => {
    
    return ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fafafa',
        ...theme.typography.body2,
        padding: theme.spacing(.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        border : `1px solid ${theme.palette.divider}`,
        cursor : 'pointer',

        '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.1),
            boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.19)'
        },

    })
});


export default function SubCard(props) {

    const {title='title', value= 0,  fontSize='1.2rem', sx=undefined } = props;

    return (
        <Item elevation={0} sx={{...sx}}>
            <Stack >
                <Box sx={{display:'flex', justifyContent: "flex-start", alignContent: 'center'}} >   
                    <Typography textAlign={"left"} variant="subtitle2">{title}</Typography> 
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'center', p: 1 }}>
                    <Typography sx={{fontSize, textTransform: 'capitalize'}} variant="h4">{value}</Typography>
                </Box>
            </Stack>
        </Item>
    ) 
}