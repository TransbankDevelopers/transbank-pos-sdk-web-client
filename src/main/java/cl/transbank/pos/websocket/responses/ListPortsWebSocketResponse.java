package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.websocket.WebSocketResponse;

import java.util.List;

public class ListPortsWebSocketResponse extends WebSocketResponse {
    private List<String> ports;

    public List<String> getPorts() {
        return ports;
    }

    public void setPorts(List<String> ports) {
        this.ports = ports;
    }
}
