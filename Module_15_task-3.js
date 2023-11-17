// Задание 3

// 1. Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
// Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
// При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
// Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:

// 2. Добавить в чат механизм отправки геолокации:
// При клике на кнопку «Геолокация» необходимо отправить данные серверу и 
// вывести в чат ссылку на https://www.openstreetmap.org/ с вашей геолокацией. 
// Сообщение, которое отправит обратно эхо-сервер, выводить не нужно.

const inptPosition      = document.querySelector(".inp");
const messBtnPosition   = document.querySelector(".btn_mess");
const geopBtnPosition   = document.querySelector(".btn_geop");
const fieldMessPosition = document.querySelector(".field_massage");
const WsUrl             = "wss://echo-ws-service.herokuapp.com";      // запасной сервер для чата "wss://echo.websocket.org";
const GeoUrl            = "https://www.openstreetmap.org/";

let messageText = "";
let websocket   = new WebSocket(WsUrl);                                         // создаем новое соединение

messBtnPosition.addEventListener('click', () => funcMessage("text"));
geopBtnPosition.addEventListener('click', () => funcGeoposition());

inptPosition.addEventListener("keydown", function(event) {      // чтобы удобнее было запускать))
    if (event.code == "Enter") {
        funcMessage("text");
    }
});


function funcMessage(mesGeop) {

    if (mesGeop == "text") {
        messageText = inptPosition.value;
        inptPosition.value = "";
        if (messageText != "") {                                        // чтобы не отправлять пустые сообщения
            funcMesWrite("send", messageText);
        } else {
            return;
        }
    } else {
        messageText = mesGeop;
    }
        
    if (websocket.readyState == WebSocket.CLOSED) {                         // проверяем наличие соединения, если нет - открываем новое
        websocket        = new WebSocket(WsUrl);                            // создаем новое соединение
        websocket.onopen = function() {                                     // открываем соединение
            console.log("CONNECTED :", websocket.readyState)                    // срабатывает когда установлено соединение

            websocket.send(messageText)                                         // отправляем сообщение
            console.log("SEND :", messageText)
        }
    } else {
        console.log("CONNECTED :", websocket.readyState)                    // срабатывает когда установлено соединение
        websocket.send(messageText)                                         // соединение уже установлено, отправляем сообщение
        console.log("SEND :", messageText)
    }
    
    websocket.onclose = function(event) {
        funcMesWrite("", "DISCONNECTED :" + event.wasClean);
        console.log("DISCONNECTED :" + event.wasClean)                            // срабатывает когда закрывается соединение
        return;
    }
    websocket.onmessage = function(event) {                                       // полученное сообщение от сервера
        console.log("ANSWER :", event.data)
        if (mesGeop == "text") {
            funcMesWrite("answer", event.data);
        } else {
            funcMesWrite("geop", event.data);
        }
    }
    websocket.onerror = function(event) {
        console.log("ERROR!!! Code: " + event.code + "Reason: " + event.reason)   // срабатывает когда получена ошибка от сервера
        funcMesWrite("", "ERROR!!! Code: " + event.code + "Reason: " + event.reason);
    }
}

    
function funcMesWrite(mesType, mesTxt) {                                                // функция рисования сообщения в зависимости от его типа

    let chatt = document.createElement("div");
        chatt.classList.add("mess_element");
        switch (mesType) {
            case "send":
                chatt.style.margin          = "0 0 10px 160px";                         // отправляемое сообщение
                chatt.style.backgroundColor = "lightgreen";
                break;

            case "answer":
                chatt.style.margin          = "0 0 10px 0";                             // получаемое сообщение
                chatt.style.backgroundColor = "white";
                break;
            
            case "geop":
                chatt.style.margin          = "0 0 10px 0";                             // выводим ссылку
                chatt.style.backgroundColor = "white";
                chatt.innerHTML = `<a href="${mesTxt}">Вы находитесь тут!</a>`;
                break;

            default:
                chatt.style.margin          = "0 auto 10px";                     // служебное сообщение об ошибке или разрыв соединения
                chatt.style.backgroundColor = "lightyellow";
                break;
        }
        if (mesType != "geop") {
            chatt.textContent = mesTxt;
        }
        
        fieldMessPosition.prepend(chatt);
}

function funcGeoposition() {
    
    const success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        funcMesWrite("send", `Широта :${latitude}\nДолгота:${longitude}`);
        funcMessage("https://www.openstreetmap.org/#map=18/"+latitude+"/"+longitude);
    }

    const error = () => {
        funcMesWrite("", "Невозможно получить геолокацию");
    }
    
    if (!navigator.geolocation) {
        funcMesWrite("", "Ваш браузер не поддерживает геолокацию")    
    } else {
        funcMesWrite("wait", "Определяю геолокацию...")    
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
