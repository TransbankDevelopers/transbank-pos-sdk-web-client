package cl.transbank.pos.websocket;

public class OpenPortParam {
    private String portname;

    public OpenPortParam() {
    }

    public OpenPortParam(String portname) {
        this.portname = portname;
    }

    public String getPortname() {
        return portname;
    }

    public void setPortname(String portname) {
        this.portname = portname;
    }

    @Override
    public String toString() {
        return "OpenPortParam{" +
                "portname='" + portname + '\'' +
                '}';
    }
}
