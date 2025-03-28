//import store from "../../core/redisStore.js";
import store from '../../core/mongoStore.js';



class MessageController {

    async getPendingMessage(req, res) {

        // const { limit = undefined } = req.query;

        // try {
        //     const data = await store.getPendingMessages(limit);

        //     res.status(200).json({
        //         meta: {
        //             count: data?.length ?? 0,
        //         },
        //         data,
        //     });
        // } catch (error) {
        //     console.log(error);
        //     res.status(500).send();
        // }
    }


    async getCountMessages(req, res) {

        const {
            devicesIds = undefined,
            startTime = undefined,
            endTime = undefined
        } = req.query;

        try {
            
            const where = { devicesIds, startTime, endTime};
            
            const result = await store.getCountMessages(where);

            if(!result) return res.status(204).send();


            res.status(200).json(result);

        } catch (error) {

            console.log(error);
            
            res.status(500).send();
        }
    }

    
    async getMessage(req, res) {
        
        const {
            devicesIds = undefined,
            startTime = undefined,
            endTime = undefined,
            status = undefined,
            pageSize = 100,
            pageNumber = 1,
            reverse = 1,
        } = req.query;

        try {
            const where = { devicesIds, startTime, endTime, type: status, pageSize, pageNumber, reverse };
            
            const result = await store.getMessages(where);

            if(!result) return res.status(204).send();

            const { messages,
                items,
                totalItems,
                totalPages } = result;


            res.status(200).json({
                meta: { 
                    items,
                    totalItems, 
                    pageSize, 
                    pageNumber, 
                    totalPages, 
                    where 
                },
                data: messages,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }



    async getMessageByDevice(req, res) {

        const { deviceId = undefined } = req.params;
        
        const { startTime, endTime, status, pageSize = 100, pageNumber = 1 } = req.query;

        try {
            const where = { devicesIds: [deviceId], startTime, endTime, type: status, pageSize, pageNumber };
           
            const { messages, startIndex, 
                endIndex,
                total,
                totalCount,
                totalPages } = await store.getMessages(where);


            
            console.log({ 
                startIndex, 
                endIndex,
                total,
                totalCount,
                totalPages
            });
            

            
            res.status(200).json({
                meta: { 
                    total,
                    totalCount,
                    pageSize, 
                    pageNumber, 
                    totalPages, 
                    where },
                data: messages,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    async clearDb(req, res) {
        await store.clearDb();
        res.status(204).send();
    }

    async getSize(req, res) {


        try {
            const currentSize = await store.getDBSize();

            
            res.status(200).json({
                currentSize: {
                    GB: currentSize / Math.pow(1024, 3),
                    MB: currentSize / Math.pow(1024, 2),
                    KB: currentSize / 1024,
                    B: currentSize,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default new MessageController();