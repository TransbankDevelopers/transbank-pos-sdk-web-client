package cl.transbank.pos.websocket;

import cl.transbank.pos.exceptions.*;
import cl.transbank.pos.helper.StringUtils;
import cl.transbank.pos.responses.*;
import cl.transbank.pos.websocket.params.OpenPortParam;
import cl.transbank.pos.websocket.params.SaleParams;
import cl.transbank.pos.websocket.responses.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class POSController {

    private static final Logger logger = LogManager.getLogger(POSController.class);
    private static boolean isConnected = false;
    private static String currentPort = null;


    @MessageMapping("/listPorts")
    @SendTo("/topic/listPorts")
    public ListPortsWebSocketResponse listPorts() throws Exception {
        List<String> portNames = POSService.listPorts();
        ListPortsWebSocketResponse response = new ListPortsWebSocketResponse();
        response.setPorts(portNames);
        response.setSuccess(true);
        logger.info("portnames: " + portNames);
        return response;
    }

    @MessageMapping("/closePort")
    @SendTo("/topic/closePort")
    public PortStatusWebSocketResponse closePort() throws Exception {
        logger.info("Closing port");
        PortStatusWebSocketResponse result = new PortStatusWebSocketResponse();
        result.setSuccess(true);
        result.setMessage("");

        if (!isConnected) {
            logger.info("Port is not open, so we do not need to close it");
            result.setMessage("Port was not open");
        }

        try {
            POSService.closePort();
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }
        isConnected = false;
        currentPort = null;
        logger.info("Closing port. Return " + result);
        return result;
    }

    @MessageMapping("/getPortStatus")
    @SendTo("/topic/getPortStatus")
    public PortStatusWebSocketResponse getPortStatus() throws Exception {
        PortStatusWebSocketResponse result = new PortStatusWebSocketResponse();
        result.setSuccess(isConnected);
        result.setActivePort(currentPort);
        return result;
    }

    @MessageMapping("/getKeys")
    @SendTo("/topic/getKeys")
    public LoadKeysWebSocketResponse getKeys() throws Exception {
        LoadKeysWebSocketResponse result = new LoadKeysWebSocketResponse();
        try {
            KeysResponse keysResponse = POSService.loadKeys();
            result.setSuccess(true);
            result.setResponse(keysResponse);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }
        return result;
    }

    @MessageMapping("/closeDay")
    @SendTo("/topic/closeDay")
    public CloseDayWebSocketResponse closeDay() {
        logger.info("Close Day");
        CloseDayWebSocketResponse response = new CloseDayWebSocketResponse();
        response.setSuccess(false);
        try {
            CloseResponse saleResponse = POSService.close();
            response.setMessage(saleResponse.getResponseMessage());
            response.setSuccess(true);
        } catch (TransbankPortNotConfiguredException e) {
            e.printStackTrace();
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @MessageMapping("/getDetails")
    @SendTo("/topic/getDetails")
    public GetDetailsWebSocketResponse getDetails(boolean printOnPos) {
        logger.info("Get sales of the day");
        GetDetailsWebSocketResponse response = new GetDetailsWebSocketResponse();

        try {
            List<DetailResponse> details = POSService.details(printOnPos);
            response.setDetails(details);
            response.setSuccess(true);
        } catch (TransbankPortNotConfiguredException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    @MessageMapping("/refund")
    @SendTo("/topic/refund")
    public RefundWebSocketResponse refund(int operationId) {
        logger.info("Refund");
        RefundWebSocketResponse response = new RefundWebSocketResponse();

        try {
            RefundResponse posResponse = POSService.refund(operationId);
            response.setRefund(posResponse);
            response.setSuccess(true);
        } catch (TransbankPortNotConfiguredException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            e.printStackTrace();
        }

        return response;
    }

    @MessageMapping("/getTotals")
    @SendTo("/topic/getTotals")
    public TotalsWebSocketResponse getTotals() {
        logger.info("Get totals");
        TotalsWebSocketResponse response = new TotalsWebSocketResponse();
        try {
            TotalsResponse posResponse = POSService.getTotals();
            response.setTotals(posResponse);
            response.setSuccess(true);
        } catch (TransbankPortNotConfiguredException e) {
            response.setMessage(e.getMessage());
            response.setSuccess(false);
            e.printStackTrace();
        }

        return response;
    }

    @MessageMapping("/setNormalMode")
    @SendTo("/topic/setNormalMode")
    public SetNormalModeWebSocketResponse setNormalMode() {
        logger.info("Set normal mode");
        SetNormalModeWebSocketResponse response = new SetNormalModeWebSocketResponse();
        response.setSuccess(false);
        try {
            boolean saleResponse = POSService.setNormalMode();
            response.setMessage("");
            response.setSuccess(saleResponse);
        } catch (TransbankPortNotConfiguredException e) {
            e.printStackTrace();
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @MessageMapping("/poll")
    @SendTo("/topic/poll")
    public PollWebSocketResponse poll() {
        logger.info("Poll");
        PollWebSocketResponse response = new PollWebSocketResponse();
        response.setSuccess(false);
        try {
            boolean saleResponse = POSService.setNormalMode();
            response.setMessage("");
            response.setSuccess(saleResponse);
        } catch (TransbankPortNotConfiguredException e) {
            e.printStackTrace();
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @MessageMapping("/getLastSale")
    @SendTo("/topic/getLastSale")
    public LastSaleWebSocketResponse getLastSale() throws Exception {
        logger.info("get last sale");
        LastSaleWebSocketResponse response = new LastSaleWebSocketResponse();
        try {
            SaleResponse saleResponse = POSService.getLastSale();
            response.setSale(saleResponse);
            response.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @MessageMapping("/doSale")
    @SendTo("/topic/doSale")
    public SaleWebSocketResponse doSale(SaleParams params) {
        SaleWebSocketResponse response = new SaleWebSocketResponse();
        try {
            logger.info("Doing sale");
            SaleResponse saleResponse = POSService.sale(StringUtils.parseInt(params.getAmount()), StringUtils.parseInt(params.getTicket()));
            response.setSale(saleResponse);
            response.setSuccess(true);
        } catch (Exception e) {
            logger.error("Doing sale. exception: " + e);
            e.printStackTrace();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @MessageMapping("/openPort")
    @SendTo("/topic/openPort")
    public OpenPortWebSocketResponse openPort(OpenPortParam param) throws Exception {
        logger.info("param: " + param);
        OpenPortWebSocketResponse result = new OpenPortWebSocketResponse();
        result.setSuccess(false);
        if (isConnected) {
            logger.info("Closing port before opening new one");
            closePort();
        }

        try {
            POSService.openPort(param.getPortname());
            boolean success = POSService.poll();
            if (!success) {
                result.setMessage("El POS no respondió.");
            } else {
                result.setSuccess(true);
            }
        } catch (TransbankInvalidPortException | TransbankCannotOpenPortException | TransbankUnexpectedError e) {
            e.printStackTrace();
            result.setMessage(e.getMessage());
        } //TODO: Cambiar esto, ya que se genera por el error en TBK return diferente a 0  o -1


        isConnected = result.getSuccess();
        if (isConnected) {
            currentPort = param.getPortname();
        }


        logger.info("port status: " + result);
        return result;
    }
}
