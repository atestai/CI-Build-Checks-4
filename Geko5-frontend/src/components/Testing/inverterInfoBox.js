import { Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";


export function BasicTable(props) {

    const {headers=[], rows=[], sx, firstBold=false} = props


    return (
        <TableContainer sx={{...sx}} component={Paper}>
            <Table >
                <TableHead>
                    <TableRow>
                        {headers.map( header => (
                            <TableCell align="center" sx={{fontSize: '.8rem', p: 1, fontWeight: 'bold' }} >{`${header}`}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {row.map( (r, j) => (
                                <TableCell sx={{fontSize: '1.1rem',  p: 1, fontWeight: (firstBold && !j) ? 'bold' : '' }} key={j} align="center">{r}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


export default function InverterInfoBox(props){

    const {title, rows} = props;

    const [total, setTotal] = useState({P: 0, available: 0, p: 0});

    useEffect( () => {


        const initialValue = 0;
        const P = props.rows.reduce(
            (accumulator, currentValue) => accumulator + currentValue[2],
            initialValue,
        );


        const available = props.rows.reduce(
            (accumulator, currentValue) => accumulator + currentValue[1],
            initialValue,
        );

        const Q = props.rows.reduce(
            (accumulator, currentValue) => accumulator + currentValue[5],
            initialValue,
        );


        setTotal({P, available, Q})

    },[props.rows]);

    return (

        
        <Stack spacing={2}>

            <Typography variant="h5" gutterBottom  sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center'}}>{title}</Typography>

            <Divider />

            <Stack direction="column" spacing={1} sx={{width: '100%'}} useFlexGap flexWrap="wrap">
                <BasicTable sx={{width: '100%'}} headers={['Available', 'Unavailable']} rows={[[total.available, '0']]}  ></BasicTable>
                {/* <BasicTable sx={{width: '49%'}} headers={['(ms)', 'Mean', '@']} rows={[['Read Delay', '2.4', '1.05'], ['Write Delay', '2.4', '1.05']]} firstBold={true} ></BasicTable> */}
                <BasicTable sx={{width: '100%'}} headers={[ 'Total P (kW)', 'Total Q (kVAr)']} rows={[[total.P, total.Q]]} ></BasicTable>
                                
            </Stack>
        </Stack>

    )

}