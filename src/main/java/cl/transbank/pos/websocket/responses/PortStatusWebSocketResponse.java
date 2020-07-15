package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.websocket.WebSocketResponse;

public class PortStatusWebSocketResponse extends WebSocketResponse {
    private String activePort;

    public String getActivePort() {
        return activePort;
    }

    public void setActivePort(String activePort) {
        this.activePort = activePort;
    }
}
