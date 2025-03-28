import { Chip, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function MainMeasures(props) {

    const { title } = props;

    return (
        <Item>

            <Stack spacing={2}>

                {/* <Typography variant="h5" gutterBottom sx={{ width: '100%', fontWeight: 'bold', textAlign: 'center' }}>{title}</Typography>

                <Divider /> */}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Active power</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Reactive power</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Power Factor​</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }} align="left">Set Point</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right">19800 kW</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right">4950 kVAr</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right"><Chip label="Disabled" color="warning" /></TableCell>
                            </TableRow>

                            <TableRow sx={{bgcolor: '#eee'}}>
                                <TableCell sx={{ fontWeight: 'bold' }} align="left">Target</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right">19800 kW</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right">4950 kVAr</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right"><Chip label="Disabled" color="warning" /></TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }} align="left">Set Point Source</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right">Local</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right">Local</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right"><Chip label="Disabled" color="warning" /></TableCell>
                            </TableRow>

                            <TableRow sx={{bgcolor: '#eee'}}>
                                <TableCell sx={{ fontWeight: 'bold' }} align="left">Control Status</TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right"><Chip label="Enabled" color="success" /></TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right"><Chip label="Enabled" color="success" /></TableCell>
                                <TableCell sx={{ fontWeight: 'normal' }} align="right"><Chip label="Disabled" color="warning" /></TableCell>
                            </TableRow>

                            {/* {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">
                                        {row.name}
                                    </TableCell>

                                    <TableCell align="right">{row.status ? <Chip label="On" color="success" /> : <Chip label="Disabled" color="warning" />}</TableCell>
                                    <TableCell align="right">{row.value}</TableCell>

                                    <TableCell align="right">{row.percent}</TableCell>

                                </TableRow>
                            ))} */}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Stack>
        </Item>
    )
}