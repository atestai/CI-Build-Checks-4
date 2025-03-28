import { Box, IconButton, Link, Switch, Typography } from "@mui/material";
import { Link as LinkRouter } from "react-router-dom";
import { FormatListBulleted, ContentCopy, Edit, Delete, Visibility, Notifications, EditNotifications, Upload } from "@mui/icons-material";
import { strings } from '../strings'
import { convertTimestamp } from "./helpers";

//Device Type

export const getColumnsDeviceType = (isFullScreen, user, onDetailOkAction, setDetail, setActionFuncion, onDelete) => {
    return [
        ...(user === null || user?.role === "operator"
            ? [
                {
                    field: "id",
                    headerName: strings.id,
                    width: 90,
                },
                {
                    field: "model",
                    headerName: "Model",
                    minWidth: 170,
                    renderCell: (params) => (
                        <Typography
                            title={params.value}
                            sx={{
                                color: "#000000DE !important",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                fontWeight: "400",
                                fontSize: "14px",
                            }}
                        >
                            {params.value}
                        </Typography>
                    ),
                    filterable: false,
                },
                {
                    field: "manufacturer",
                    headerName: "Manufacturer",
                    flex: 1,
                    minWidth: 150,
                },
                {
                    field: "firmwareRev",
                    headerName: "Firmware rev.",
                    flex: 1,
                    minWidth: 150,
                },
                {
                    field: "description",
                    headerName: "Description",
                    flex: 1,
                    minWidth: 150,
                }, {
                    ...(!isFullScreen && {

                        field: "Actions",
                        headerName: "Actions",
                        width: 100,
                        renderCell: (params) => (
                            <Box sx={{ display: "flex", justifyContent: "flex-start", height: "100%", alignItems: "center" }}>
                                <IconButton
                                    color="primary"
                                    title="Signals"
                                    component={LinkRouter}
                                    to={`/devicesType/${params.id}/structures`}
                                    variant="contained"
                                    aria-label="Structure"
                                >
                                    <FormatListBulleted />
                                </IconButton>
                            </Box>
                        ),
                    })
                }
            ]
            : [
                {
                    field: "id",
                    headerName: strings.id,
                    width: 90,
                },
                {
                    field: "model",
                    headerName: "Model",
                    flex: 1,
                    minWidth: 170,
                    renderCell: (params) => (
                        <Typography
                            title={params.value}
                            sx={{
                                color: "#000000DE !important",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                fontWeight: "400",
                                fontSize: "14px",
                            }}
                        >
                            {params.value}
                        </Typography>
                    ),
                    filterable: false,
                },
                {
                    field: "manufacturer",
                    headerName: "Manufacturer",
                    flex: 1,
                    minWidth: 165,
                },
                {
                    field: "firmwareRev",
                    headerName: "Firmware rev.",
                    flex: 1,
                    minWidth: 150,
                },
                {
                    field: "description",
                    headerName: "Description",
                    flex: 1,
                    minWidth: 150,
                },
                {
                    headerName: "Actions",
                    minWidth: isFullScreen ? 100 : 165,
                    field: "Actions",
                    renderCell: (params) => (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", height: "100%", alignItems: "center" }}>
                            <IconButton
                                sx={{ color: "grey" }}
                                title="Copy record"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDetailOkAction({
                                        model: params.row.model + "_copy-1",
                                        manufacturer: params.row.manufacturer,
                                        firmwareRev: params.row.firmwareRev,
                                        enabled: params.row.enabled,
                                        description: params.row.description,
                                    });
                                }}
                                variant="contained"
                                aria-label="Copy record"
                            >
                                <ContentCopy />
                            </IconButton>
                            {!isFullScreen && (
                                <>
                                    <IconButton
                                        color="primary"
                                        title="Signals"
                                        component={LinkRouter}
                                        to={`/devicesType/${params.id}/structures`}
                                        variant="contained"
                                        aria-label="Structure"
                                    >
                                        <FormatListBulleted />
                                    </IconButton>

                                    <IconButton
                                        sx={{ color: "gray" }}
                                        title="Edit"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setDetail({ id: params.id, open: true });
                                        }}
                                        variant="contained"
                                        aria-label="Edit"
                                    >
                                        <Edit />
                                    </IconButton>
                                </>
                            )}
                            <IconButton
                                sx={{ color: "gray" }}
                                title="Delete"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setActionFuncion({ id: params.id, f: onDelete });
                                }}
                                variant="contained"
                                aria-label="Delete"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    ),
                },
            ]),
    ];
};


