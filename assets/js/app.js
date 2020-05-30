var predictionResult;
var img = document.getElementById("img");
var imgInput = document.getElementById("imgInput");
var loading = document.getElementById("loading");
var prediction = document.getElementById("prediction");
var startButton = document.getElementById("startButton");
var startButtonText = document.getElementById("startButtonText");
var downloadButton = document.getElementById("downloadButton");
var uploadButton = document.getElementById("uploadButton");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// start
startButton.addEventListener("click", function () {
    this.disabled = true;
    startButtonText.innerHTML = "Loading..."
    loading.style.display = "inline-block";
    makePrediction();
});

// image update
uploadButton.addEventListener("click", function () {
    var imgSrc = imgInput.value;
    img.src = imgSrc;
});


// the magic!
function makePrediction() {
    // Load the model
    cocoSsd.load().then(model => {
        // detect objects in the image.
        model.detect(img).then(predictions => {
            loading.style.display = "none";
            startButtonText.innerHTML = "Start"
            startButton.disabled = false;
            console.log("Predictions: ", predictions);
            predictionResult = predictions;
            drawImageIntoCanvas();
            drawPredictionSquare(predictionResult);
            confetti.start(100);
            prediction.innerHTML = "score:" + JSON.stringify(predictions[0].score, null, 2);
        });
    });
}

// draw image into canvas
function drawImageIntoCanvas() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
}


function drawPredictionSquare(predictionSquareDetails) {
    var predictionSquareInfo = {
        x: Math.abs(predictionSquareDetails[0].bbox[0]),
        y: Math.abs(predictionSquareDetails[0].bbox[1]),
        width: predictionSquareDetails[0].bbox[2],
        height: predictionSquareDetails[0].bbox[3]
    }
    ctx.beginPath();
    ctx.rect(predictionSquareInfo.x, predictionSquareInfo.y, predictionSquareInfo.width, predictionSquareInfo.height);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.stroke();


    var text = predictionSquareDetails[0].class;
    ctx.font = "15px Arial";
    ctx.fillStyle = "blue";
    //ctx.textAlign = "center";
    //ctx.textBaseline = "middle";
    roundRect(ctx, predictionSquareInfo.x, predictionSquareInfo.y - 21, ctx.measureText(text).width, 16, 0, true);
    ctx.fillStyle = "white";
    ctx.fillText(text, predictionSquareInfo.x, predictionSquareInfo.y - 10);
}





function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
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
