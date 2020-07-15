package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.responses.SaleResponse;
import cl.transbank.pos.websocket.WebSocketResponse;

public class SaleWebSocketResponse extends WebSocketResponse {
    private SaleResponse sale;

    public SaleResponse getSale() {
        return sale;
    }

    public void setSale(SaleResponse sale) {
        this.sale = sale;
    }
}
