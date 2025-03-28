import { Box,  Chip,  CircularProgress,  Paper, Stack, Typography, styled } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { strings } from "../../strings";
import { Link, Timer } from "@mui/icons-material";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
    padding: '20px'
}));


export default function CardModbus(props) {

    const {
        title='title', 
        data,
        code,
        sx=undefined 
    } = props;

    
    const value = data ? `${Number.parseFloat(data[code] / 1000).toFixed(2)} Sec` : undefined ;

    return (
        <Item sx={{...sx, minHeight: '142px'}}>

            <Stack spacing={2} >

                <Box sx={{ display: 'flex', justifyContent: "flex-start", alignContent: 'center' }} >
                    <Timer color="primary" sx={{ fontSize: 32 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "flex-end", alignContent: 'center' }} >

                    <Stack>
                        <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: 'black' }} variant="hd">{title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'black' }} variant="hd">{data ? value : <CircularProgress size={16} /> }</Typography>
                    </Stack>
                    
                </Box>
            </Stack>
        </Item>
    ) 
}