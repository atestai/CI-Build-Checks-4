import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import BackgroundLogin from '../icons/background_Geko_Datalogger.png';
import Logo from "../icons/logoWisnam.svg";
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

export default function SignIn({ open }) {
    return (
        <Box
            sx={{
                backgroundImage: `url(${BackgroundLogin})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundColor: 'rgba(0,0,0,0.5)',
                backgroundPosition: 'center', 
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent:'flex-start',
                alignItems: 'center'
            }}
        >
            <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{maxWidth:1440, width: "70%", display: "flex", height: "320px",justifyContent:"center" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "50%", justifyContent: "center" }}>
                        <img src={Logo} alt='logo' height={"60px"} width={"190px"} />
                        <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                            <Typography sx={{ fontSize: "50px", lineHeight: "69px", fontWeight: "400", color: "white", fontFamily: "Exo", }}>
                                Welcome to
                            </Typography>
                            <Typography sx={{ fontSize: "50px", lineHeight: "69px", fontWeight: "400", color: "white", fontFamily: "Exo", }}>
                                GEKO Data Logger
                            </Typography>
                        </Box>
                    </Box>

                 


                    <Card sx={{minWidth: 275 , maxWidth: 500, backgroundColor: "white", width: "44%", borderRadius: '16px' }}>
                        <CardContent sx={{ display: "flex", flexDirection: "column", padding: "10%",justifyContent:"center", }}>
                            <Typography sx={{ fontSize: "30px", lineHeight: "69px", fontWeight: "400", mb: 4 }}>
                                Forgot Password
                            </Typography>

                            <TextField sx={{ mb: 3 }} id="outlined-basic" label="Enter Address" variant="outlined" />
                            <Button sx={{ width: "100%", textTransform: "none"}} variant="contained">Send</Button>

                     
                        </CardContent>

                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
