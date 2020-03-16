var stompClient = null;

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
        stompClient.subscribe('/topic/listPorts', function (result) {
            $('#callmessage').html('LIST PORTS: ' + result.body);
            createPortButtons(JSON.parse(result.body).ports);
            $.unblockUI();
        });
    });
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
//                <button id="send" class="btn btn-default" type="submit">Listar Puertos</button>

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

var onlyOnceOpenPort = true;
function openPort(portName) {
    stompClient.send("/app/openPort", {}, JSON.stringify({'portname': portName.data}));
    $.blockUI();
    if (onlyOnceOpenPort) {
        stompClient.subscribe('/topic/openPort', function (result) {
                $('#callmessage').html('OPEN PORT: ' + result.body);
                var response = JSON.parse(result.body);
                if (response.success == 'TRUE') {
                    showAllClosedPort();
                } else {
                    hideAllClosedPort();
                }
                $.unblockUI();
        });
        onlyOnceOpenPort = false;
    }
}

var onlyOnceClosePort = true;
function closePort() {
    stompClient.send("/app/closePort", {}, '');
    $.blockUI();
    clearAllTables();
    if (onlyOnceClosePort) {
        stompClient.subscribe('/topic/closePort', function (result) {
                $('#callmessage').html('CLOSE PORT: ' + result.body);
                var response = JSON.parse(result.body);
                if (response.success == 'TRUE') {
                    hideAllClosedPort();
                } else {
                    showAllClosedPort();
               }
                $.unblockUI();
        });
        onlyOnce = false;
    }
}

function hideAllClosedPort() {
    $('#closePortDiv').hide('100');
    $('#getKeysDiv').hide('100');
    $('#getLastSaleDiv').hide('100');
}

function showAllClosedPort() {
    $('#closePortDiv').show('100');
    $('#getKeysDiv').show('100');
    $('#getLastSaleDiv').show('100');
}

var onlyOnceGetKeys = true;
function getKeys() {
    stompClient.send("/app/getKeys", {}, '');
    $.blockUI();
    clearAllTables();
    if (onlyOnceGetKeys) {
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
        onlyOnceGetKeys = false;
    }
}

var onlyOnceLastSale = true;
function getLastSale() {
    stompClient.send("/app/getLastSale", {}, '');
    $.blockUI();
    clearAllTables();
    if (onlyOnceLastSale) {
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
        onlyOnceLastSale = false;
    }
}


var onlyOnceDoSale = true;
function getLastSale() {
    stompClient.send("/app/doSale", {}, '');
    $.blockUI();
    clearAllTables();
    if (onlyOnceDoSale) {
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
        onlyOnceDoSale = false;
    }
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
    $('#getLastSaleDiv').hide();
    $('#doSaleDiv').hide();
    $('#closePort').click( closePort );
    $('#getKeys').click( getKeys );
    $('#getLastSale').click( getLastSale );
    $('#doSaleDiv').click( doSale );


});

