package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.responses.SaleResponse;
import cl.transbank.pos.websocket.WebSocketResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LastSaleWebSocketResponse extends WebSocketResponse {
    private SaleResponse sale;

    public SaleResponse getSale() {
        return sale;
    }

    public void setSale(SaleResponse sale) {
        this.sale = sale;
    }
}
