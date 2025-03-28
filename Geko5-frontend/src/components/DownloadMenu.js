import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import { Backdrop, Badge, Button, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { Download, } from '@mui/icons-material';
import ServerProxy from '../tools/serverProxy';
import { strings } from '../strings';
import PasswordChangeDialog from './passwordChangeDialog';
import { useState } from 'react';



export default function DownloadMenu(props) {

  const { wsStatus } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [devices, setDevices] = useState(null);
  const [download, setDownload] = useState([]);
  const [load, setLoad] = useState(false);



  const open = Boolean(anchorEl);

  const [openDialogPassword, setOpenDialogPassword] = useState(false);

  function convertTimestampToDate(timestamp) {
    const numericTimestamp = Number(timestamp);
    return new Date(numericTimestamp).toLocaleString();
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const DownloadHistoricalData = async (id) => {
    try {
      props.setLoad(true)
      const response = await ServerProxy.getDownload(id);

      // Creare un Blob dal buffer ricevuto
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      // Creare un link temporaneo per il download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Impostare il nome del file
      link.download = `historical_data_${new Date().toISOString().split('T')[0]}.gz`;

      // Aggiungere il link al documento, cliccare e rimuoverlo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Rilasciare la memoria
      window.URL.revokeObjectURL(url);
      props.setLoad(false)

    } catch (error) {
      props.setLoad(false)

      console.log("Sono qua");

      console.error('Errore durante la richiesta:', error.message);
    }
  }




  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 

  React.useEffect(() => {


    const loadDevices = async () => {
      try {
        const devices = await ServerProxy.getDevices();
        setDevices(devices);
      } catch (connectionError) {
        console.log("Error :", connectionError);
      }
    }


    const loadDownload = async () => {
      try {
        setLoad(true);
         const download = await ServerProxy.getHistoricalDownload();
        setDownload(download);
      } catch (connectionError) {
        console.log("Error :", connectionError);
      } finally {
         setLoad(false);

      }
    }


    if (open) {

      loadDownload();
      loadDevices();

    }


  }, [open])





  return (
    <>



      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Downloads">
          <IconButton
            onClick={handleClick}
            aria-haspopup="true"
            sx={{ color: props.colorIcon }}
          >


            <Badge sx={{ '& .MuiBadge-badge': { backgroundColor: wsStatus.export === 2 ? '#FF0000' : '', color: '#FFF' } }} badgeContent=" " variant="dot">


              <Download />


            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="download-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {download && download.length > 0 ? (
          download.map((element) => {
            try {
              // Effettua il parsing di `payload`, che è una stringa JSON
              const payload = JSON.parse(element.payload);

              // Estrai i valori dalla stringa JSON
              const firstValue = payload[0]; // E.g., 3
              const startTimestamp = payload[1]; // E.g., 1733223600000
              const endTimestamp = payload[2]; // E.g., 1733223900000

              // Trova il device con l'ID corrispondente
              const device = devices?.find((item) => item.id === firstValue);

              return (
                <MenuItem
                  key={element.id} // Usa un identificativo unico come chiave
                  sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}
                >
                  <Typography>
                    {`${element.status === 0 ? "Processing" : "Download"
                      } signals for device ${device?.name} from ${convertTimestampToDate(
                        startTimestamp
                      )} to ${convertTimestampToDate(endTimestamp)}`}
                    {element.status === 0 ? <LinearProgress /> : null}
                  </Typography>

                  {element.status === 1 && (
                    <Button
                      sx={{
                        mt: 1,
                        backgroundColor: "primary",
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: 400,
                        height: "32px",
                        "&:hover": {
                          backgroundColor: "primary",
                          color: (theme) => `${theme.palette.primary.textIntoButton}`,
                        },
                      }}
                      variant="contained"
                      onClick={async () => {
                        DownloadHistoricalData(element.id);
                      }}
                    >
                      {strings.download}
                    </Button>
                  )}

                </MenuItem>
              );
            } catch (e) {
              console.error("Error parsing payload for element:", e);
              return null; // Gestisci l'errore nel caso di un formato payload errato
            }
          })
        ) : (

          (load) ? (
            <Box sx={{ padding: 1 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Typography sx={{ padding: 1, textWrap : 'nowrap' }}>No downloads</Typography>
          )

        )}
      </Menu>

    </>
  );
}
