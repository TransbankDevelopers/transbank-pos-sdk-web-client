var stompClient = null;

var total = 0;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#portlist").html("");
}

function connect() {
    var socket = new SockJS('/tbk-sdk-java-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        console.log("subscribing to list ports!");
        stompClient.subscribe('/topic/listPorts', function (result) {
            $('#callmessage').html('LIST PORTS: ' + result.body);
            createPortButtons(JSON.parse(result.body).ports);
            $.unblockUI();
        });
        console.log("subscribing to openPort!");
        stompClient.subscribe('/topic/openPort', function (result) {
                $('#callmessage').html('OPEN PORT: ' + result.body);
                var response = JSON.parse(result.body);
                console.log("response: " + response);
                if (response.success == 'TRUE') {
                    console.log("show all");
                    showAllClosedPort();
                } else {
                    console.log("hide all");
                    hideAllClosedPort();
                }
                console.log("unblock");
                $.unblockUI();
        });
        console.log("subscribing to closePort!");
        stompClient.subscribe('/topic/closePort', function (result) {
                $('#callmessage').html('CLOSE PORT: ' + result.body);
                var response = JSON.parse(result.body);
                if (response.success == 'TRUE') {
                    console.log("hide all");
                    hideAllClosedPort();
                } else {
                    console.log("show all");
                    showAllClosedPort();
               }
               console.log("unblock");
               $.unblockUI();
        });
        stompClient.subscribe('/topic/doSale', function (result) {
                $('#callmessage').html('SALE: ' + result.body);
                var response = JSON.parse(result.body);
                if (response.success == 'TRUE') {
                    console.log("hide all");
                    total = 0;
                    $('#total').text(total);
                } else {
                    console.log("show all");
               }
               console.log("unblock");
               $.unblockUI();
        });
        console.log("subscribing to getKeys!");
        stompClient.subscribe('/topic/getKeys', function (result) {
                        $('#callmessage').html('GET KEYS: ' + result.body);
                        var response = JSON.parse(result.body);
                        $('#gk-functionCode').html(response.functionCode);
                        $('#gk-responseCode').html(response.responseCode);
                        $('#gk-commerceCode').html(response.commerceCode);
                        $('#gk-terminalId').html(response.terminalId);
                        $('#gk-message').html(response.message);
                        $.unblockUI();
        });
        console.log("subscribing to doSale!");
        stompClient.subscribe('/topic/doSale', function (result) {
                        $('#callmessage').html('DO SALE: ' + result.body);
                        var response = JSON.parse(result.body);
                        $('#ds-functionCode').html(response.functionCode);
                        $('#ds-responseCode').html(response.responseCode);
                        $('#ds-commerceCode').html(response.commerceCode);
                        $('#ds-terminalId').html(response.terminalId);
                        $('#ds-ticket').html(response.ticket);
                        $('#ds-authorizationCode').html(response.authorizationCode);
                        $('#ds-amount').html(response.amount);
                        $('#ds-sharesNumber').html(response.sharesNumber);
                        $('#ds-last4Digits').html(response.last4Digits);
                        $('#ds-operationNumber').html(response.operationNumber);
                        $('#ds-cardType').html(response.cardType);
                        $('#ds-accountingDate').html(response.accountingDate);
                        $('#ds-accountNumber').html(response.accountNumber);
                        $('#ds-cardBrand').html(response.cardBrand);
                        $('#ds-realDate').html(response.realDate);
                        $('#ds-employeeId').html(response.employeeId);
                        $('#ds-tip').html(response.tip);
                        $('#ds-message').html(response.message);
                        $.unblockUI();
        });
        console.log("subscribing to lastSale!");
        stompClient.subscribe('/topic/getLastSale', function (result) {
                        $('#callmessage').html('GET LAST SALE: ' + result.body);
                        var response = JSON.parse(result.body);
                        $('#ls-functionCode').html(response.functionCode);
                        $('#ls-responseCode').html(response.responseCode);
                        $('#ls-commerceCode').html(response.commerceCode);
                        $('#ls-terminalId').html(response.terminalId);
                        $('#ls-ticket').html(response.ticket);
                        $('#ls-authorizationCode').html(response.authorizationCode);
                        $('#ls-amount').html(response.amount);
                        $('#ls-sharesNumber').html(response.sharesNumber);
                        $('#ls-last4Digits').html(response.last4Digits);
                        $('#ls-operationNumber').html(response.operationNumber);
                        $('#ls-cardType').html(response.cardType);
                        $('#ls-accountingDate').html(response.accountingDate);
                        $('#ls-accountNumber').html(response.accountNumber);
                        $('#ls-cardBrand').html(response.cardBrand);
                        $('#ls-realDate').html(response.realDate);
                        $('#ls-employeeId').html(response.employeeId);
                        $('#ls-tip').html(response.tip);
                        $('#ls-message').html(response.message);
                        $.unblockUI();
        });
        console.log("end subscriptions");
    });

}

