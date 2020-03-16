package cl.transbank.pos.websocket;

public class SaleParams {
    private String amount, ticket;

    @Override
    public String toString() {
        return "SaleParams{" +
                "amount='" + amount + '\'' +
                ", ticket='" + ticket + '\'' +
                '}';
    }

    public SaleParams() {
    }

    public SaleParams(String amount, String ticket) {
        this.amount = amount;
        this.ticket = ticket;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }
}
