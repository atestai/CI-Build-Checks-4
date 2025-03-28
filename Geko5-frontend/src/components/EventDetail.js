import { Box, Button, Dialog, DialogTitle, DialogContent, Switch, TextField, Typography, Select, MenuItem, IconButton, Stack, Backdrop, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";
import { Add, DeleteForever, Remove } from "@mui/icons-material";


export default function EventDetail(props) {



    const { detail, onOkAction, onCloseAction } = props;
    const [event, setEvent] = useState({ bitmask: [], enumeration: [] })
    const length = parseInt(detail.signal?.modbusType?.match(/\d+/)?.[0] || "0");
    const [load, setLoad] = useState(false);
    const validLength = isNaN(length) ? 0 : length;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Functions

    const addEnumeration = (i) => {
        const newEnumeration = {
            value: '1',
            priority: '1000',
            type: 'Information',
            description: '',
        }
        setEvent((prev) => {
            const updatedEnumeration = [...prev.enumeration]
            updatedEnumeration.push(newEnumeration)
            return {
                ...prev,
                enumeration: updatedEnumeration
            }
        })
    }


    const handleSendData = async () => {
        let isValid = false;
        let duplicate = false;
        if (detail?.signal?.signalType === 'bitmask') {
            event.bitmask.forEach((element, index) => {

                if (Number(element[`priority_${index}`]) === 0) {
                    element[`priority_${index}`] = 0;
                }

            });
        } else {
            event.enumeration.forEach((element, index) => {

                if (element.value === '') {
                    isValid = true;
                }

                if (element.priority === '') {
                    element.priority = '1000';
                }

            });

            const values = event.enumeration.map(item => item.value);
            const uniqueValues = new Set(values);
            values.length !== uniqueValues.size && (duplicate = true);


        }

        if (isValid || duplicate) {
            props.setAlert(prevState => ({ ...prevState, message: isValid ? strings.requiredFields : strings.duplicateEnumeration, hide: 1, severity: "error" }));
        } else {
            await onOkAction(detail?.signal?.signalType === 'bitmask' ? event.bitmask : event.enumeration)

        }




    }


    const onClose = function () {
        onCloseAction();
    }


    const removeEnumeration = (index) => {

        if (event?.enumeration.length > 1) {
            setEvent((prev) => {
                const updatedEnumeration = prev.enumeration.filter((_, i) => i !== index);

                return {
                    ...prev,
                    enumeration: updatedEnumeration
                };
            });
        }
    }


    const removeAllEnumeration = () => {
        const newEnumerationRecord = {
            value: '1',
            priority: '1000',
            type: 'information',
            description: '',
        }
        setEvent((prev) => {
            const newEnumeration = [];
            newEnumeration.push(newEnumerationRecord)
            return {
                ...prev,
                enumeration: newEnumeration
            }
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////UseEffect




    useEffect(() => {

        if (detail?.signal?.event?.length > 0) {

            if (detail.signal.signalType === 'bitmask') {
                setEvent((prev) => {
                    return {
                        ...prev,
                        bitmask: [...detail.signal.event]
                    }
                })
            } else {
                setEvent((prev) => {
                    return {
                        ...prev,
                        enumeration: [...detail.signal.event]
                    }
                })
            }
        } else {

            if (detail?.signal?.signalType === 'bitmask') {


                if (event.bitmask.length === 0 && detail.openEvent) {
                    setEvent((prev) => ({
                        ...prev,
                        bitmask: [
                            ...prev.bitmask,
                            ...Array.from({ length: validLength }, (_, i) => ({
                                bit: String(i),
                                onValue: '1',
                                priority: '1000',
                                type: 'Information',
                                description: '',
                            }))
                        ]
                    }));
                }
            } else {
                if (event.enumeration?.length === 0 && detail.openEvent) {
                    setEvent((prev) => ({
                        ...prev,
                        enumeration: [
                            ...prev.enumeration,
                            ...Array.from({ length: 1 }, (_, i) => ({
                                value: '1',
                                priority: '1000',
                                type: 'Information',
                                description: '',
                            }))
                        ]
                    }));
                }
            }
        }





    }, [detail.openEvent])


  






    return (



        <Dialog
            open={detail.openEvent}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}
            sx={{ '& .MuiDialog-paper': { p: 2, backgroundColor: "#F8F8F8", position: "relative" }, }}
            fullWidth={true}
            maxWidth={'xl'}

        >

            <Backdrop sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={load}>
                <CircularProgress color="primary" />
            </Backdrop>


            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                    {(detail?.signal?.id ? strings.edit : strings.new) + ' ' + detail?.signal?.signalType}

                    {detail?.signal?.signalType !== 'bitmask' && (
                        <Box>
                            <IconButton onClick={() => { addEnumeration(event.enumeration.length + 1) }}>
                                <Add color="primary" />
                            </IconButton>

                            <IconButton onClick={() => { removeAllEnumeration() }}>
                                <DeleteForever color="primary" />
                            </IconButton>
                        </Box>
                    )}

                </Box>

            </DialogTitle>

            <DialogContent>
                <Box sx={{ p: 1, height: '100%', overflowY: 'auto' }}>


                    <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>

                        {detail?.signal?.signalType === 'bitmask' ?
                            (
                                //BitMask
                                <Table aria-label="simple table" sx={{ width: '100%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: '10px' }} align="left">{strings.bit}</TableCell>

                                            <TableCell sx={{ width: '50px' }}>{strings.onValue}</TableCell>

                                            <TableCell sx={{ width: '150px' }} align="left">{strings.priority}</TableCell>

                                            <TableCell sx={{ width: '100px' }} align="left" >{strings.type}</TableCell>

                                            <TableCell align="left">{strings.description}</TableCell>


                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {[...Array(validLength)].map((_, i) => {

                                            return (
                                                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                                    <TableCell align="left">{i}</TableCell>

                                                    <TableCell component="th" scope="row">


                                                        <Stack direction="row">
                                                            <Typography sx={{ alignContent: 'center' }}>0</Typography>

                                                            <Switch
                                                                checked={event?.bitmask?.[i]?.onValue === '1'}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.checked ? '1' : '0';

                                                                    setEvent((prev) => {
                                                                        const updatedBitmask = [...prev.bitmask];
                                                                        if (!updatedBitmask[i]) updatedBitmask[i] = {};

                                                                        updatedBitmask[i] = {
                                                                            ...updatedBitmask[i],
                                                                            onValue: newValue
                                                                        };

                                                                        return {
                                                                            ...prev,
                                                                            bitmask: updatedBitmask
                                                                        };
                                                                    });
                                                                }}
                                                                name="Active"
                                                            />

                                                            <Typography sx={{ alignContent: 'center' }}>1</Typography>


                                                        </Stack>

                                                    </TableCell>


                                                    <TableCell component="th" scope="row">
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            value={event.bitmask?.[i]?.priority || ''}
                                                            fullWidth
                                                            type="number"
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                setEvent((prev) => {
                                                                    const updatedBitmask = [...prev.bitmask];
                                                                    if (!updatedBitmask[i]) updatedBitmask[i] = {};

                                                                    updatedBitmask[i] = {
                                                                        ...updatedBitmask[i],
                                                                        priority: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        bitmask: updatedBitmask
                                                                    };
                                                                });

                                                            }}
                                                            size="small"
                                                            inputProps={{ min: 1000 }}
                                                            sx={{
                                                                '& .MuiInputBase-root': { height: '32px' }, // Altezza del campo di input
                                                                '& .MuiOutlinedInput-input': { padding: '6px 8px', width: '100%' } // Regola il padding del testo interno
                                                            }}
                                                        />

                                                    </TableCell>


                                                    <TableCell component="th" scope="row">

                                                        <Select
                                                            variant="outlined"
                                                            labelId="word-order-select-label"
                                                            id="word-order-select"
                                                            value={event.bitmask?.[i]?.type || ''}
                                                            required
                                                            fullWidth

                                                            onChange={(e) => {
                                                                const newValue = e.target.value;




                                                                setEvent((prev) => {
                                                                    const updatedBitmask = [...prev.bitmask];
                                                                    if (!updatedBitmask[i]) updatedBitmask[i] = {};

                                                                    updatedBitmask[i] = {
                                                                        ...updatedBitmask[i],
                                                                        type: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        bitmask: updatedBitmask
                                                                    };
                                                                });
                                                            }}
                                                            sx={{ height: "32px", padding: 0 }}
                                                        >
                                                            <MenuItem value={"Fault"}>{strings.fault}</MenuItem>
                                                            <MenuItem value={"Information"}>{strings.information}</MenuItem>
                                                            <MenuItem value={"Service"}>{strings.service}</MenuItem>
                                                            <MenuItem value={"Warning"}>{strings.warning}</MenuItem>

                                                        </Select>

                                                    </TableCell>


                                                    <TableCell component="th" scope="row" sx={{ py: 0, pt: 0.6 }}>

                                                        <textarea
                                                            style={{ resize: 'none', border: '1px solid #BDBDBD', borderRadius: '2px', width: '100%' }}
                                                            value={event.bitmask?.[i]?.description || ''}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;



                                                                setEvent((prev) => {
                                                                    const updatedBitmask = [...prev.bitmask];
                                                                    if (!updatedBitmask[i]) updatedBitmask[i] = {};

                                                                    updatedBitmask[i] = {
                                                                        ...updatedBitmask[i],
                                                                        description: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        bitmask: updatedBitmask
                                                                    };
                                                                });
                                                            }}
                                                            id="w3review"
                                                            name="w3review"
                                                            rows="3"
                                                        />


                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}




                                    </TableBody>
                                </Table>
                            ) : (
                                //Enumeration
                                <Table aria-label="simple table" sx={{ width: '100%' }}>
                                    <TableHead>
                                        <TableRow>

                                            <TableCell sx={{ width: '150px' }}>{strings.value}<Typography display="inline" color="error">*</Typography></TableCell>

                                            <TableCell sx={{ width: '150px' }} align="left">{strings.priority}</TableCell>

                                            <TableCell sx={{ width: '100px' }} align="left" >{strings.type}</TableCell>

                                            <TableCell sx={{ width: '1000px' }} align="left">{strings.description}</TableCell>

                                            <TableCell sx={{ width: '50px' }}>{strings.Actions}</TableCell>


                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {[...Array(event?.enumeration?.length)].map((_, i) => {

                                            return (
                                                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>


                                                    <TableCell component="th" scope="row">

                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            value={String(event.enumeration?.[i]?.value) || ''}
                                                            fullWidth
                                                            type="number"

                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                setEvent((prev) => {
                                                                    const updatedEnumeration = [...prev.enumeration];
                                                                    if (!updatedEnumeration[i]) updatedEnumeration[i] = {};

                                                                    updatedEnumeration[i] = {
                                                                        ...updatedEnumeration[i],
                                                                        value: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        enumeration: updatedEnumeration
                                                                    };
                                                                });

                                                            }}
                                                            size="small"
                                                            inputProps={{ min: 0 }}

                                                            sx={{
                                                                '& .MuiInputBase-root': { height: '32px' }, // Altezza del campo di input
                                                                '& .MuiOutlinedInput-input': { padding: '6px 8px', width: '100%' } // Regola il padding del testo interno
                                                            }}
                                                        />
                                                    </TableCell>


                                                    <TableCell component="th" scope="row">
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            value={event.enumeration?.[i]?.priority || ''}
                                                            fullWidth
                                                            type="number"

                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                setEvent((prev) => {
                                                                    const updatedEnumeration = [...prev.enumeration];
                                                                    if (!updatedEnumeration[i]) updatedEnumeration[i] = {};

                                                                    updatedEnumeration[i] = {
                                                                        ...updatedEnumeration[i],
                                                                        priority: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        enumeration: updatedEnumeration
                                                                    };
                                                                });
                                                            }}

                                                            inputProps={{ min: 1000 }}

                                                            size="small"
                                                            sx={{
                                                                '& .MuiInputBase-root': { height: '32px' },
                                                                '& .MuiOutlinedInput-input': { padding: '6px 8px', width: '100%' }
                                                            }}
                                                        />

                                                    </TableCell>


                                                    <TableCell component="th" scope="row">

                                                        <Select
                                                            variant="outlined"
                                                            labelId="word-order-select-label"
                                                            id="word-order-select"
                                                            value={event.enumeration?.[i]?.type || ''}
                                                            required
                                                            fullWidth

                                                            onChange={(e) => {
                                                                const newValue = e.target.value;


                                                                setEvent((prev) => {
                                                                    const updatedEnumeration = [...prev.enumeration];
                                                                    if (!updatedEnumeration[i]) updatedEnumeration[i] = {};

                                                                    updatedEnumeration[i] = {
                                                                        ...updatedEnumeration[i],
                                                                        type: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        enumeration: updatedEnumeration
                                                                    };
                                                                });
                                                            }}
                                                            sx={{ height: "32px", padding: 0 }}
                                                        >
                                                            <MenuItem value={"Fault"}>{strings.fault}</MenuItem>
                                                            <MenuItem value={"Information"}>{strings.information}</MenuItem>
                                                            <MenuItem value={"Service"}>{strings.service}</MenuItem>
                                                            <MenuItem value={"Warning"}>{strings.warning}</MenuItem>

                                                        </Select>

                                                    </TableCell>


                                                    <TableCell component="th" scope="row" sx={{ py: 0, pt: 0.6 }}>

                                                        <textarea
                                                            style={{ resize: 'none', border: '1px solid #BDBDBD', borderRadius: '2px', width: '100%' }}
                                                            value={event.enumeration?.[i]?.description || ''}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;


                                                                setEvent((prev) => {
                                                                    const updatedEnumeration = [...prev.enumeration];
                                                                    if (!updatedEnumeration[i]) updatedEnumeration[i] = {};

                                                                    updatedEnumeration[i] = {
                                                                        ...updatedEnumeration[i],
                                                                        description: newValue
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        enumeration: updatedEnumeration
                                                                    };
                                                                });
                                                            }}
                                                            id="w3review"
                                                            name="w3review"
                                                            rows="3"

                                                        />


                                                    </TableCell>

                                                    <TableCell>

                                                        <Box sx={{ display: 'flex' }}>

                                                            <IconButton onClick={() => { removeEnumeration(i) }}>
                                                                <Remove />
                                                            </IconButton>
                                                        </Box>

                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}




                                    </TableBody>
                                </Table>
                            )
                        }


                    </Box>


                </Box>
            </DialogContent>

            <DialogActions >
                <Button onClick={() => { onClose() }} sx={{ width: '50%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined">
                    {strings.discard}
                </Button>





                <Button onClick={() => { handleSendData() }} sx={{ width: '50%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">

                    {detail?.signal?.id ? strings.applyChange : strings.save}

                </Button>
            </DialogActions>


        </Dialog>



    )
}