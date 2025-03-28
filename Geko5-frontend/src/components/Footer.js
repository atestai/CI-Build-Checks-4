import { Alert, Box, Typography } from "@mui/material";
import EULA from "../pdf/Wisnam - End User License Agreement(EULA).pdf"


export default function Footer({ open , isTokenExpired }) {

    return (
        <Box sx={{
            width: { sm: "100%", lg: (open) ? `calc(100% - 270px)` : `calc(100% - 90px)` }, position: "fixed",  zIndex: "2", boxShadow: 0,  backgroundColor: "#FFF", bottom: 0, left: 0 , marginLeft: { sm: 0, lg: (open) ? '270px' : '90px' }, py: 0, pt: {sm : 0 , xl:1} }}>



            <Box sx={{  width: "100%" , display: "flex", flexDirection: "row", alignItems: "center", padding: 0 }}>


                <Box sx={{ width: "100%", position : 'relative' ,  display: "flex", flexDirection: { sm: "column", md: "row" }, justifyContent: "space-between", alignItems: "center", my: 2 }}>
                    { isTokenExpired  &&  <Alert sx={{position : 'absolute' ,left: "50%", bottom : 0 , transform: "translateX(-50%)",}} severity="warning"> Your session has expired. Please reload the page.</Alert> }

                    <Box sx={{ fontSize: { xs: "12px", lg: "14px" }, lineHeight: "22px", ml: 4 ,mr: 4, my: { sm: 1, md: 0 } }}>
                        © Copyright 2024 WiSNAM srl | P.I. 04378440871
                    </Box>

                    <Box >
                        <Typography
                            onClick={() => window.open(EULA, '_blank')}
                            sx={{
                                cursor: 'pointer', fontSize: { xs: "12px", lg: "14px" }, lineHeight: "22px", mr: 4
                            }}
                        >
                            End User License Agreement (EULA)
                        </Typography>
                    </Box>


                </Box>
            </Box>
        </Box>
    );
}


