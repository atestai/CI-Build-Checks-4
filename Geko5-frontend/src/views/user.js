import { useEffect, useState } from "react";
import { Box,  Button, Grid, TextField } from "@mui/material";
import { strings } from '../strings'
import { AccountCircle, Save } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import HeaderPage from "../components/headerPage";




export default function Users(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 
    const { user } = props;


    const [actionFuncion, setActionFuncion] = useState(null);
    const [rows, setRows] = useState(user ? user : []);
    const windowSize = useWindowSize();




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 






    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Use Effect 






    useEffect(() => {
        props.setStateNavigation(() => {
            const resetValues = {
                home: 0,
                realtimeValue: 0,
                historicalValue: 0,
                dataLogger: 0,
                devicesType: 0,
                devices: 0,
                devicesModbus: 0,
                users: 0,
                ads: 0,
                mqtt: 0,
                saf: 0,
                system: 0
            };

            return {
                ...resetValues,
                users: 1 // Imposta il valore desiderato
            };
        });
        document.title = "Profile - Wisnam";

    }, []);






    return (

        <>
            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />



            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column' }}>


                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <HeaderPage title={strings.profile} titleTwo={strings.settings} />
                        </Box>
                    </Box>
                </Box>




                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <AccountCircle sx={{ fontSize: "200px", color: 'primary.main' }} />
                </Box>


                <Grid container sx={{ mt: 4 }}>

                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>


                        <Box sx={{ width: { sm: "80%", md: "60%" }, display: "flex", justifyContent: "space-between" }}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                required
                                label={strings.name}
                                size="small"
                                value={rows.name}
                                sx={{ width: "40%", backgroundColor: 'white' }}
                                onChange={event => { setRows({ ...rows, name: event.target.value }) }}

                                InputLabelProps={{ shrink: rows.name !== "", sx: { color: 'primary.main', '&.Mui-focused': { color: 'primary.main' } } }}
                            />


                            <TextField
                                variant="outlined"
                                required
                                label={strings.email}
                                value={rows.email}
                                onChange={event => { setRows({ ...rows, email: event.target.value }) }}
                                sx={{ width: "40%", backgroundColor: 'white' }}
                                size="small"
                                InputLabelProps={{ shrink: rows.email !== "", sx: { color: 'primary.main', '&.Mui-focused': { color: 'primary.main' } } }}

                            />

                        </Box>
                    </Grid>

                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 4 }}>


                        <Box sx={{ width: { sm: "80%", md: "60%" }, display: "flex", justifyContent: "space-between" }}>

                            <TextField
                                variant="outlined"
                                id="outlined-basic"
                                required
                                label={strings.username}
                                value={rows.username}
                                onChange={event => { setRows({ ...rows, username: event.target.value }) }}
                                sx={{ width: "40%", backgroundColor: 'white' }}
                                size="small"
                                InputLabelProps={{ shrink: rows.username !== "", sx: { color: 'primary.main', '&.Mui-focused': { color: 'primary.main' } } }}

                            />



                            {rows?.role == "admin" && (


                                <TextField
                                    variant="outlined"
                                    id="outlined-basic"
                                    required
                                    label={strings.role}
                                    value={rows.role}
                                    sx={{ width: "40%", backgroundColor: 'white' }}
                                    size="small"
                                    InputLabelProps={{ shrink: rows.role !== "", sx: { color: 'primary.main', '&.Mui-focused': { color: 'primary.main' } } }}

                                />






                            )}


                        </Box>
                    </Grid>








                </Grid>


                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button
                        onClick={async () => {



                            const isValid = (
                                rows.name &&
                                rows.email &&
                                rows.username &&
                                rows.role !== undefined

                            );

                            if (!isValid) {
                                props.setAlert(prevState => ({
                                    ...prevState,
                                    message: strings.requiredFields,
                                    hide: 1,
                                    severity: "error"
                                }));
                            } else {



                                try {
                                    await ServerProxy.editUser(rows); // Esegui l'operazione asincrona
                                    props.setAlert(prevState => ({
                                        ...prevState,
                                        message: strings.status200Operation,
                                        hide: 1,
                                        severity: "success"
                                    }));
                                } catch (error) {
                                    props.setAlert(prevState => ({
                                        ...prevState,
                                        message: error.response.data.message,
                                        hide: 1,
                                        severity: "error"
                                    }));
                                }
                            }
                        }}
                        startIcon={<Save />}
                        sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, '&:hover': { backgroundColor: "primary", color: "white" } }} variant="contained"
                    >
                        {strings.save}
                    </Button>

                </Box>


            </Box>

        </>


    )
}