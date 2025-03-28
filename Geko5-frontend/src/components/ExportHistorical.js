import * as React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { it } from 'date-fns/locale';
import { useState } from 'react';
import { useEffect } from 'react';
import { Autocomplete, CircularProgress, FormControl, TextField, Tooltip, Backdrop, InputAdornment } from '@mui/material';
import { Clear, GetApp, Save } from '@mui/icons-material';
import { strings } from '../strings';
import ServerProxy from '../tools/serverProxy';
import IconButton from '@mui/material/IconButton';


function SimpleDialog(props) {

  const { onClose, open, idDevices } = props;
  const [stateParams, setStateParams] = useState({ startTime: "", endTime: "", device: "", nameDevice: "" });



  /////////////////////////////////////////////////////////////////////////////////////////////////////// Functions


  const handleClose = () => {
    onClose();
  };


  const handleSendData = async () => {


    try {
      props.setLoad(true)
      await ServerProxy.postHistoricalDownload(stateParams);
      onClose();
      props.setAlert(prevState => ({ ...prevState, message: strings.status200Operation, hide: 1, severity: "success" }));
    } catch (error) {
      props.setAlert(prevState => ({ ...prevState, message: error.response.data.message, hide: 1, severity: "error" }));

    } finally {
      props.setLoad(false)

    }


  }


  const handleDateChangeStart = (newDate) => {

    if (newDate === null) {
      setStateParams((prevParams) => ({ ...prevParams, startTime: '', idDevices: props.idDevices }));
      return;
    }

    setStateParams((prevParams) => ({ ...prevParams, startTime: newDate.getTime() }));

  };


  const handleDateChangeEnd = (newDate) => {
    if (newDate === null) {
      setStateParams((prevParams) => ({ ...prevParams, endTime: null, }));
      return;
    }

    setStateParams((prevParams) => ({ ...prevParams, endTime: newDate.getTime() }));

  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect

  useEffect(() => {
    const name = props.devices.find(item => item.id === idDevices)?.label || '';
    setStateParams((prevState) => ({ ...prevState, device: idDevices, nameDevice: name }));
  }, [idDevices]);


  useEffect(() => {

    props.stateParams.startTime !== undefined && setStateParams((prevParams) => ({ ...prevParams, startTime: props.stateParams.startTime }));
    props.stateParams.endTime !== undefined && setStateParams((prevParams) => ({ ...prevParams, endTime: props.stateParams.endTime }));


  }, [props.stateParams])



  return (



    <Dialog onClose={handleClose} open={open} maxWidth={'sm'} sx={{ padding: "29px" }}>

      <Backdrop sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }} open={props.load} >
        <CircularProgress color="primary" />
      </Backdrop>

      <DialogTitle sx={{ position: "relative" }}> Export </DialogTitle>


      <List sx={{ pt: 0, padding: "30px" }}>


        <ListItem disablePadding sx={{ mb: 3 }}>
          <FormControl variant="standard" sx={{ minWidth: { sm: '100%', md: 300 } }}>
            <Autocomplete
              disablePortal={false}
              options={props.devices || []}
              value={props.devices.find((device) => device.label === stateParams.nameDevice) || null}
              isOptionEqualToValue={(option, value) => option.label === value?.label}
              onChange={(event, newValue) => {
                if (newValue) {

                  setStateParams((prevParams) => ({
                    ...prevParams,
                    device: newValue.id,
                    nameDevice: newValue.label
                  }));

                } else {

                  setStateParams((prevParams) => ({
                    ...prevParams,
                    nameDevice: '',
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params}
                  variant="outlined"
                  label="Search devices"
                  placeholder="Search devices"
                  sx={{
                    borderRadius: 1,
                    '& .MuiInputLabel-root': { color: 'primary.main' },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                  }}
                />
              )}
            />
          </FormControl>
        </ListItem>


        <ListItem disablePadding>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
            <DateTimePicker
              label="Start"
              value={stateParams.startTime || null}
              onChange={handleDateChangeStart}
              ampm={false}
              renderInput={(params) => (
                <TextField
                  sx={{
                    width: "100%",
                    borderRadius: 1,
                    '& .MuiInputLabel-root': { color: 'primary.main' },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                    '& .Mui-error': { color: 'primary.main', borderColor: 'transparent' },
                  }}

                  {...params}

                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {stateParams.startTime && (
                          <IconButton sx={{ px: 0, '&:hover': { backgroundColor: 'transparent' } }} onClick={() => { setStateParams((prevParams) => ({ ...prevParams, startTime: null })) }} size="small">
                            <Clear />
                          </IconButton>
                        )}
                        {params.InputProps?.endAdornment}
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </ListItem>


        <ListItem disablePadding sx={{ my: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
            <DateTimePicker
              label="End"
              value={stateParams.endTime || null}
              onChange={handleDateChangeEnd}
              ampm={false}

              renderInput={(params) => (
                <TextField
                  sx={{
                    width: "100%",
                    borderRadius: 1,
                    '& .MuiInputLabel-root': { color: 'primary.main' },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                  }}

                  {...params}

                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {stateParams.endTime && (
                          <IconButton sx={{ px: 0, '&:hover': { backgroundColor: 'transparent' } }} onClick={() => { setStateParams((prevParams) => ({ ...prevParams, endTime: null })); }} size="small">
                            <Clear />
                          </IconButton>
                        )}
                        {params.InputProps?.endAdornment}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </ListItem>

        {stateParams.startTime && stateParams.endTime && stateParams.device ? (
          <ListItem disablePadding sx={{ my: 3, display: "flex", justifyContent: "center" }}>
            <Button startIcon={<Save />} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, '&:hover': { backgroundColor: "primary", color: "white" } }} variant="contained" onClick={() => handleSendData()} >
              Export
            </Button>
          </ListItem>
        ) : ""}


      </List>
    </Dialog>



  );
}



export default function SimpleDialogDemo(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  return (
    <div>


      <Tooltip title={strings.export}>

        <IconButton onClick={handleClickOpen} sx={{ width: "33px", height: "33px", mr: 1, color: "white", backgroundColor: "#007CB0", borderRadius: 2, '&:hover': { backgroundColor: "#007CB0", color: (theme) => `${theme.palette.primary.textIntoButton}` } }}>
          <GetApp />
        </IconButton>

      </Tooltip>



      <SimpleDialog
        devices={props.devices}
        idDevices={props.idDevices}
        open={open}
        alert={props.alert}
        stateParams={props.stateParams}
        setAlert={props.setAlert}
        onClose={handleClose}
        load={props.load}
        setLoad={props.setLoad}
      />
    </div>


  );
}