//Signal

export const getColumnsSignal = (isFullScreen, user, onTogleEnable, onDetailOkAction, setDetail, setActionFuncion, onDelete, id, copyRecord) => {
    return [
        ...(user === null || user?.role === "operator"
            ? [
                {
                    field: "id",
                    headerName: strings.id,
                },
                {
                    field: "name",
                    headerName: strings.name,
                    width: 200,
                    flex: 1,
                },
                {
                    field: "signalType",
                    headerName: strings.signalType,
                    width: 170,
                },
                {
                    field: "modbusFunction",
                    headerName: strings.modbusFunction,
                    width: 170,
                },
                {
                    field: "modbusAddress",
                    headerName: strings.modbusAddress,
                    width: 170,
                },
                {
                    field: "modbusType",
                    headerName: strings.modbusType,
                    width: 170,
                },
                {
                    field: "gain",
                    headerName: strings.gain,
                    width: 170,
                },
            ]
            : [
                {
                    field: "id",
                    headerName: strings.id,
                },
                {
                    field: "name",
                    headerName: strings.name,
                    width: 200,
                    flex: 1,
                },
                {
                    field: "signalType",
                    headerName: strings.signalType,
                    width: 170,
                },
                {
                    field: "modbusFunction",
                    headerName: strings.modbusFunction,
                    width: 170,
                },
                {
                    field: "modbusAddress",
                    headerName: strings.modbusAddress,
                    width: 170,
                },
                {
                    field: "modbusType",
                    headerName: strings.modbusType,
                    width: 170,
                },
                {
                    field: "gain",
                    headerName: strings.gain,
                    width: 170,
                },
                {
                    field: "showOnGraphic",
                    headerName: strings.displayOnGraph,
                    width: 170,
                    renderCell: (params) => {
                        const structures = params.row;
                        return (
                            <Box sx={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
                                <Switch
                                    title={structures.showOnGraphic === 1 ? strings.show : strings.notShow}
                                    checked={structures.showOnGraphic === 1}
                                    onChange={() => onTogleEnable({ id: structures.id, value: structures.showOnGraphic })}
                                    color="primary"
                                />
                            </Box>
                        );
                    },
                },
                {
                    headerName: "Actions",
                    field: "Actions",
                    minWidth: !isFullScreen ? 190 : 15,
                    headerAlign: "center",
                    align: "right",
                    renderCell: (params) => (
                        <Box sx={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
                            <IconButton
                                sx={{ color: "grey" }}
                                title="Copy record"
                                onClick={() => {
                                    copyRecord({
                                        deviceTypeId: id,
                                       
                                        name: params.row.name + "_copy-1",
                                        description: params.row.description,
                                        modbusFunction: params.row.modbusFunction,
                                        modbusAddress: params.row.modbusAddress,
                                        modbusType: params.row.modbusType,
                                        modbusAccess: params.row.modbusAccess,
                                        measureUnit: params.row.measureUnit,
                                        signalType: params.row.signalType,
                                        gain: params.row.gain,
                                        diff: params.row.diff,
                                        postFunction: params.row.postFunction,
                                        showOnGraphic: params.row.showOnGraphic,
                                    }, params.row.id)
                                }}
                                variant="contained"
                                aria-label="Copy record"
                            >
                                <ContentCopy />
                            </IconButton>



                            {!isFullScreen && (
                                <IconButton
                                    sx={{ color: "grey" }}
                                    title="Edit"
                                    onClick={() => {
                                        setDetail((prev) => ({ ...prev, idDeviceType: id, open: true, idRow: params.id }));
                                    }}
                                    variant="contained"
                                    aria-label="Edit"
                                >
                                    <Edit />
                                </IconButton>
                            )}

                            <IconButton
                                sx={{ color: "grey" }}
                                title="Delete"
                                onClick={() => {
                                    setActionFuncion({ id: params.id, f: onDelete });
                                }}
                                variant="contained"
                                aria-label="Delete"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    ),
                },
            ]),
    ];
};


//Alarm

export const getColumnsAlarm = (setDetail, props) => {
    return [
        {
            field: 'isActive',
            headerName: 'Status',
            maxWidth: 100,

        },
        {
            field: 'timestampActive',
            headerName: strings.ActivationTime,
            minWidth: 160,

        },
        {
            field: 'timestampDeactive',
            alignItems: 'center',
            headerName: strings.deactivationTime,
            align: 'center',
            minWidth: 160,

        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 100,
            filterable: false,
        },
        {
            field: 'deviceName',
            headerName: 'Asset',
            width: 150,
        },
        {
            field: 'severity',
            headerName: 'Severity',
            maxWidth: 90,
        },
        {
            field: 'message',
            headerName: 'Message',
            flex: 1,
            width: 140,
        },
        {
            headerName: 'Details',
            field: 'Details',
            width: 140,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', pr: 2 }}>
                    <IconButton onClick={() => setDetail({ row: params.row, open: true })} sx={{ color: 'grey' }} title="More info" variant="contained" aria-label="More info">
                        <Visibility />
                    </IconButton>
                    <IconButton onClick={() => { props.setLoadRenderingPage(true) }} component={LinkRouter} to={`/alarmDetail/${params.row.alarmId}`} sx={{ color: 'grey' }} title="Show alarm" variant="contained" aria-label="Show alarm">
                        <Notifications />
                    </IconButton>
                </Box>
            ),
        },
    ];
};

//Cpu

export const getColumnsCpu = (isFullScreen, user, onTogleEnable, onDetailOkAction, setDetail, setActionFuncion, onDelete) => {
    return [
        ...(user === null || user?.role === 'operator'
            ? [
                {
                    field: 'id',
                    headerName: strings.id,
                    width: 90
                },
                {
                    field: 'name',
                    headerName: 'Name',
                    minWidth: 200,
                    filterable: false,
                },
                {
                    field: 'host',
                    headerName: 'Host',
                    minWidth: 200,
                },
                {
                    field: 'description',
                    headerName: 'Description',
                    flex: 1,
                    minWidth: 250,
                },
                {
                    field: 'location',
                    headerName: 'Location',
                    flex: 1,
                    minWidth: 200,
                }
            ]
            : [
                {
                    field: 'id',
                    headerName: strings.id,
                    width: 90
                },
                {
                    field: 'name',
                    headerName: 'Name',
                    minWidth: 200,
                    filterable: false,
                },
                {
                    field: 'host',
                    headerName: 'Host',
                    minWidth: 200,
                },
                {
                    field: 'description',
                    headerName: 'Description',
                    flex: 1,
                    minWidth: 250,
                },
                {
                    field: 'location',
                    headerName: 'Location',
                    minWidth: 200,
                },
                {
                    field: 'enabled',
                    headerName: 'Status',
                    minWidth: 120,
                    renderCell: (params) => (
                        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                            <Switch
                                title={params.value === '1' ? strings.enable : strings.disable}
                                checked={params.value === '1'}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onTogleEnable({ id: params.id, value: params.value });
                                }}
                                color={'primary'}
                            />
                        </Box>
                    )
                },
                {
                    headerName: 'Actions',
                    field: 'Actions',
                    width: isFullScreen ? 100 : 140,
                    renderCell: (params) => (
                        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', pr: 2 }}>

                            <IconButton
                                sx={{ color: 'grey' }}
                                title="Copy record"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDetailOkAction({
                                        name: params.row.name + '_copy-1',
                                        host: params.row.host,
                                        description: params.row.description,
                                        enabled: params.row.enabled,
                                        location: params.row.location
                                    });
                                }}
                                variant="contained"
                                aria-label="Copy record"
                            >
                                <ContentCopy />
                            </IconButton>
                            {!isFullScreen && (
                                <>
                                    <IconButton
                                        sx={{ color: 'grey' }}
                                        title="Edit"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setDetail({ open: true, id: params.id });
                                        }}
                                        variant="contained"
                                        aria-label="Edit"
                                    >
                                        <Edit />
                                    </IconButton>

                                    <IconButton
                                        sx={{ color: 'grey' }}
                                        title="Delete"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setActionFuncion({ id: params.id, f: onDelete });
                                        }}
                                        variant="contained"
                                        aria-label="Delete"
                                    >
                                        <Delete />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    )
                }
            ]),
    ];
};



