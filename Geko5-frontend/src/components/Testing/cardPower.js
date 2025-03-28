import { Box,  Paper, Stack, Typography, styled } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)'
    
}));


export default function CardPower(props) {

    const {title='title', value= 0, color="primary", icon: IconComponent = InfoIcon, fontSize='1.1rem', sx=undefined } = props;

    return (
        <Item sx={{...sx, 
            ...(color === 'error' && {
                backgroundColor : 'rgba(255,0,0,0.3)'
            }) 
        }}>
            <Stack >
                <Box sx={{display:'flex', justifyContent: "flex-start", alignContent: 'center'}} >
                    <IconComponent color={color} sx={{ mr: 1 }} />
                    
                    <Typography color={color} textAlign={"left"} variant="subtitle1">{title}</Typography> 
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'center', px: 1, py:3 }}>
                    <Typography sx={{fontSize, textTransform: 'capitalize'}} variant="h4">{value}</Typography>
                </Box>
            </Stack>
        </Item>
    ) 
}