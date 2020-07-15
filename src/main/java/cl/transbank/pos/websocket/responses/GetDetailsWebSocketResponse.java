package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.responses.DetailResponse;
import cl.transbank.pos.websocket.WebSocketResponse;

import java.util.List;

public class GetDetailsWebSocketResponse extends WebSocketResponse {
    private List<DetailResponse> details;

    public List<DetailResponse> getDetails() {
        return details;
    }

    public void setDetails(List<DetailResponse> details) {
        this.details = details;
    }
}
