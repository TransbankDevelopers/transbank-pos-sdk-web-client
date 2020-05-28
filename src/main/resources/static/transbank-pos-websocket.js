// import Stomp from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// export default 
class TransbankPOSWebSocket {
    constructor () {
        this.socket = new SockJS('localhost:8080/tbk-sdk-java-websocket')
        this.stompClient = Stomp.over(this.socket);
        this.timeToRetry = 250;
        this.timeout = 45000;
        this.channels = [
            "listPorts",
            "openPort",
            "closePort",
            "doSale",
            "getKeys",
            "getLastSale",
        ]
        this.subscribe();
    }

    subscribe () {
        let that = this;
        this.stompClient.connect({}, function (frame) {
            console.log("WebSocket conectado: " + frame);
            that.channels.forEach((channel, index) => {
                console.log("Suscribiendo a " + channel + "!");
                that.stompClient.subscribe('/topic/' + channel, function (result) {
                    that.response = {
                        "status": JSON.parse(result.body).success,
                        "response": JSON.parse(result.body),
                        "body": result.body,
                    };
                    result.ack();
                }, {ack: 'client'});
            });
        })
    }

    validChannel (channel) {
        if ( this.channels.indexOf(channel) === -1 ){
            return false;
        }
        return true;
    }

    validParamsInChannel (channel, params='') {
        $.blockUI();
        console.log("WebSocket mensaje para " + channel);
        let errorMSG = null;
        if ( ! this.validChannel(channel) ) {
            errorMSG = "Canal Invalido";
        }
        if ( channel === 'openPort') {
            if ( params['portname'] == undefined ){
                errorMSG = "Debe indicar el puerto del POS.";
            }
        } else if ( channel === 'doSale' ) {
            if ( params['amount'] == undefined || params['ticket'] == undefined ) {
                errorMSG = "Debe indicar el monto y el ticket";
            }
        }

        if ( errorMSG !== null ) {
            $.unblockUI();
            console.log(errorMSG);
            throw new Error(errorMSG);
        }
        return true;
    }

    disconnect () {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        console.log("WebSocket desconectado");
        this.isConnected = false;
    }

    wait (time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    async waitingResponse (channel, params='', dict={}) {
        this.response = null;
        let runtime = 0;
        let timeToRetry = this.timeToRetry;
        let timeout = this.timeout;
        let tx = this.stompClient.begin();
        try {
            this.stompClient.send("/app/" + channel, {transaction: tx.id}, params);
            while (this.response === null) {
                await this.wait(timeToRetry);
                runtime += timeToRetry;
                if (runtime > timeout) {
                    throw new Error("Error: Timeout en respuesta de websocket.");
                }
            }
            tx.commit();
            return this.response;
        } catch (error) {
            tx.abort();
            throw new Error("Error: " + error.message);
        } finally {
            $.unblockUI();
        }
    }

    send (channel, params='', dict={}) {
        $.blockUI();
        if (! this.validParamsInChannel(channel, params)) {
            throw new Error("Error: Los parametros no son validos para este canal." + channel);
        }
        params = JSON.stringify(params);
        return this.waitingResponse(channel, params=params, dict=dict);
    }

    async getPorts () {
        await this.send('listPorts');
        return this.response.response.ports;
    }

    async openPort (portName) {
        portName = {'portname': portName.data};
        await this.send('openPort', portName);
        return this.response.status;
    }

    async closePort () {
        await this.send('closePort');
        return this.response.status;
    }

    async getKeys () {
        await this.send('getKeys');
        return this.response.body;
    }

    async getLastSale () {
        await this.send('getLastSale');
        return this.response.body;
    }

    async doSale (amount, ticket) {
        let params = {'amount': amount, 'ticket': ticket};
        await this.send('doSale', params);
        return this.response.body;
    }
}

const POS = new TransbankPOSWebSocket();


// import POS from 'transbank-pos-websocket';

