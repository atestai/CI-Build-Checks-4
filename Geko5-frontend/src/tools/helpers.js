
const colors = [
    'rgba(255, 0, 0, 1)',       // Rosso
    'rgba(0, 255, 0, 1)',       // Verde
    'rgba(0, 0, 255, 1)',       // Blu
    'rgba(255, 255, 0, 1)',     // Giallo
    'rgba(255, 165, 0, 1)',     // Arancione
    'rgba(128, 0, 128, 1)',     // Viola
    'rgba(0, 255, 255, 1)',     // Ciano
    'rgba(255, 20, 147, 1)',    // Rosa scuro
    'rgba(75, 0, 130, 1)',      // Indaco
    'rgba(139, 69, 19, 1)',     // Marrone
    'rgba(0, 100, 0, 1)',       // Verde scuro
    'rgba(255, 105, 180, 1)',   // Rosa acceso
    'rgba(255, 69, 0, 1)',      // Rosso arancio
    'rgba(0, 191, 255, 1)',     // Azzurro profondo
    'rgba(123, 104, 238, 1)',   // Blu medio
    'rgba(34, 139, 34, 1)',     // Verde Foresta
    'rgba(128, 128, 0, 1)',     // Oliva
    'rgba(47, 79, 79, 1)',      // Verde scuro/Grigio
];

export const getFormattedTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mese (1-12)
    const day = String(now.getDate()).padStart(2, '0'); // Giorno (1-31)
    const hours = String(now.getHours()).padStart(2, '0'); // Ore (0-23)
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minuti (0-59)
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Secondi (0-59)

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};



export const convertTimestamp = (epochMs) => {
    const date = new Date(epochMs);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mesi vanno da 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
}


export const getRandomUniqueColor = (usedColors) => {
    const availableColors = colors.filter(color => !usedColors.includes(color));
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
}



export const  generateYAxes = (datasets)  => {
    const axesMap = {};
    const yAxes = [];
    let axisIndex = 1;

    datasets.forEach((dataset) => {
        const unit = dataset.measureUnit;
        if (!axesMap[unit]) {
            const axisId = `y${axisIndex}`;
            axesMap[unit] = axisId;

            yAxes.push({
                id: axisId,
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: unit,
                    font: {
                        size: 14
                    }
                },
                grid: {
                    drawOnChartArea: axisIndex === 1 // Mostra la griglia solo per il primo asse
                },
                offset: true
            });

            axisIndex++;
        }

        dataset.yAxisID = axesMap[unit];
    });

    return yAxes;
}



export const camelCaseToReadable = (str) => {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (match) => match.toUpperCase())
        .trim();
};


export const getFileNameOrExtension = (fileName, funzionalita) => {
    const [name, extension] = fileName.split('.');
    return funzionalita ? name : extension;
};



export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
