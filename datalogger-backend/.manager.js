import manager from "./src/manager.js";


try {
    (await manager()).start();
} catch (error) {
    console.log(error);
    
}
