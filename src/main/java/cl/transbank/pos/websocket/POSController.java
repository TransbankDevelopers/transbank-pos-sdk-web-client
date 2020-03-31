package cl.transbank.pos.websocket;

import cl.transbank.pos.POS;
import cl.transbank.pos.exceptions.TransbankCannotOpenPortException;
import cl.transbank.pos.exceptions.TransbankInvalidPortException;
import cl.transbank.pos.exceptions.TransbankLinkException;
import cl.transbank.pos.helper.StringUtils;
import cl.transbank.pos.responses.KeysResponse;
import cl.transbank.pos.responses.SaleResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import sun.security.x509.SubjectAlternativeNameExtension;

import java.util.List;

@Controller
public class POSController {

	private static final Logger logger = LogManager.getLogger(POSController.class);

	@MessageMapping("/listPorts")
	@SendTo("/topic/listPorts")
	public PortNames listPorts() throws Exception {
		List<String> portnames = POSService.listPorts();
		logger.info("portnames: " + portnames);
		return new PortNames(portnames);
	}

	@MessageMapping("/closePort")
	@SendTo("/topic/closePort")
	public PortStatus closePort() throws Exception {
		logger.info("Closing port");
		PortStatus result = new PortStatus();
		result.setSuccess("TRUE");
		result.setMessage("");
		try {
			POSService.closePort();
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess("FALSE");
			result.setMessage(e.getMessage());
		}
		logger.info("Closing port. Return " + result);
		return result;
	}

	@MessageMapping("/getKeys")
	@SendTo("/topic/getKeys")
	public KeysStatus getKeys() throws Exception {
		KeysStatus result = new KeysStatus();
		try {
			KeysResponse keysResponse = POSService.loadKeys();
			result.setResponseCode(keysResponse.getResponseCode());
			result.setFunctionCode(keysResponse.getFunctionCode());
			result.setCommerceCode(keysResponse.getCommerceCode());
			result.setTerminalId(keysResponse.getTerminalId());
			result.setMessage(null);
		} catch (Exception e) {
			e.printStackTrace();
			result.setResponseCode(-1);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@MessageMapping("/getLastSale")
	@SendTo("/topic/getLastSale")
	public SaleStatus getLastSale() throws Exception {
		logger.info("get last sale");
		SaleStatus result = new SaleStatus();
		try {
			SaleResponse saleResponse = POSService.getLastSale();
			logger.info("get last sale " + saleResponse);
			BeanUtils.copyProperties(saleResponse, result);
			result.setMessage("");
			logger.info("get last sale: " + result);
		} catch (Exception e) {
			e.printStackTrace();
			result.setResponseCode(-1);
			result.setMessage(e.getMessage());
		}
		logger.info("retornando");
		return result;
	}

	@MessageMapping("/doSale")
	@SendTo("/topic/doSale")
	public SaleStatus doSale(SaleParams params) throws Exception {
		SaleStatus result = new SaleStatus();
		try {
			logger.info("doing sale");
			SaleResponse saleResponse = POSService.sale(StringUtils.parseInt(params.getAmount()), StringUtils.parseInt(params.getTicket()));
			logger.info("doing sale: " + saleResponse);
			BeanUtils.copyProperties(saleResponse, result);
			logger.info("doing sale: " + result);
			result.setMessage(null);
		} catch (Exception e) {
			logger.error("doing sale. exception: " + e);
			e.printStackTrace();
			result.setResponseCode(-1);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@MessageMapping("/openPort")
	@SendTo("/topic/openPort")
	public PortStatus openPort(OpenPortParam param) throws Exception {
		logger.info("param: " + param);
		PortStatus result = new PortStatus();
		result.setSuccess("TRUE");
		result.setMessage("");
		try {
			POSService.openPort(param.getPortname());
			boolean success = POSService.poll();
			if (!success) {
				result.setSuccess("FALSE");
				result.setMessage("El POS no respondió.");
			}
		} catch (TransbankInvalidPortException e) {
			e.printStackTrace();
			result.setSuccess("FALSE");
			result.setMessage(e.getMessage());
		} catch (TransbankCannotOpenPortException e) {
			e.printStackTrace();
			result.setSuccess("FALSE");
			result.setMessage(e.getMessage());
		}
		logger.info("port status: " + result);
		return result;
	}
}
