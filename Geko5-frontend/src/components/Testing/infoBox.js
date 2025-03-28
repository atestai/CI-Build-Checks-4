import { Box, Divider, Grid, Stack, Typography } from "@mui/material";


function Block(props){

    const {label, value} = props;

    return (

        <Stack direction="row" spacing={1}>
            <Typography variant="body1" sx={{fontSize:'.8rem', width: '100%', fontWeight: 'bold', textAlign: 'right' }}>{label}: </Typography>
            <Typography variant="body1" sx={{fontSize:'.8rem', width: '100%', textAlign: 'left' }}>{value}</Typography>
        </Stack>
    )
}


export default function InfoBox(props){

    const {title} = props;

    return (

        <Stack spacing={2}>

            <Typography variant="h5" gutterBottom  sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center' }}>{title}</Typography>

            <Divider />

            <Grid container spacing={1}>

                <Grid item xs={6}>
                    <Block label="Nominal power" value="19800 kW" ></Block>
                </Grid>

                <Grid item xs={6}>
                    <Block label="Reactive power" value="19800 kW" ></Block>
                </Grid>

                <Grid item xs={6}>
                    <Block label="Power factor" value="1.000" ></Block>       
                </Grid>



            </Grid>

            {/* <Stack direction="row" spacing={0} sx={{width: '100%'}} useFlexGap flexWrap="wrap">
                <Block label="Active power" value="19800 kW" ></Block>
                <Block label="Reactive power" value="-0 kVAr" ></Block>

                <Block label="Voltage" value="228 KV" ></Block>        
                <Block label="Power factor" value="-0.979797" ></Block>        
                                
            </Stack> */}

        </Stack>

    )

}