//Device

export const getColumnsDevice = (
    isFullScreen,
    user,
    onTogleEnable,
    handleCopyRecord,
    setDetailInfo,
    setAssociationAlarm,
    setDetail,
    setActionFuncion,
    onDelete
) => {
    return [
        ...(user === null || user?.role === "operator"
            ? [
                {
                    field: "id",
                    headerName: strings.id,
                    width: 90,
                },
                {
                    field: "name",
                    headerName: strings.name,
                    flex: 1,
                    minWidth: 170,
                    filterable: false,
                },
                {
                    field: "dataLogger",
                    headerName: strings.dataLogger,
                    flex: 1,
                    minWidth: 160,
                    renderCell: (params) => {
                        const row = params.row;
                        return (
                            <Typography
                                component={LinkRouter}
                                to={`/dataLogger`}
                                title={row.dataLogger}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    color: "#000000DE !important",
                                }}
                            >
                                {row.dataLogger}
                            </Typography>
                        );
                    },
                },
                {
                    field: "deviceType",
                    headerName: strings.deviceModel,
                    flex: 1,
                    minWidth: 160,
                    renderCell: (params) => {
                        const row = params.row || "";
                        return (
                            <Typography
                                component={LinkRouter}
                                to={`/devicesType/${row.deviceTypeId}/structures`}
                                title={row.deviceType}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    color: "#000000DE !important",
                                }}
                            >
                                {row.deviceType}
                            </Typography>
                        );
                    },
                },
                {
                    field: "interface",
                    headerName: strings.deviceInterface,
                    align: "center",
                    flex: 1,
                    minWidth: 160,
                    renderCell: (params) => {
                        const row = params.row || "";
                        return (
                            <Typography
                                component={LinkRouter}
                                to={`/devicesInterface`}
                                title={row.interfaceHost + ":" + row.interfacePort}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    color: "#000000DE !important",
                                }}
                            >
                                {row.interface}
                            </Typography>
                        );
                    },
                },
                {
                    field: "protocol",
                    headerName: strings.protocol,
                    minWidth: 120,
                },
                {
                    field: "enabled",
                    headerName: strings.status,
                    minWidth: 120,
                    renderCell: (params) => {
                        return (
                            <Switch
                                title={params.value === "1" ? strings.enable : strings.disable}
                                checked={params.value === "1"}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onTogleEnable({ id: params.id, value: params.value });
                                }}
                                color={"primary"}
                            />
                        );
                    },
                },


            ]
            : [
                {
                    field: "id",
                    headerName: strings.id,
                    width: 90,
                },
                {
                    field: "name",
                    headerName: strings.name,
                    flex: 1,
                    minWidth: 170,
                    filterable: false,
                },
                {
                    field: "dataLogger",
                    headerName: strings.dataLogger,
                    flex: 1,
                    minWidth: 160,
                    renderCell: (params) => {
                        const row = params.row;
                        return (
                            <Typography
                                onClick={() =>

                                    setDetailInfo((prev) => ({
                                        ...prev,
                                        cpu: { id: row.dataLoggerId, open: true, show: true }
                                    }))
                                }
                                title={row.dataLogger}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    cursor: "help",
                                    color: "#000000DE !important",
                                }}
                            >
                                {row.dataLogger}
                            </Typography>
                        );
                    },
                },
                {
                    field: "deviceType",
                    headerName: strings.deviceModel,
                    flex: 1,
                    minWidth: 160,
                    renderCell: (params) => {
                        const row = params.row || "";
                        return (
                            <Typography
                                onClick={() =>
                                    setDetailInfo((prev) => ({
                                        ...prev,
                                        deviceType: { id: row.deviceTypeId, open: true, show: true }
                                    }))
                                }
                                title={row.deviceType}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    cursor: "help",
                                    color: "#000000DE !important",
                                }}
                            >
                                {row.deviceType}
                            </Typography>
                        );
                    },
                },
                {
                    field: "interface",
                    headerName: strings.deviceInterface,
                    flex: 1,
                    minWidth: 160,
                    renderCell: (params) => {
                        const row = params.row || "";
                        return (
                            <Typography
                                onClick={() =>
                                    row.interface !== "-" &&

                                    setDetailInfo((prev) => ({
                                        ...prev,
                                        deviceInterface: { id: row.interfaceId, open: true, show: true }
                                    }))
                                }
                                title={row.interfaceHost + ":" + row.interfacePort}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: row.interface !== "-" ? "flex-start" : "center",
                                    alignItems: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    cursor: row.interface !== "-" && "help",
                                    color: "#000000DE !important",
                                }}
                            >
                                {row.interface}
                            </Typography>
                        );
                    },
                },
                {
                    field: "protocol",
                    headerName: strings.protocol,
                    minWidth: 120,
                },
                {
                    field: "enabled",
                    headerName: strings.status,
                    minWidth: 120,
                    renderCell: (params) => {
                        return (
                            <Switch
                                title={params.value === "1" ? strings.enable : strings.disable}
                                checked={params.value === "1"}
                                onChange={(event) => {
                                    event.stopPropagation();
                                    onTogleEnable({ id: params.id, value: params.value });
                                }}
                                color={"primary"}
                            />
                        );
                    },
                },
                {
                    field: "Actions",
                    headerName: strings.Actions,
                    width: isFullScreen ? 100 : 180,
                    renderCell: (params) => {
                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    height: "100%",
                                    alignItems: "center",
                                }}
                            >
                                <IconButton
                                    sx={{ color: "grey", order: 2 }}
                                    title="Copy record"
                                    onClick={() => handleCopyRecord(params.row)}
                                >
                                    <ContentCopy />
                                </IconButton>

                                {!isFullScreen && (
                                    <>
                                        <IconButton
                                            sx={{ color: "grey", order: 1 }}
                                            title={strings.associatedAlarm}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setAssociationAlarm({ id: params.id, open: true });
                                            }}
                                        >
                                            <EditNotifications />
                                        </IconButton>
                                        <IconButton sx={{ color: "grey", order: 3 }} onClick={() => setDetail({ id: params.id, open: true })}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton sx={{ color: "grey", order: 4 }} onClick={() => setActionFuncion({ id: params.id, f: onDelete })}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        );
                    },
                },
            ]),
    ];
};


