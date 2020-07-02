package cl.transbank.pos.websocket;

public class PortStatus {
    private boolean success;
    private String message;
    private String activePort;

    public PortStatus() {

    }

    public String getActivePort() {
        return activePort;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setActivePort(String activePort) {
        this.activePort = activePort;
    }

    public PortStatus(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean getSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    @Override
    public String toString() {
        return "PortStatus{" +
                "success='" + success + '\'' +
                ", message='" + message + '\'' +
                ", activePort='" + activePort + '\'' +
                '}';
    }
}
