// mqttReconnectHandler.js

import TokenBucket from './tokenBucket.js';

export default class MQTTReconnectHandler {
    #mqttClient;
    #storedMessages;
    #cache;
    #tokenBucket;
    #isResending;

    constructor(mqttClient, storedMessages, cache, capacity = 10, fillRate = 2) {
        this.#mqttClient = mqttClient;
        this.#storedMessages = storedMessages;
        this.#cache = cache;
        this.#tokenBucket = new TokenBucket(capacity, fillRate);
        this.#isResending = false;
    }

    async startResending() {
        if (this.#isResending) return;
        this.#isResending = true;

        try {
            await this.#processMessages();
        } finally {
            this.#isResending = false;
        }
    }

    async #processMessages() {
        while (this.#storedMessages.length > 0) {
            if (this.#tokenBucket.tryConsume()) {
                await this.#sendNextMessage();
            } else {
                await this.#wait(100);  // Attendi 100ms
            }
        }
    }

    async #sendNextMessage() {
        const signalData = this.#storedMessages.shift();

        //console.log( message );
        const topic = this.#cache.settings.mqtt.topic + '/' + signalData.deviceId;

        const message = JSON.stringify({
            deviceId : signalData.deviceId,
            timestamp : signalData.timestamp,
            ...signalData.data
        })

        const options = {   
            qos: this.#cache.settings.mqtt.qos, 
            retain : this.#cache.settings.mqtt.retain,
            dup : this.#cache.settings.mqtt.dup
        }

        
        try {
            await this.#mqttClient.publish(topic, message, options);
            console.log(`Messaggio reinviato: ${topic}`);
        } catch (error) {
            console.error(`Errore nel reinvio del messaggio:`, error);
            this.#storedMessages.unshift(message);  // Rimetti il messaggio in coda
        }
    }

    #wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    get pendingMessages() {
        return this.#storedMessages.length;
    }
}
