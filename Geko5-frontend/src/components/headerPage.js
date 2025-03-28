import { Box, Typography } from "@mui/material";
import { Link as LinkRouter } from 'react-router-dom';

export default function HeaderPage(props) {
    const title = props.title;
    const titleTwo = props.titleTwo;
    const anidate = props.anidate || false;
    const anidateTitle = props.anidateTitle;
    const route = props.route || false;
    const path = props.path || '';

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>

            <Box sx={{ display: 'flex', flexDirection: "column" }} >
                <Typography component={'div'} color={'primary'} sx={{ fontWeight: "400", fontSize: "24px", lineHeight: "13px", flexGrow: 1 }} >
                    {title}
                </Typography>

                <Box sx={{ display: "flex", mt: 1 }}>
                    <Typography component={route ? LinkRouter : 'div'} to={route && path} sx={{  textDecoration: 'none'  , color: 'tertiary.text', fontSize: "14px", fontWeight: "400", lineHeight: "22px", mt: 1 }}>{titleTwo}</Typography>
                    <Typography sx={{ color: 'tertiary.text', fontSize: "14px", fontWeight: "400", lineHeight: "22px", mx: 1, mt: 1 }}>/</Typography>
                    {anidate && (
                        <>
                            <Typography sx={{ color: "black", fontSize: "14px", fontWeight: "400", lineHeight: "22px", mt: 1 }}>{anidateTitle}</Typography>
                            <Typography sx={{ color: 'tertiary.text', fontSize: "14px", fontWeight: "400", lineHeight: "22px", mx: 1, mt: 1 }}>/</Typography>
                        </>
                    )}

                    <Typography sx={{ color: "black", fontSize: "14px", fontWeight: "400", lineHeight: "22px", mt: 1 }}>{title}</Typography>
                </Box>

            </Box>


        </Box>
    )
}