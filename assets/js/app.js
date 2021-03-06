var predictionResult;
var predictionResultPositive = [];
var img = document.getElementById("img");
var imgInput = document.getElementById("imgInput");
var imageFileInput = document.getElementById("imageFileInput");
var loading = document.getElementById("loading");
var startButton = document.getElementById("startButton");
var startButtonText = document.getElementById("startButtonText");
var downloadButton = document.getElementById("downloadButton");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasImg;

// start
startButton.addEventListener("click", function () {
    this.disabled = true;
    startButtonText.innerHTML = "Loading..."
    loading.style.display = "inline-block";
    downloadButton.classList.add("d-none");
    makePrediction();
});

// image update (convert image file to base64 string)
imageFileInput.onchange = function () {
    var file = imageFileInput.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        img.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}


// draw image into canvas
function drawImageIntoCanvas() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
}
function downloadCanvasImage() {
    canvasImg = canvas.toDataURL("image/png");
    downloadButton.href = canvasImg;
}


// the magic
function makePrediction() {
    // clear canvas first
    canvas.width = canvas.width
    // load the model
    cocoSsd.load().then(model => {
        // detect objects in the image.
        model.detect(img).then(predictions => {
            predictionResult = predictions;
            filterPositivePrediction(predictionResult);
            // callbacks
            loading.style.display = "none";
            startButtonText.innerHTML = "Start"
            startButton.disabled = false;
            downloadButton.classList.remove("d-none");
            drawImageIntoCanvas();
            drawPredictionSquare(predictionResultPositive);
            downloadCanvasImage();
            confetti.start(1000);
        });
    });
}


function drawPredictionSquare(predictionSquareDetails) {
    var predictionSquareDetailsLastItem = predictionSquareDetails[predictionSquareDetails.length - 1];
    var predictionSquareInfo = {
        x: Math.abs(predictionSquareDetailsLastItem.bbox[0]),
        y: Math.abs(predictionSquareDetailsLastItem.bbox[1]),
        width: predictionSquareDetailsLastItem.bbox[2],
        height: predictionSquareDetailsLastItem.bbox[3],
        text: predictionSquareDetailsLastItem.class,
        lineWidth: 4,
    }
    ctx.beginPath();
    ctx.rect(predictionSquareInfo.x, predictionSquareInfo.y, predictionSquareInfo.width, predictionSquareInfo.height);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = predictionSquareInfo.lineWidth;
    ctx.stroke();


    ctx.font = "14px Arial";
    ctx.fillStyle = "blue";
    createTextRect(ctx, predictionSquareInfo.x, predictionSquareInfo.y - 19, ctx.measureText(predictionSquareInfo.text).width, 16, 0, true);
    ctx.fillStyle = "white";
    ctx.fillText(predictionSquareInfo.text, predictionSquareInfo.x, predictionSquareInfo.y - 10);
}



function filterPositivePrediction(arr) {
    predictionResultPositive = [];
    arr.forEach(function (item) {
        if (!item.bbox.some(v => v < 0)) {
            predictionResultPositive.push(item);
        }
    });
    predictionResultPositive.forEach(function (item) {
        if (item.class == "person") {
            predictionResultPositive = [];
            predictionResultPositive.push(item)
        }
    });
}

function createTextRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}