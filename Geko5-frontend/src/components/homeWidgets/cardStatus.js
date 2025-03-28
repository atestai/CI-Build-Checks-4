import { Box,  Chip,  CircularProgress,  Paper, Stack, Typography, styled } from "@mui/material";
import { strings } from "../../strings";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
    padding: '20px'
}));


export default function CardStatus(props) {

    const {
        title='title', 
        data,
        code,
        sx=undefined 
    } = props;


    return (
        <Item sx={{...sx, minHeight: '120px'}}>

            <Stack spacing={2} >

                <Box sx={{ display: 'flex', justifyContent: "flex-start", alignContent: 'center', }} >
                    {data ? 
                        <Chip label={ data[code] === 'connect' ? strings.connected : strings.disconnected} sx={{ 
                            fontWeight: 'bold', 
                            color: (theme) => data[code] === 'connect' ? theme.palette.primary.main : theme.palette.error.main  ,
                        }} /> : 
                        <CircularProgress size={32}  /> 
                    }
                </Box>

                <Box sx={{ display: 'flex', justifyContent: "flex-end", alignContent: 'center',  }} >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'black' }} variant="hd">{title}</Typography>
                </Box>

            </Stack>
        </Item>
    ) 
}