// Device Interface


export const getColumnsDeviceInterface = (isFullScreen, user, onDetailOkAction, setDetail, setActionFuncion, onDelete) => {
    return [
        ...(user === null || user?.role === "operator"
            ? [
                {
                    field: "id",
                    headerName: strings.id,
                    width: 90,
                },
                {
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                    minWidth: 200,
                    filterable: false,
                },
                {
                    field: "host",
                    headerName: "Host",
                    minWidth: 200,
                },
                {
                    field: "port",
                    headerName: "Port",
                    minWidth: 250,
                },
            ]
            : [
                {
                    field: "id",
                    headerName: strings.id,
                    width: 90,
                },
                {
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                    minWidth: 200,
                    filterable: false,
                },
                {
                    field: "host",
                    headerName: "Host",
                    minWidth: 200,
                },
                {
                    field: "port",
                    headerName: "Port",
                    minWidth: 250,
                },
                {
                    headerName: "Actions",
                    field: "Actions",
                    minWidth: isFullScreen ? 40 : 150,
                    renderCell: (params) => {
                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    height: "100%",
                                    alignItems: "center",
                                }}
                            >

                                <IconButton
                                    sx={{ color: "grey" }}
                                    title="Copy record"
                                    onClick={() => {
                                        onDetailOkAction({
                                            name: params.row.name + "_copy-1",
                                            host: params.row.host,
                                            port: params.row.port,
                                        });
                                    }}
                                >
                                    <ContentCopy />
                                </IconButton>
                                {!isFullScreen && (
                                    <>
                                        <IconButton
                                            sx={{ color: "grey" }}
                                            title="Edit"
                                            onClick={() => setDetail({ id: params.id, open: true })}
                                        >
                                            <Edit />
                                        </IconButton>

                                        <IconButton
                                            sx={{ color: "grey" }}
                                            title="Delete"
                                            onClick={() => setActionFuncion({ id: params.id, f: onDelete })}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        );
                    },
                },
            ]),
    ];
};




