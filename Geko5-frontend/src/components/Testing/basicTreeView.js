import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { CircularProgress, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import ServerProxy from '../../tools/serverProxy';

export default function BasicTreeView(props) {

    const {setCurrentDevice} = props; 
    const [data, setData] = useState(null);

    const [expandedItems, setExpandedItems] = useState([]);
    const [defaultSelectedItems, setDefaultSelectedItems] = useState([]); 


    const handleExpandedItemsChange = (event, itemIds) => {
        setExpandedItems(itemIds);
    };

    useEffect( () => {

        const loadData = async () => {

            try {
                const devices = await ServerProxy.getDevices();
                
                //console.log( devices );

                const model = {}

                let defaultSelectedItems = null;

                devices.forEach(device => {

                    const k = device.deviceType.model;


                    if (model[k]){
                        model[k].push(device)
                    }
                    else{
                        model[k]= [device]
                    }

                    if (!defaultSelectedItems){
                        defaultSelectedItems = device;   
                    }
                });


                //console.log( model);

                if (Object.keys(model).length > 0 ){
                    setData(model);

                    const k = Object.keys(model)[0];
                    setExpandedItems([`__${k}`])
                    
                    setCurrentDevice( defaultSelectedItems );
                    setDefaultSelectedItems( [`tree-item-${defaultSelectedItems.id}`] )
                }
                
                

                // if (devices.length){
                //     setCurrentDevice( devices[0] )
                // }

            } catch (error) {
                console.error(error);
                setData(null);
            }
        } 

        loadData();

    }, [])



    return (

        <Box sx={{ minHeight: 352, minWidth: '100%' }}>
            <Paper elevation={1} >
                {data ? (

                    <SimpleTreeView 
                        expandedItems={expandedItems}
                        onExpandedItemsChange={handleExpandedItemsChange}

                        defaultSelectedItems={defaultSelectedItems}
                        >

                        { Object.keys(data).map( (item, index) => (

                            <TreeItem key={index} itemId={`__${item}`} label={item}>

                                { data[item].map( (device, indexDevice) => (
                                    <TreeItem key={indexDevice} itemId={`tree-item-${device.id}`} label={device.name} onClick={() => setCurrentDevice( device ) } />
                                ))}

                            </TreeItem>
                        ) ) }

                    
                    </SimpleTreeView>

                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', p: 5 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Paper>
        </Box>
        

    );
}
