import os from 'os';
import dns from 'dns';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

const exec = promisify(execCallback);
const dnsLookup = promisify(dns.lookup);

const getSystemInfo = async () => {
  const uptime = os.uptime();
  const currentDate = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const networkInterfaces = os.networkInterfaces();
  const activeInterfaces = getActiveInterfaces(networkInterfaces);

  try {
    await dnsLookup('google.com');
    const internetStatus = 'Online';
    const defaultGateway = await getDefaultGateway();
    const linkStatuses = await checkNetworkLinkStatuses(activeInterfaces);

    

    
    return displayInfo(uptime, currentDate, timeZone, internetStatus, activeInterfaces, defaultGateway, linkStatuses);


  } catch (error) {
    console.error('Errore durante il recupero delle informazioni:', error);
  }
};

const getActiveInterfaces = (networkInterfaces) => {
  const activeInterfaces = [];
  for (const [name, interfaces] of Object.entries(networkInterfaces)) {

    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        activeInterfaces.push({ name, address: iface.address });
      }
    }
  }
  return activeInterfaces;
};

const getDefaultGateway = async () => {
  
  // const command = process.platform !== 'win32'
  //   ? 'ip route | grep default'
  //   : 'ipconfig | findstr /i "Default Gateway"';

  let command = 'ip route | grep default';

  //console.log( process.platform, command );

  switch (process.platform) {

    case 'win32':

      command = 'ipconfig | findstr /i "Default Gateway"'
      break;

    case 'freebsd':
      command = 'route -n get default'
      break;

    case 'linux':
      command = 'ip route | grep default'
      break;

    default:
      break;
  }


  //return 'Non disponibile';

  try {
    const { stdout } = await exec(command);

    return process.platform !== 'win32'
      ? stdout.split(' ')[2]
      : stdout.split(':')[1].trim();
  } catch (error) {
    console.error('Errore nel recupero del gateway predefinito:', error);
    return 'Non disponibile';
  }
};

const checkNetworkLinkStatuses = async (activeInterfaces) => {
  const statuses = {};
  for (const iface of activeInterfaces) {
    statuses[iface.name] = await checkNetworkLinkStatus(iface.name);
  }
  return statuses;
};

const checkNetworkLinkStatus = async (interfaceName) => {
  let command;
  switch (process.platform) {
    case 'linux':
      command = `cat /sys/class/net/${interfaceName}/operstate`;
      break;
    case 'darwin': // macOS
      command = `ifconfig ${interfaceName} | grep 'status:'`;
      break;
    case 'win32':
      command = `wmic nic where "NetConnectionID='${interfaceName}'" get NetConnectionStatus`;
      break;
    default:
      return 'Sistema operativo non supportato';
  }

  try {
    const { stdout } = await exec(command);
    if (process.platform === 'win32') {
      return stdout.includes('2') ? 'Attivo' : 'Non attivo';
    } else {
      return stdout.toLowerCase().includes('up') || stdout.toLowerCase().includes('active')
        ? 'Attivo'
        : 'Non attivo';
    }
  } catch (error) {
    console.error(`Errore nel controllo dello stato del link di rete per ${interfaceName}:`, error);
    return 'Stato non determinabile';
  }
};

const displayInfo = (uptime, currentDate, timeZone, internetStatus, activeInterfaces, defaultGateway, linkStatuses) => {

    const data = {
        uptime, 
        currentDate, 
        timeZone, 
        internetStatus, 
        activeInterfaces, 
        defaultGateway, 
        linkStatuses
    };
    
    return data;
}    

export default {
    getSystemInfo
}