import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Chip, Divider, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';



export default function BasicTable(props) {

  const theme = useTheme();

  const cssAdd = {
    border: `1px solid ${theme.palette.primary.dark}`, 
    borderBottom: 'none',
    paddingTop: 0.5, 
    paddingBottom: 0.5
  }

  const cssBody = {
    // border: "1px solid #ccc", 
    //borderBottom: 'none',
    paddingTop: .8, 
    paddingBottom: .8
  }


  return (
    <TableContainer component={Paper}>

      { props.title && (
          <>
            <Typography variant="h5" gutterBottom  sx={{p: 1, width: '100%', fontWeight: 'bold', textAlign: 'center'}}>{props.title}</Typography>
            <Divider />
          </>
      )}
      

      <Table sx={{ minWidth: 650 }}>
        <TableHead >
          <TableRow  sx={{bgcolor: `${theme.palette.primary.main}`}}>
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} rowSpan={2} >Name</TableCell>
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} rowSpan={2} align="center">Status</TableCell>

            <TableCell sx={{fontWeight: 'bold',...cssAdd}} colSpan={2} align="center">Active Power</TableCell>
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} colSpan={2} align="center">Reactive Power</TableCell>

            <TableCell sx={{fontWeight: 'bold',...cssAdd}} rowSpan={2} align="center">Nominal Power</TableCell>
          </TableRow>

          <TableRow  sx={{ height: '20px', bgcolor: `${theme.palette.primary.main}`}}>
            {/* <TableCell sx={{fontWeight: 'bold'}} ></TableCell> */}
            {/* <TableCell sx={{fontWeight: 'bold'}} align="center"></TableCell> */}
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} align="center">Measured</TableCell>
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} align="center">Set Point</TableCell>
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} align="center">Measured</TableCell>
            <TableCell sx={{fontWeight: 'bold',...cssAdd}} align="center">Set Point</TableCell>
            {/* <TableCell sx={{fontWeight: 'bold'}} align="center">Nominal Power</TableCell> */}
          </TableRow>          
        </TableHead>


        <TableBody>
          {props.rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{fontWeight: 'bold',...cssBody}} component="th" scope="row">{row[0]}</TableCell>
              <TableCell sx={{...cssBody}} align="center" >{row[1] ? <Chip label="Available" color="success" /> : <Chip label="Unavailable" color="warning" />}</TableCell>
              <TableCell sx={{...cssBody}} align="center">{row[2]} kW ({ (row[2] / row[3] * 100).toFixed(2) } %)</TableCell>
              <TableCell sx={{...cssBody}} align="center">{row[1] ? row[4] : 0} %</TableCell>
              <TableCell sx={{...cssBody}} align="center">{row[5]} kVAr ({row[6]} %)</TableCell>
              <TableCell sx={{...cssBody}} align="center">{row[7]} %</TableCell>
              <TableCell sx={{...cssBody}} align="center">{row[8]} kW</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}