import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { strings } from "../strings";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Circle, Close } from "@mui/icons-material";

function reverseString(str) {
    return str.split('').reverse().join('');
}


export default function Event(props) {


    const { valuesEvent, dataPoints, setValuesEvent } = props;


    console.log("valuesEvent", valuesEvent);


    return (
        <Grid container spacing={2}>



            {valuesEvent.map((item, index) => {

                console.log("Item", item, index);


                const keyObject = Object.keys(item)[0]; //idSignal
                const valueObject = Object.values(item)[0]; // records , nomeDevice 

                const records = valueObject[0];

                const idDevice = valueObject[3];
                const nomeSignal = valueObject[0][0].device_type_data_structure_.name;
                const signalType = valueObject[0][0].device_type_data_structure_.signalType;
                const modbusType = valueObject[0][0].device_type_data_structure_.modbusType

                const telemetry = dataPoints[idDevice];
                const lastElement = telemetry[telemetry.length - 1];

                let valueSignal;
                let valueSignalBinary;




                if (signalType === 'bitmask') {

                    valueSignal = Object.values(lastElement.y).find((signal) => signal.id == keyObject)?.value;
                    valueSignalBinary = valueSignal ? reverseString(valueSignal.toString(2).padStart(parseInt(modbusType?.match(/\d+/)?.[0] || '0'), '0')) : '0';


                } else {
                    valueSignal = Object.values(lastElement.y).find((signal) => signal.id == keyObject)?.value;
                }
                console.log("valueSignal", valueSignal);
                const valueConverted = typeof valueSignal === "object" ? valueSignal?.value : valueSignal;

                return (
                    <Grid item sm={6} key={keyObject}>
                        <Accordion
                            defaultExpanded
                            sx={{ width: '100%' }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-content-${keyObject}`}
                                id={`panel-header-${keyObject}`}
                            >
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography component="span">{valueObject[1]} - {nomeSignal}</Typography>
                                    <IconButton onClick={() => { setValuesEvent(prev => prev.filter(item => Object.keys(item)[0] !== keyObject.toString())); }} sx={{ "&:hover": { backgroundColor: "transparent" }, "&:active": { backgroundColor: "transparent" } }}>
                                        <Close />
                                    </IconButton>
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Box key={keyObject}>

                                    {signalType === 'bitmask' ? (
                                        <Table aria-label="simple table" sx={{ width: '100%' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{strings.value}</TableCell>
                                                    <TableCell align="left">{strings.bit}</TableCell>
                                                    <TableCell align="left">{strings.description}</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {[...Array(parseInt(modbusType.match(/\d+/)[0]))].map((_, i) => {
                                                    const bitPosition = i;
                                                    const bitValue = valueSignalBinary[i];
                                                    const foundRecord = records.find(obj => obj.bit == bitPosition);

                                                    return (
                                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                                            <TableCell sx={{ width: '5px', py: 0.5 }} component="th" scope="row">

                                                                <Circle sx={{ color: bitValue == 1 ? 'black' : '#EEEEEE', fontSize: '16px' }} />

                                                            </TableCell>

                                                            <TableCell sx={{ width: '5px', py: 0.5 }} align="left">{bitPosition}</TableCell>


                                                            <TableCell title={foundRecord?.description || ''} sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'help', py: 0.5 }} align="left">
                                                                {foundRecord && foundRecord.description ? foundRecord.description : strings.noDescription}
                                                            </TableCell>


                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">{strings.value}</TableCell>
                                                    <TableCell align="left">{strings.description}</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>


                                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                                    <TableCell sx={{ py: 0.5, width: '5px' }} align="left">{valueConverted}</TableCell>
                                                    <TableCell sx={{ py: 0.5 }} align="left">
                                                        {records.find(element => element.value === valueSignal)?.description || strings.noDescription}
                                                    </TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>

                                    )}


                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                );
            })}
        </Grid>
    );
}
