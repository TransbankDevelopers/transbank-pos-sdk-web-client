package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.responses.TotalsResponse;
import cl.transbank.pos.websocket.WebSocketResponse;

public class TotalsWebSocketResponse extends WebSocketResponse {
    private TotalsResponse totals;

    public TotalsResponse getTotals() {
        return totals;
    }

    public void setTotals(TotalsResponse totals) {
        this.totals = totals;
    }
}
