const checkNiyamaLow = $("#checkNiyamaLow");
const checkKonsai = $("#checkKonsai");
const selectDummyBox = $("#selectDummyBox");
const inputSiire = $("#inputSiire");
const inputUkeire = $("#inputUkeire");
const inputOrder = $("#inputOrder");
const inputHinban = $("#inputHinban");
const inputTokoro = $("#inputTokoro");
const qrResult = $("#qrResult");

const video = $("#video")[0];       // jQueryオブジェクトからDOM要素を取得するために[0]を追加
const photo1 = $("#photo1");
const photo2 = $("#photo2");
const photo3 = $("#photo3");
const overlay = $("#overlay");

let currentStream = null;           // 現在のストリームを保持する変数

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));    //timeはミリ秒



const submitData = async () => {
    showOverlay("処理中...");
    const isNiyamaLow = checkNiyamaLow.prop("checked");
    const isKonsai = checkKonsai.prop("checked");
    const countDummyBox = selectDummyBox.val();
    const image1 = photo1[0].src
    const image2 = photo2[0].src
    const image3 = photo3[0].src
    const data = {
        "isNiyamaLow": isNiyamaLow,
        "isKonsai": isKonsai,
        "countDummyBox": countDummyBox,
        "valSiire": inputSiire.val(),
        "valUkeire": inputUkeire.val(),
        "valOrder": inputOrder.val(),
        "valHinban": inputHinban.val(),
        "valTokoro": inputTokoro.val(),
    }
    await sleep(1000)
    sendData(data);
    await sleep(1000)
    clearData();
    hideOverlay();
}

const clearData = () => {
    checkNiyamaLow.prop("checked", false);
    checkKonsai.prop("checked", false);
    selectDummyBox.val(0);
    inputSiire.val("");
    inputUkeire.val("");
    inputOrder.val("");
    inputHinban.val("");
    inputTokoro.val("");
    clearImg(photo1);
    clearImg(photo2);
    clearImg(photo3);
    clearQRresult();
}

const startVideo = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
            const lastVideoDevice = videoDevices[videoDevices.length - 1];
            return navigator.mediaDevices.getUserMedia({
                video: { deviceId: lastVideoDevice.deviceId }
            });
        } else {
            throw new Error('No video devices found.');
        }
    })
    .then(stream => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());   // 既存のストリームを停止
        }
        video.srcObject = stream;
        video.setAttribute('playsinline', true);    // iOS対応
        video.play();
        currentStream = stream;                     // 新しいストリームを保存
    })
    .catch(err => {
        console.error("カメラに接続できません: " + err);
    });
}

const captureImg = (imgElement) => {
    const img = imgElement[0];              // jQueryオブジェクトからDOM要素を取得するために[0]を追加
    const canvas = $("<canvas>")[0];
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg");
    imgElement.attr("src", dataURL);
}

const clearImg = (imgElement) => {
    const originalSrc = imgElement.attr("data-original-src");
    imgElement.attr("src", originalSrc);
}


const scanQRCode = () => {
    const canvas = $('<canvas>')[0];
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
        const qrLength = code.data.length
        const valSiire = code.data.substring(1, 4 + 1);
        const valUkeire = code.data.substring(5, 6 + 1);
        const valOrder = code.data.substring(7, 9 + 1);
        const valHinban = code.data.substring(10, 15 + 1);
        const valTokoro = code.data.substring(16, 20 + 1);
        inputSiire.val(valSiire);
        inputUkeire.val(valUkeire);
        inputOrder.val(valOrder);
        inputHinban.val(valHinban);
        inputTokoro.val(valTokoro);
        qrResult.text(` ${code.data} （${qrLength}桁）`);
        qrResult.removeClass("qrdata_notfound");
        qrResult.addClass("qrdata_found");
    } else {
        qrResult.text("QRコード　見つかりません");
        qrResult.addClass("qrdata_notfound");
        qrResult.removeClass("qrdata_found");
    }
};

const clearQRresult = () => {
    qrResult.text("QRコード　読み取り未");
    qrResult.addClass("qrdata_notfound");
    qrResult.removeClass("qrdata_found");
}


const sendData = (data) => {
    fetch("/upload", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        showOverlay("送信成功");
    })
    .catch(error => {
        console.error('Error:', error);
        showOverlay("送信失敗");
    });
};

const reconnectCamera = () => {
    startVideo();
};

const showOverlay = (text) => {
    overlay.css("visibility", "visible")
    overlay.text(text);
}

const hideOverlay = () => {
    overlay.css("visibility", "hidden")
}


function sendImages() {
    const images = [
        { id: 1, data: photo1.src },
        { id: 2, data: photo2.src },
        { id: 3, data: photo3.src }
    ];

    const qrCode = qrMessage.textContent;

    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ images, qrCode })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

$("#capture1").on("click", () => {captureImg(photo1);});
$("#capture2").on("click", () => {captureImg(photo2);});
$("#capture3").on("click", () => {captureImg(photo3); scanQRCode();});
$("#clear1").on("click", () => {clearImg(photo1);});
$("#clear2").on("click", () => {clearImg(photo2);});
$("#clear3").on("click", () => {clearImg(photo3); clearQRresult();});
$("#submit").on("click", submitData);
$("#reconnect").on("click", startVideo);

//startCamera();
startVideo();