// Alarm list

export const getColumnsAlarmList = (user, setDetail, copyAlarm, setActionFuncion, onDelete) => {
    return [
        ...(user === null || user?.role === 'operator' ? [
            {
                field: 'id',
                headerName: strings.id,
                width: 90
            },
            {
                field: 'name',
                headerName: 'Name',
                filterable: false,
                minWidth: 150,
            },
            {
                field: 'active_time',
                headerName: 'Active time',
                minWidth: 90,
            },
            {
                field: 'deactive_time',
                headerName: 'Deactive time',
                minWidth: 90,
            },
            {
                field: 'severity',
                headerName: 'Severity',
                minWidth: 90,
            },
            {
                field: 'message',
                headerName: 'Message',
                flex: 1,
                width: 150,
            },
            {
                headerName: 'Actions',
                field: 'Actions',
                width: 120,
                renderCell: (params) => {
                    return (
                        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', pr: 2 }}>
                            <IconButton sx={{ color: 'grey' }} title="Delete" onClick={() => { setDetail({ open: true, dati: params.row.association_asset_alarm, id: params.row.id, name: params.row.name }) }} variant="contained" aria-label="Delete">
                                <EditNotifications />
                            </IconButton>
                            <IconButton sx={{ color: 'grey' }} title="Copy record" onClick={() => {
                                copyAlarm({
                                    name: params.row.name + '_copy-1',
                                    condition: params.row.condition,
                                    active_time: params.row.active_time,
                                    deactive_time: params.row.deactive_time,
                                    message: params.row.message,
                                    severity: params.row.severity,
                                })
                            }} variant="contained" aria-label="Copy record">
                                <ContentCopy />
                            </IconButton>
                        </Box>
                    )
                }
            }
        ] : [
            {
                field: 'id',
                headerName: strings.id,
                width: 90
            },
            {
                field: 'name',
                headerName: 'Name',
                filterable: false,
                minWidth: 150,
            },
            {
                field: 'active_time',
                headerName: 'Active time',
                minWidth: 100,
            },
            {
                field: 'deactive_time',
                headerName: 'Deactive time',
                minWidth: 100,
            },
            {
                field: 'severity',
                headerName: 'Severity',
                minWidth: 90,
            },
            {
                field: 'message',
                headerName: 'Message',
                flex: 1,
                width: 150,
            },
            {
                headerName: 'Actions',
                field: 'Actions',
                width: 180,
                renderCell: (params) => {
                    return (
                        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', pr: 2 }}>
                            <IconButton sx={{ color: 'grey' }} title="Delete" onClick={() => { setDetail({ open: true, dati: params.row.association_asset_alarm, id: params.row.id, name: params.row.name }) }} variant="contained" aria-label="Delete">
                                <EditNotifications />
                            </IconButton>
                            <IconButton sx={{ color: 'grey' }} title="Copy record" onClick={() => {
                                copyAlarm({
                                    name: params.row.name + '_copy-1',
                                    condition: params.row.condition,
                                    active_time: params.row.active_time,
                                    deactive_time: params.row.deactive_time,
                                    message: params.row.message,
                                    severity: params.row.severity,
                                })
                            }} variant="contained" aria-label="Copy record">
                                <ContentCopy />
                            </IconButton>
                            <IconButton component={LinkRouter} to={`/alarmDetail/${params.id}`} sx={{ color: 'grey' }} title="Edit" variant="contained" aria-label="Edit">
                                <Edit />
                            </IconButton>
                            <IconButton sx={{ color: 'grey' }} title="Delete" onClick={() => { setActionFuncion({ id: params.id, f: onDelete }) }} variant="contained" aria-label="Delete">
                                <Delete />
                            </IconButton>
                        </Box>
                    )
                }
            }
        ])
    ];
}


