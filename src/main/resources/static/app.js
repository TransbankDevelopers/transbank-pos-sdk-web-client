// import POS from 'transbank-pos-websocket';

// var stompClient = null;

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
    POS.getPorts().then( function(result) {
        $('#callmessage').html('LIST PORTS: ' + result);
        createPortButtons(result);
    }).catch(
        error => console.log(error.message)
    );
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
    POS.openPort(portName).then( function(result) {
        if (result === 'TRUE') {
            console.log("show all");
            showAllClosedPort();
        } else {
            console.log("hide all");
            hideAllClosedPort();
        }
    }).catch(
        error => console.log(error.message)
    );
}

function closePort() {
    POS.closePort().then( function(result) {
        if ( result === 'TRUE' ) {
            console.log("hide all");
            hideAllClosedPort();
        } else {
            console.log("show all");
            showAllClosedPort();
       }
    }).catch(
        error => console.log(error.message)
    );
    $('#portUsed').text('Desconectado');
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
    // stompClient.send("/app/getKeys", {}, '');
    POS.getKeys().then( function(result) {
        $('#gk-functionCode').html(result.functionCode);
        $('#gk-responseCode').html(result.responseCode);
        $('#gk-commerceCode').html(result.commerceCode);
        $('#gk-terminalId').html(result.terminalId);
        $('#gk-message').html(result.message);
    }).catch(
        error => console.log(error.message)
    );
    clearAllTables();
}

function getLastSale() {
    POS.getLastSale().then( function(result) {
        $('#callmessage').html('GET LAST SALE: ' + result);
        $('#ls-functionCode').html(result.functionCode);
        $('#ls-responseCode').html(result.responseCode);
        $('#ls-commerceCode').html(result.commerceCode);
        $('#ls-terminalId').html(result.terminalId);
        $('#ls-ticket').html(result.ticket);
        $('#ls-authorizationCode').html(result.authorizationCode);
        $('#ls-amount').html(result.amount);
        $('#ls-sharesNumber').html(result.sharesNumber);
        $('#ls-last4Digits').html(result.last4Digits);
        $('#ls-operationNumber').html(result.operationNumber);
        $('#ls-cardType').html(result.cardType);
        $('#ls-accountingDate').html(result.accountingDate);
        $('#ls-accountNumber').html(result.accountNumber);
        $('#ls-cardBrand').html(result.cardBrand);
        $('#ls-realDate').html(result.realDate);
        $('#ls-employeeId').html(result.employeeId);
        $('#ls-tip').html(result.tip);
        $('#ls-message').html(result.message);
    }).catch(
        error => console.log(error.message)
    );
    // stompClient.send("/app/getLastSale", {}, '');
    clearAllTables();
}

function doSale() {
    $.blockUI({ message: '<table style="text-align: center; width: 100%;"><tr><td><img style="width: 100%;" src="pos.png" /></td></tr>' +
    '<tr><td><h2>Debe operar el Punto de Venta</h2></td></tr></table>' });
    POS.doSale( amount=total, ticket= '1234' ).then( function(result) {
        $('#callmessage').html('DO SALE: ' + result);
        $('#ds-functionCode').html(result.functionCode);
        $('#ds-responseCode').html(result.responseCode);
        $('#ds-commerceCode').html(result.commerceCode);
        $('#ds-terminalId').html(result.terminalId);
        $('#ds-ticket').html(result.ticket);
        $('#ds-authorizationCode').html(result.authorizationCode);
        $('#ds-amount').html(result.amount);
        $('#ds-sharesNumber').html(result.sharesNumber);
        $('#ds-last4Digits').html(result.last4Digits);
        $('#ds-operationNumber').html(result.operationNumber);
        $('#ds-cardType').html(result.cardType);
        $('#ds-accountingDate').html(result.accountingDate);
        $('#ds-accountNumber').html(result.accountNumber);
        $('#ds-cardBrand').html(result.cardBrand);
        $('#ds-realDate').html(result.realDate);
        $('#ds-employeeId').html(result.employeeId);
        $('#ds-tip').html(result.tip);
        $('#ds-message').html(result.message);
        total = 0;
    }).catch(
        error => console.log(error.message)
    );
    clearAllTables();
}

function clearAllTables() {
    $('.data').empty();
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { pos.connect(); });
    $( "#disconnect" ).click(function() { pos.disconnect(); });
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
});

