const validateDate = d => !isNaN(Date.parse(d));

const validateEmail = email => String(email)
    .toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const validateJson = str => {
    if (!validateString(str)) return false;
    try {
        const parsed = JSON.parse(str);
        return validateObject(parsed);
    } catch (e) {
        return false;
    }
};

const validateTimestamp = (timestamp) => {
    // Assicurati che sia un numero e positivo
    if (typeof timestamp !== 'number' || timestamp <= 0) {
        return false;
    }
    
    // Convertilo in millisecondi per il formato JS Date
    const date = new Date(timestamp * 1000);
    
    // Verifica se è una data valida
    return !isNaN(date.getTime());
};



const validateId = id => id && !isNaN(id);

const validateInterfaceProtocol = protocol => ['TCP','RTUOverTCP', 'RTU' ].includes(protocol);

const validateIp = ip => {
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};


const validateModbusAccess = role => ['R', 'W', 'RW'].includes(role);
const validateNumber = n => n != null && !isNaN(n);

const validateObject = obj => {
    return obj !== null && 
           typeof obj === 'object' && 
           !Array.isArray(obj) &&
           Object.keys(obj).length > 0;
};



const validateSettingGroups = role => ['ads', 'mqtt', 'saf', 'system', 'modbus'].includes(role);
const validateString = s => s && s.length > 0;

const validateSystemParameter = parameter => ['currentDate'].includes(parameter);

const validateUrl = url => String(url)
    .toLowerCase()
    .match(
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/
    );

const validateUserRole = role => ['admin', 'operator', 'supervisor'].includes(role);


export default {
    validateDate,
    validateTimestamp,
    validateEmail,
    validateJson,
    validateId,
    validateInterfaceProtocol,
    validateIp,
    validateModbusAccess,
    validateNumber,
    validateObject,
    validateSettingGroups,
    validateString,
    validateSystemParameter,
    validateUrl,
    validateUserRole,
}
