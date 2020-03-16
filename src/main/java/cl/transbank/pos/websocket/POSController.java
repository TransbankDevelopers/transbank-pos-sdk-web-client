package cl.transbank.pos.websocket;

import cl.transbank.pos.POS;
import cl.transbank.pos.exceptions.TransbankCannotOpenPortException;
import cl.transbank.pos.exceptions.TransbankInvalidPortException;
import cl.transbank.pos.exceptions.TransbankLinkException;
import cl.transbank.pos.helper.StringUtils;
import cl.transbank.pos.responses.KeysResponse;
import cl.transbank.pos.responses.SaleResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import sun.security.x509.SubjectAlternativeNameExtension;

import java.util.List;

@Controller
public class POSController {

	static POS pos = null;

	static {
		try {
			pos = POS.getInstance();
		} catch (TransbankLinkException e) {
			e.printStackTrace();
			throw new RuntimeException("Error when initializing the POS");
		}
	}


	@MessageMapping("/listPorts")
	@SendTo("/topic/listPorts")
	public PortNames listPorts() throws Exception {
		List<String> portnames = pos.listPorts();
		System.out.println("portnames: " + portnames);
		return new PortNames(portnames);
	}

	@MessageMapping("/closePort")
	@SendTo("/topic/closePort")
	public PortStatus closePort() throws Exception {
		PortStatus result = new PortStatus();
		result.setSuccess("TRUE");
		result.setMessage("");
		try {
			pos.closePort();
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess("FALSE");
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@MessageMapping("/getKeys")
	@SendTo("/topic/getKeys")
	public KeysStatus getKeys() throws Exception {
		KeysStatus result = new KeysStatus();
		try {
			KeysResponse keysResponse = pos.loadKeys();
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
		SaleStatus result = new SaleStatus();
		try {
			SaleResponse saleResponse = pos.getLastSale();
			BeanUtils.copyProperties(saleResponse, result);
			result.setMessage(null);
		} catch (Exception e) {
			e.printStackTrace();
			result.setResponseCode(-1);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@MessageMapping("/doSale")
	@SendTo("/topic/doSale")
	public SaleStatus doSale(SaleParams params) throws Exception {
		SaleStatus result = new SaleStatus();
		try {
			SaleResponse saleResponse = pos.sale(StringUtils.parseInt(params.getAmount()), StringUtils.parseInt(params.getTicket()));
			BeanUtils.copyProperties(saleResponse, result);
			result.setMessage(null);
		} catch (Exception e) {
			e.printStackTrace();
			result.setResponseCode(-1);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@MessageMapping("/openPort")
	@SendTo("/topic/openPort")
	public PortStatus openPort(OpenPortParam param) throws Exception {
		System.out.println("param: " + param);
		PortStatus result = new PortStatus();
		result.setSuccess("TRUE");
		result.setMessage("");
		try {
			pos.openPort(param.getPortname());
			boolean success = pos.poll();
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
		System.out.println("port status: " + result);
		return result;
	}
}
