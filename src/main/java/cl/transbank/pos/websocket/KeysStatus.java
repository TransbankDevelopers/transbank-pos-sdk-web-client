package cl.transbank.pos.websocket;

public class KeysStatus {
    private int functionCode;
    private int responseCode;
    private long commerceCode;
    private String terminalId;
    private String message;

    @Override
    public String toString() {
        return "KeysStatus{" +
                "functionCode=" + functionCode +
                ", responseCode=" + responseCode +
                ", commerceCode=" + commerceCode +
                ", terminalId='" + terminalId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(int functionCode) {
        this.functionCode = functionCode;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(int responseCode) {
        this.responseCode = responseCode;
    }

    public long getCommerceCode() {
        return commerceCode;
    }

    public void setCommerceCode(long commerceCode) {
        this.commerceCode = commerceCode;
    }

    public String getTerminalId() {
        return terminalId;
    }

    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }

    public KeysStatus() {
    }
}
