import axios from "axios";
import config from "../config";
import { getRadioGroupUtilityClass } from "@mui/material";

const baseUrl = config.server.protocol + '//' + config.server.host + (config.server.port ? ':' + config.server.port : '') + config.server.prefix;

const minuteThreshold = 1 * 60 * 1000;


const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
});


const token = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : '';



const url = baseUrl;


const ServerProxy = {


    /*** ALARMS */


    getAlarms: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {


                const { page = 1, pageSize = 500, text = undefined, enabled = -1, selectedDateStart , selectedDateEnd, realTime } = options;
                console.log("selectedDateStart",selectedDateStart);

                const url = baseUrl + `/alarms?${text ? '&name=' + text.trim() : ''}${realTime !== undefined  ? '&realTime=' + realTime : ''}${selectedDateStart  ? '&startDate=' + selectedDateStart : ''}${selectedDateEnd  ? '&endDate=' + selectedDateEnd : ''}`


                



                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });



                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    /***ASSOCIATION ALARMS*/

    addAlarmAssociation: async (alarmAssociation) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/associationAssetAlarm`, {
                    ...alarmAssociation
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    addAssociationAlarm : async (alarmAssociation) => { 

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.patch(
                    baseUrl + `/addAssociationAlarm`, {
                    ...alarmAssociation
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    
    updateAlarmAssociation: async (alarmAssociation) => {

        
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.patch(
                    baseUrl + `/updateAssociationAssetAlarm`, {
                    ...alarmAssociation
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getAlarmsByDeviceId: async (id, options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

         

            try {

                const url = baseUrl + `/device/${id}/alarms`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getAlarmsAssociation: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            const {  text = undefined} = options;


            try {


                const url = baseUrl + `/associationAssetAlarms`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteAlarmAssociation: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/associationAssetAlarm/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteMultipleAlarmsAssociation: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/associationAssetAlarms`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    /*** ALARMS CONFIGURATION */

    addConfigurationAlarms: async (alarm) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/configurationAlarm`, {
                    ...alarm
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getConfigurationAlarms: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const { page = 1, pageSize = 500, text = undefined, enabled = -1 } = options;

                const url = baseUrl + `/configurationAlarms?${text ? '&name=%' + text.trim() + '%' : ''}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getConfigurationAlarm: async (id) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const response = await axios.get(
                    baseUrl + `/configurationAlarm/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteConfigurationAlarm: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/configurationAlarm/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteMultipleConfigurationAlarms: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/configurationAlarms`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },
    
    editConfigurationAlarm: async (alarm) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const response = await axios.patch(
                    baseUrl + `/configurationAlarm/${alarm.id}`, {
                    ...alarm
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    /** BITMASK */

    getBitMasksForSignal: async (id , options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const { page = 1, pageSize = 500,  enabled = -1 } = options;

                const url = baseUrl + `/deviceTypesStructures/${id}/bitmask?page=${page}&limit=${pageSize}${enabled !== -1 ? '&enabled=' + enabled : ''}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    addBitmask: async (id, bitmask) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/deviceTypesStructures/${id}/bitmask`, {
                    bitmask
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    putBitmask: async (id, bitmask) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.put(
                    baseUrl + `/deviceTypesStructures/${id}/bitmask`, {
                    bitmask
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    /** Enumeration */

    getEnumerationsForSignal: async (id , options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const { page = 1, pageSize = 500,  enabled = -1 } = options;

                const url = baseUrl + `/deviceTypesStructures/${id}/enumeration?page=${page}&limit=${pageSize}${enabled !== -1 ? '&enabled=' + enabled : ''}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    addEnumeration: async (id, enumeration) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/deviceTypesStructures/${id}/enumeration`, {
                        enumeration
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    
    putEnumeration: async (id, enumeration) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.put(
                    baseUrl + `/deviceTypesStructures/${id}/enumeration`, {
                        enumeration
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    /***CPUs */

    addCpu: async (cpu) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/dataLogger`, {
                    ...cpu
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    editCpu: async (cpu) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const response = await axios.patch(
                    baseUrl + `/dataLogger/${cpu.id}`, {
                    ...cpu
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteCpus: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/dataLogger/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getCpu: async (id) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const response = await axios.get(
                    baseUrl + `/dataLogger/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getCpus: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const { page = 1, pageSize = 500, text = undefined, enabled = -1 } = options;

                const url = baseUrl + `/dataLogger?page=${page}&limit=${pageSize}${text ? '&name=%' + text.trim() + '%' : ''}${enabled !== -1 ? '&enabled=' + enabled : ''}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    togleStatusCup: async (id, value) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            const enabled = value == 1 ? '0' : '1';

            try {

                const response = await axios.patch(
                    baseUrl + `/dataLogger/${id}`, {
                    enabled
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteMultipleDataLogger: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/dataLogger`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    updateMultipleDataLogger: async (data) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/dataLogger`, {
                    enabled: data.operation,
                    ids: data.ids
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    },
                });

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

   
    /** DEVICES INTERFACE  */




    addDeviceInterface: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.post(
                    baseUrl + `/deviceInterface`, {
                    ...data
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteDeviceInterface: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/deviceInterface/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteMultipleDevicesInterface: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/deviceInterface`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    editDeviceInterface: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/deviceInterface/${data.id}`, {
                    ...data
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },



    getDevicesInterface: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {
                const { page = 1, pageSize = 500, text = undefined } = options;

                const url = baseUrl + `/deviceInterface?page=${page}&limit=${pageSize}${text ? '&name=%' + text.trim() + '%' : ''}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getDeviceInterface: async (id) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const response = await axios.get(
                    baseUrl + `/deviceInterface/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    addAssociationInterfaceDevice: async (id, data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/device/${id}/interface`, {
                    ...data
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getInterfaceForDevice: async (id) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.get(
                    baseUrl + `/device/${id}/interface`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token.token
                        }
                    }
                );

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    /** DEVICE  */


    addDevice: async (device) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {
                const response = await axios.post(
                    url + `/device`, {
                    ...device
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteDevice: async (id) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.delete(
                    baseUrl + `/device/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                // if (response.data) {
                //     return response.data.data;
                // }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getDevices: async (options = {}) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {


                const { page = 1, pageSize = 500, text = undefined, enabled = -1, deviceTypeId = undefined, dataLoggerId = undefined, interfaceId = undefined } = options;

                const response = await axios.get(
                    baseUrl + `/device?page=${page}&limit=${pageSize}${text ? '&name=%' + text.trim() + '%' : ''}${enabled !== -1 ? '&enabled=' + enabled : ''}${deviceTypeId ? '&deviceTypeId=' + deviceTypeId : ''}${dataLoggerId ? '&dataLoggerId=' + dataLoggerId : ''}${interfaceId ? '&interfaceId=' + interfaceId : ''}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });
                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {

                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getDevice: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    baseUrl + `/device/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getDeviceStruttures: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);

            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    baseUrl + `/device/${id}/structures`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

               
                if (response.data) {
                    return response.data.structures;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },



    togleStatusDevice: async (id, value) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            const enabled = value == 1 ? '0' : '1';

            try {

                const response = await axios.patch(
                    baseUrl + `/device/${id}`, {
                    enabled
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response.data;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    updateMultipleDevice: async (data) => {
        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }



            try {

                const response = await axios.patch(
                    baseUrl + `/device`, {
                    enabled: data.operation,
                    ids: data.ids
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    },
                });

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    editDevice: async (device) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.patch(
                    baseUrl + `/device/${device.id}`, {
                    ...device
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    /** DEVICE TYPES */

    addDeviceType: async (deviceType) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.post(
                    url + `/deviceTypes`, {
                    ...deviceType
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteDeviceType: async (id) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.delete(
                    baseUrl + `/deviceTypes/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                // if (response.data) {
                //     return response.data.data;
                // }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getDevicesType: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const { page = 1, pageSize = 500, text = undefined } = options;

                const response = await axios.get(
                    baseUrl + `/deviceTypes?page=${page}&limit=${pageSize}${text ? '&model=%' + text.trim() + '%' : ''}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getDeviceType: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    baseUrl + `/deviceTypes/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteMultipleDeviceTypes: async (data) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.delete(
                    baseUrl + `/deviceTypes`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteMultipleDevice: async (data) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.delete(
                    baseUrl + `/device`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    editDeviceType: async (deviceType) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/deviceTypes/${deviceType.id}`, {
                    ...deviceType
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    /** DEVICE MODBUS */


    addDeviceModbus: async (deviceModbus) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    url + `/deviceModbus`, {
                    ...deviceModbus
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }


    },

    deleteDeviceModbus: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/deviceModbus/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });



            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteMultipleDeviceModbus: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/deviceModbus`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    editDeviceModbus: async (deviceModbus) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/deviceModbus/${deviceModbus.id}`, {
                    ...deviceModbus
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getDevicesModbus: async (options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const { page = 1, pageSize = 500, enable = 1, text = undefined } = options;

                const response = await axios.get(
                    baseUrl + `/deviceModbus?page=${page}&pageSize=${pageSize}&enable=${enable}${text ? '&name=%' + text.trim() + '%' : ''}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getDeviceModbus: async (id) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.get(
                    url + `/deviceModbus/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    /** LOGIN  */

    oauth: async (credentials) => {

        try {

            const response = await axios.post(
                url + `/oauth/accessToken`, {
                ...credentials
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + token.token
                }
            });

            if (response?.data) {
                const { token, iat, exp, user } = response.data;
                const obj = {
                    token: token,
                    iat: iat,
                    exp: exp
                }

                sessionStorage.clear();
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('token', JSON.stringify(obj));
                return token;
            }


        } catch (error) {

            // return window.location.assign(config.GEKO_URL);

            throw error;
        }
    },


    refreshTokens: async () => {

        try {

            const response = await axios.post(
                url + '/oauth/accessToken/refresh',
                {
                    refresh_token: token.token
                }, {

                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + token.token

                }
            }
            );

            if (response.data) {
                const token = response.data;
                sessionStorage.setItem('token', JSON.stringify(token));

                return token;
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    },


    /** USERS */

    addUser: async (user) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.post(
                    url + `/user`, {
                    ...user
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getUsers: async (options = {}) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const { page = 1, pageSize = 500, enable = 1, text = undefined } = options;

                const response = await axios.get(
                    url + `/user?page=${page}&pageSize=${pageSize}&enable=${enable}${text ? '&email=%' + text.trim() + '%' : ''}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getUser: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    url + `/user/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteUser: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    url + `/user/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    setUserPassword: async (id, data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/user/${id}/password`, {
                    ...data
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }

    },

    editUser: async (user) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/user/${user.id}`, {
                    ...user
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },



    /** SETTINGS */

    getSetting: async (group) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    url + `/settings/?group=${group}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    editSetting: async (setting) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/settings/group`, {
                    ...setting
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    resetSetting: async (group, key, setting) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    baseUrl + `/settings/${group}/${key}`, {
                    ...setting
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    postReconfigure: async (structures) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.post(
                    url + `/system/reconfigure`, {
                    ...structures
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token

                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    getSettingWithKey: async (group, key) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    url + `/settings/?group=${group}&key=${key}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getSettingWithGroupAndKey: async (group, key) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    url + `/settings/${group}/${key}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },
    /** STRUCTURES */


    addStructuresForId: async (structures) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.post(
                    url + `/deviceTypes/${structures.deviceTypeId}/structures`, {
                    ...structures
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token

                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getStructuresForIds: async (id, options = {}) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const { text = undefined, signal_type = undefined } = options;


                const response = await axios.get(
                    url + `/deviceTypes/${id}/structures${text ? `?name=${encodeURIComponent('%' + text.trim() + '%')}` : ''}${signal_type ? `?signal_type=${encodeURIComponent('%' + signal_type.trim() + '%')}` : ''}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token

                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getStructuresForId: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.get(
                    url + `/deviceTypesStructures/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token

                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    deleteMultipleStructures: async (data) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    baseUrl + `/deviceTypesStructures`, {
                    data: {
                        ids: data
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    deleteStructures: async (id) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.delete(
                    url + `/deviceTypesStructures/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    editStructures: async (structures) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.patch(
                    url + `/deviceTypesStructures/${structures.id}`, {
                    ...structures
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                return response;

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },



    /** HISTORICAL DATA */

    getDeviceForHistoricalData: async (options) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            const { pageNumber, pageSize, idDevices, startTime, endTime } = options;


            try {

                const response = await axios.get(
                    url + `/store/message/${idDevices ? + idDevices : ''}?${startTime ? 'startTime=' + startTime : ''}${endTime ? '&endTime=' + endTime : ''}${pageSize ? '&pageSize=' + pageSize : ''}${pageNumber ? '&pageNumber=' + pageNumber : ''}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token

                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },




    /** EXPORT */


    getExport: async (options = {}) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const { contentType } = options;


                const url = baseUrl + `/backup/export?contentType=${contentType}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }, responseType: 'blob'
                });

                if (response.data) {
                    return response.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    getDownloadHistoricalData: async () => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {



                const url = baseUrl + `/backup/downloadHistoricalData`

                const response = await apiClient.get(
                    url, {
                    timeout: 60000, // Timeout di 60 secondi (60.000 millisecondi)
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }, responseType: 'arraybuffer'
                });

                if (response.data) {
                    return response
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },



    getExportTable: async (options = {}) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const { contentType, table } = options;
                console.log("Dati da inviare");
                console.log(contentType, table);


                const url = baseUrl + `/export/table?contentType=${contentType}&table=${table}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }, responseType: 'blob'
                });

                if (response.data) {
                    return response.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },



    postExport: async (file) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const formData = new FormData();
                formData.append("file", file.selectedFile);
                formData.append("type", file.type);

                const response = await axios.post(
                    baseUrl + `/backup/import`,
                    formData
                    , {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + token.token
                        }
                    });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    postExportHistoricalData: async (options = {}) => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const url = baseUrl + `/backup/exportHistoricalData`
                const response = await axios.post(
                    url, {
                    ...options
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });


                if (response.data) {
                    return response.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    /** HISTORICAL_DOWNLOAD */


    getHistoricalDownload: async () => {


        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {


                const response = await axios.get(
                    url + `/historical_download`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },

    

    postHistoricalDownload: async (historical_download) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }


            try {

                const response = await axios.post(
                    url + `/historical_download`, {
                    ...historical_download
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token

                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },


    
    getDownload: async (id) => {
        if (token) {
            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();
    
            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }
    
            try {
                const url = baseUrl + `/historical_download/${id}`;
    
                const response = await apiClient.get(url, {
                    timeout: 60000, // Timeout di 60 secondi (60.000 millisecondi)
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token,
                    },
                    responseType: 'arraybuffer',
                });
    
                if (response.data) {
                    return response;
                }
            } catch (error) {
                if (error.response) {
                    // Gestione di errori con risposta dal server
                    const { status, data } = error.response;

                    console.log("Status", data);
                    
    
                    if (status === 404) {
                        throw new Error(data.message); // Lancia un errore con il messaggio del server
                    } else if (status === 401) {
                        sessionStorage.clear();
                        return window.location.assign(config.GEKO_URL);
                    } else {
                        console.error(`Errore dal server: ${data.message || error.message}`);
                        throw new Error(data.message || 'Errore sconosciuto dal server');
                    }
                } else {
                    // Gestione di errori di rete o altri problemi
                    // console.error(`Errore di rete: ${error.message}`);
                    throw new Error('Errore di rete o timeout');
                }
            }
        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    },
    



    applayRestore : async (idBackup) => {

        if (token) {

            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();

            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }

            try {

                const response = await axios.post(
                    baseUrl + `/restore`, {
                        idBackup
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response?.data) {
                    return response.data;
                }


            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }


        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }

    },


    getRestore : async (options = {}) => {

        if (token) {
            const { exp } = token;
            const dateToCheck = new Date(exp * 1000) - new Date();
    
            if (dateToCheck < 0) {
                sessionStorage.clear();
                return window.location.assign(config.GEKO_URL);
            } else if (dateToCheck < minuteThreshold) {
                await ServerProxy.refreshTokens();
            }
    
            try {

                const { page = 1, pageSize = 500, dataloggerId = undefined, enabled = -1 } = options;
                
                const url = baseUrl + `/restore?fields=id,dataloggerId,userId,createdAt&page=${page}&limit=${pageSize}${dataloggerId ? '&dataloggerId=%' + dataloggerId.trim() + '%' : ''}`

                const response = await apiClient.get(
                    url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.token
                    }
                });

                if (response.data) {
                    return response.data.data;
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.clear();
                    return window.location.assign(config.GEKO_URL);
                } else {
                    // Rilancia altri errori per ulteriore gestione
                    console.error(error);
                    throw error;
                }
            }

        } else {
            sessionStorage.clear();
            return window.location.assign(config.GEKO_URL);
        }
    }
}


export default ServerProxy;