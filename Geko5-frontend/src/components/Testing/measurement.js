import { useEffect, useState } from "react"
import mqtt from "mqtt"; // import connect from mqtt


//const host = 'ws://192.168.21.14:8080/api/ws'
const host = 'wss://demo.thingsboard.io/api/ws'
const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZW5hbnRAd2lzbmFtLmNvbSIsInVzZXJJZCI6IjdlNzhjNWYwLTExMWUtMTFlZi1iZmU3LTNkMTNlM2U2NzE3NiIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwic2Vzc2lvbklkIjoiODVkMGMyMGQtMzQwNS00ODQwLTlmMTAtYjg0ZDUzODNmYzM2IiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE3MTkzMjY0MDAsImV4cCI6MTcxOTMzNTQwMCwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjdkZGNhZDAwLTExMWUtMTFlZi1iZmU3LTNkMTNlM2U2NzE3NiIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAifQ.BMFKuEtfOBFHCao3VApNhgJWzJjtmxyJjWlUKgX_qhbSP8pEt8dWgyW8ydKoSoPQIXesv7FSzVEjWP24CK_W5A"
const entityId = ''

export default function Measurement() {

    const [out, setOut] = useState('');

    useEffect( () =>{

        async function load(){

            console.log("Load");
            const webSocket = new WebSocket(host);

            webSocket.onopen = function () {
                var object = {
                    authCmd: {
                        cmdId: 0,
                        token
                    },
                    cmds: [
                        {
                            entityType: "DEVICE",
                            entityId,
                            scope: "LATEST_TELEMETRY",
                            cmdId: 10,
                            type: "TIMESERIES"
                        }
                    ]
                };
                var data = JSON.stringify(object);
                webSocket.send(data);
                console.log("Message is sent: " + data);
            };

            webSocket.onmessage = function (event) {
                var received_msg = event.data;
                alert("Message is received: " + received_msg);
            };

            webSocket.onclose = function (event) {
                alert("Connection is closed!");
            };


            console.log(webSocket);
        }
        
        load();

    }, []);

    return (
        <>{out}</>
    )
}