const config = {
    server : {

        protocol : process.env.NODE_ENV !== 'production' ? 'http:' : window.location.protocol,
        host: process.env.NODE_ENV !== 'production' ? '192.168.21.34' : window.location.hostname,
        port: process.env.NODE_ENV !== 'production' ? '5000' : '443',
        prefix : '/api',
        
        // return process.env.REACT_APP_API_BASE_URL || 
        // `${window.location.protocol}//${window.location.hostname}:3000/api` ||
        // 'http://192.168.1.1/api';
    },

    pagination : {
        limit : 500,
        pageSize : 25
    },


    GEKO_URL : '/',
    heightBanner : 150 
  
};

export default config;