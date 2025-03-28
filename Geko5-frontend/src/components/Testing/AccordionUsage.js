import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Box, FormControlLabel, FormGroup, Grid } from '@mui/material';

export default function AccordionUsage() {
    return (
        <div>


            <Accordion defaultExpanded sx={{ pb: 4,}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                    sx={{ backgroundColor: "#F5F5F5" }}
                >
                    <Box sx={{ display: "flex", width: "40%", justifyContent: "space-between" }}>
                        <Box sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "24px", color: "#009688" }}>
                            Model 6
                        </Box>

                        <Box sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "24px", color: "#009688" }}>

                            List Graphs
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container sx={{ width: "100%", p:2 }}>
                        <Grid item xs={4} >
                            <FormGroup>
                                <FormControlLabel sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 1" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 4" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox/>} label="Graph 7" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 10" />

                            </FormGroup>
                        </Grid>
                        <Grid item xs={4}>
                            <FormGroup>
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 2" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 5" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 8" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 11" />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={4}>
                            <FormGroup>
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 3" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 6" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 9" />
                                <FormControlLabel  sx={{fontSize:"16px", fontWeight:"400", lineHeight:"24px", letterSpacing:"0.15px"}} control={<Checkbox  />} label="Graph 12" />
                            </FormGroup>
                        </Grid>

                    </Grid>
                </AccordionDetails>

            </Accordion>


            <Accordion sx={{mb:4}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"

                >
                    <Box sx={{ display: "flex", width: "40%", justifyContent: "space-between" }}>
                        <Box sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "24px", color: "#009688" }}>
                            Model 7
                        </Box>

                        <Box sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "24px", color: "#009688" }}>

                            List Graphs
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
            </Accordion>

        </div>
    );
}
