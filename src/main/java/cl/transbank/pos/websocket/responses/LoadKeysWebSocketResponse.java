package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.responses.KeysResponse;
import cl.transbank.pos.websocket.WebSocketResponse;

public class LoadKeysWebSocketResponse extends WebSocketResponse {
   private KeysResponse response;

    public KeysResponse getResponse() {
        return response;
    }

    public void setResponse(KeysResponse response) {
        this.response = response;
    }
}
