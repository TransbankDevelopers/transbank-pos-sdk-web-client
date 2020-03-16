package cl.transbank.pos.websocket;

public class PortStatus {
    private String success;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message;

    public PortStatus() {
    }

    public PortStatus(String success, String message) {
        this.success = success;
        this.message = message;
    }

    public String getSuccess() {
        return success;
    }

    public void setSuccess(String success) {
        this.success = success;
    }

    @Override
    public String toString() {
        return "PortStatus{" +
                "success='" + success + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
