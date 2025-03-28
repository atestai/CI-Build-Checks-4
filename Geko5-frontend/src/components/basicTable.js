import { Box, CircularProgress, Paper, Table, TableBody, TableCell,  TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { alpha, styled } from '@mui/material/styles';


const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    ...(selected && {
        backgroundColor: `${alpha(theme.palette.primary.light, 0.3)} !important`,
        '&:hover': {
            backgroundColor: `${alpha(theme.palette.primary.light, 0.4)} !important`,
        },
    }),
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
}));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${theme.breakpoints.down('sm')}`]: {
        fontSize: '0.8rem',
    },
}));




function formatValue(params) {

    function isFloat(n) {
        return Number.isFinite(n) && !Number.isInteger(n);
    }

    //return params;

    return isFloat(params) ? Number.parseFloat(params).toFixed(2) : params
}

  

export default function BasicTable(props) {

    const { device, message, setCurrentSignals } = props;

    const [title, setTitle] = useState(null);
    const [rows, setRows] = useState(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowClick = (rowName) => {
        
        setSelectedRows((prevSelected) => {
            if (prevSelected.includes(rowName)) {
                return prevSelected.filter((name) => name !== rowName);
            } else {
                return prevSelected.length <=3 ? [...prevSelected, rowName] : prevSelected;
            }
        });
    };


    useEffect( () => {

        if (message){

            const {timestamp} = message;
            
            if (timestamp){
                setTitle({
                    title : device.name,
                    subTitle : new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
                })
            }

            if (message.message){

                const {data} = message.message;

                if (data) {
                    const rows = [];
    
                    let currentSelectedRows = [...selectedRows];

                    for (const key in data) {

                        if (Object.prototype.hasOwnProperty.call(data, key)) {
                            const value = data[key];
                            
                            rows.push({
                                name: key,
                                value
                            })

                            if (currentSelectedRows.length === 0){
                                currentSelectedRows = [key];
                            }
                        }
                    }
                    setRows( rows );  
                    
                    //console.log( currentSelectedRows );

                    setSelectedRows( currentSelectedRows );
                }
            }
        }

    }, [device, message]);



    useEffect( () => {
        //console.log( selectedRows );
        setCurrentSignals( selectedRows )
    },[selectedRows])

    

    return (
        <>
        { title ? (
             <TableContainer component={Paper}>
                <Table sx={{ minWidth: '100%' }} >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <Typography variant="h6" fontSize={'1rem'} >
                                    {title.title}
                                </Typography>
                                <Typography variant="h6" fontSize={'.9rem'} >
                                    {title.subTitle}
                                </Typography>

                            </TableCell>
                            <TableCell align="right">Values</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows && rows.map((row) => (

                            <StyledTableRow
                                key={row.name}

                                selected={selectedRows.includes(row.name)}
                                onClick={() => handleRowClick(row.name)}

                                sx={{ '&:last-child td, &:last-child th': { border: 0 },  cursor: 'pointer' }}
                            >
                                <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
                                <StyledTableCell align="right">{row.value ? formatValue(row.value) : '-' }</StyledTableCell>
                            
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', p: 5 }}>
                <CircularProgress />
            </Box>
        )}

       
        </>
    );
}
