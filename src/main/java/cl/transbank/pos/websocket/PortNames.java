package cl.transbank.pos.websocket;

import java.util.List;

public class PortNames {
    private List<String> ports;

    public PortNames(List<String> portnames) {
        ports = portnames;
    }

    public List<String> getPorts() {
        return ports;
    }

    public void setPorts(List<String> ports) {
        this.ports = ports;
    }
}
