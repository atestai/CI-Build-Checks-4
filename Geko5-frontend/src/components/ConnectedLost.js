import { SignalWifiStatusbarConnectedNoInternet4 } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { strings } from "../strings";

export default function ConnectedLost() {



    return (
        <Box sx={{ minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "center" }} >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography sx={{ textAlign: "center" }}>
                    <SignalWifiStatusbarConnectedNoInternet4 color="primary" sx={{ fontSize: "60px" }} />
                </Typography>
                <Typography sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "13px", color: "#0000008F", textAlign: "center" }}>
                    {strings.status400}
                </Typography>
            </Box>
        </Box>
    )
}