function sellCombo() {
    total += 5000;
    $('#total').text(total);
}
function sellSandwich() {
    total += 3500;
    $('#total').text(total);
}
function sellTaco() {
    total += 2000;
    $('#total').text(total);
}
function sellCoffee() {
    total += 1000;
    $('#total').text(total);
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/listPorts", {}, '');
    $.blockUI();
}

function createPortButtons(portList) {
    $('#portlist').empty();
    console.log("portList: " + portList);
    for (var index = 0, len = portList.length; index < len; index++) {
        var port = portList[index];
        var button=$('<button/>').attr({
                type: "button",
                id: "port" + index,
                class: "btn btn-default",
            });
        $('#portlist').append(button);
        $('#port' + index).text('Port: ' + port);
        $('#port' + index).click( port, openPort );
        console.log("append: " + button);
    }
}

function openPort(portName) {
    stompClient.send("/app/openPort", {}, JSON.stringify({'portname': portName.data}));
    $('#portUsed').text(portName.data);
    console.log("opening!");
    $.blockUI();
}

function closePort() {
    stompClient.send("/app/closePort", {}, '');
    $('#portUsed').text('Desconectado');
    $.blockUI();
    clearAllTables();
}

function hideAllClosedPort() {
    $('#closePortDiv').hide('100');
    $('#getKeysDiv').hide('100');
    $('#getLastSaleDiv').hide('100');
    $('#doSaleDiv').hide('100');
    $('#portInUse').hide('100');
    $('#actuallySellDiv').hide('100');
}

function showAllClosedPort() {
    $('#closePortDiv').show('100');
    $('#getKeysDiv').show('100');
    $('#getLastSaleDiv').show('100');
    $('#doSaleDiv').show('100');
    $('#portInUse').show('100');
    $('#actuallySellDiv').show('100');
}

function getKeys() {
    stompClient.send("/app/getKeys", {}, '');
    $.blockUI();
    clearAllTables();
}

function getLastSale() {
    stompClient.send("/app/getLastSale", {}, '');
    $.blockUI();
    clearAllTables();
}

function doSale() {
    stompClient.send("/app/doSale", {}, JSON.stringify({'amount':total, 'ticket':'1234'}));
    $.blockUI({ message: '<table style="text-align: center; width: 100%;"><tr><td><img style="width: 100%;" src="pos.png" /></td></tr>' +
    '<tr><td><h2>Debe operar el Punto de Venta</h2></td></tr></table>' });
    clearAllTables();
}

function clearAllTables() {
    $('.data').empty();
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $('#closePortDiv').hide();
    $('#getKeysDiv').hide();
    $('#portInUse').hide();
    $('#getLastSaleDiv').hide();
    $('#doSaleDiv').hide();
    $('#disconnectPort').click( closePort );
    $('#getKeys').click( getKeys );
    $('#getLastSale').click( getLastSale );
    $('#buyCombo').click( sellCombo );
    $('#buySandwich').click( sellSandwich );
    $('#buyTaco').click( sellTaco );
    $('#buyCoffee').click( sellCoffee );
    $('#actuallySellDiv').hide();
    $('#doSale').click( doSale );
    connect();
});

