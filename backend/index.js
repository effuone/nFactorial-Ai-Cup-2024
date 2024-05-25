const ImageAnalyzer = require("./ImageAnalyser");

// Usage
const imageAnalyzer = new ImageAnalyzer("img/cheeseburger.jpg", (threshold = 0.05));

imageAnalyzer.analyzeImage();
