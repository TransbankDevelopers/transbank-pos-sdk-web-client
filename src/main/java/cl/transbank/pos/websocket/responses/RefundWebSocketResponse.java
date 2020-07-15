package cl.transbank.pos.websocket.responses;

import cl.transbank.pos.responses.RefundResponse;
import cl.transbank.pos.websocket.WebSocketResponse;

public class RefundWebSocketResponse extends WebSocketResponse {
    private RefundResponse refund;

    public RefundResponse getRefund() {
        return refund;
    }

    public void setRefund(RefundResponse refund) {
        this.refund = refund;
    }
}

