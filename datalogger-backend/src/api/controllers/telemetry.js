
import redisCache from '../../core/redisCache.js';

import store from '../../core/mongoStore.js';


export default {

    async getLast(req, res) {

        const { deviceId } = req.query;

        try {

           
            const m = await redisCache.get(`realtime.${deviceId}`);

            if ( m ){   
                return res.status(200).json( JSON.parse(m) );    
            }
            
            const telemetry = await store.getLastTelemetry(deviceId);

            if ( telemetry ){
                delete telemetry._id;
                return res.status(200).json(telemetry);
            }

            return res.status(400).send();

        }
        catch (error) {

            console.error(error);
            res.status(500).send();
        }
        
    }
}