// Users

export const getColumnsForUsers = (user, setDetail, setActionFuncion, onDelete, onTogleEnable) => {
    return [
        {
            field: 'id',
            headerName: strings.id,
            width: 90
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 250,
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            minWidth: 250,
        },
        {
            field: 'enabled',
            headerName: 'Enabled',
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                        {params.row.id === user.id ? '-' : (
                            <Switch
                                title={params.value === '1' ? strings.enable : strings.disable}
                                checked={params.value === '1'}
                                onChange={() => onTogleEnable({ id: params.id, value: params.value })}
                                color={'primary'}
                            />
                        )}
                    </Box>
                )
            }
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            minWidth: 150,
            headerAlign: 'center',
            align: 'right',
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                        <IconButton
                            sx={{ color: 'grey' }}
                            title="Edit"
                            onClick={() => { setDetail({ id: params.id, open: true }) }}
                            variant="contained"
                            aria-label="Edit"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            sx={{ color: 'gray' }}
                            title="Delete"
                            onClick={() => { setActionFuncion({ id: params.id, f: onDelete }) }}
                            variant="contained"
                            aria-label="Delete"
                        >
                            <Delete />
                        </IconButton>
                    </Box>
                )
            }
        }
    ];
};



export const getColumnsForRestore = (user, setApplayRestore, setActionFuncion, onDelete) => {

    return [
        {
            field: 'id',
            headerName: strings.id,
            width: 90
        },
        {
            field: 'datalogger',
            headerName: 'Datalogger',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                        <Link component={LinkRouter} to="/dataLogger" sx={{ textDecoration: 'none' }}>
                            {params.value?.name ? params.value.name : '-'}
                        </Link>
                    </Box>
                )
            }
        },
        {
            field: 'user',
            headerName: 'User',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                        <Link component={LinkRouter} to="/users" sx={{ textDecoration: 'none' }}>
                            {params.value?.name ? `${params.value.name} (${params.value.role})`  : '-'}
                        </Link>
                    </Box>
                )
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created at',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                        {convertTimestamp(params.value)}
                    </Box>
                )
            }
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            minWidth: 150,
            headerAlign: 'center',
            align: 'right',
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                        <IconButton
                            sx={{ color: 'grey' }}
                            title="Applay restore"
                            onClick={() => setApplayRestore(params.row)  }
                            variant="contained"
                            aria-label="Applay restore"
                        >
                            <Upload />
                        </IconButton>
                        <IconButton
                            sx={{ color: 'gray' }}
                            title="Delete"
                            onClick={() => { setActionFuncion({ id: params.id, f: onDelete }) }}
                            variant="contained"
                            aria-label="Delete"
                        >
                            <Delete />
                        </IconButton>
                    </Box>
                )
            }
        }
    ];
};