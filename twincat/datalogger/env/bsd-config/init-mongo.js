// init-mongo.js
db = db.getSiblingDB('geko5');

// Crea collection
db.createCollection('signals');

// Crea indice
db.signals.createIndex({ 
  "timestamp": 1,
  "deviceId": 1
});