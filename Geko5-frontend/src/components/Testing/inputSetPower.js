import { Box,  Paper, Stack, Typography, styled } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function CardPower(props) {

    const {title='title', value= 0, color="primary"} = props;

    return (
        <Item>
            <Stack >
                <Box sx={{display:'flex', justifyContent: "flex-start", alignContent: 'center'}} >
                    <InfoIcon color={color} sx={{mr:1}} />
                    <Stack>
                        <Typography textAlign={"left"} variant="subtitle1">{title}</Typography> 
                        <Typography textAlign={"left"} variant="caption">{new Date().toUTCString()}</Typography>
                    </Stack>
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
                    <Typography variant="h4">{value}</Typography>
                </Box>
            </Stack>
        </Item>
    ) 
}