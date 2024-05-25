const { readFileSync } = require("fs");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

class ImageAnalyzer {
  constructor(
    imagePath,
    threshold = 0.3,
    pat = "61d708af70264eb2a972a654350da57d",
    userId = "clarifai",
    appId = "main",
    modelId = "food-item-recognition",
    modelVersionId = "1d5fd481e0cf4826aa72ec3ff049e044"
  ) {
    this.imagePath = imagePath;
    this.threshold = threshold;
    this.pat = pat;
    this.userId = userId;
    this.appId = appId;
    this.modelId = modelId;
    this.modelVersionId = modelVersionId;
    this.concepts = {};
    this.stub = ClarifaiStub.grpc();
    this.metadata = new grpc.Metadata();
    this.metadata.set("authorization", "Key " + this.pat);
  }

  analyzeImage() {
    // Read the image file and convert it to base64
    const imageBytes = readFileSync(this.imagePath, { encoding: "base64" });

    this.stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: this.userId,
          app_id: this.appId,
        },
        model_id: this.modelId,
        version_id: this.modelVersionId, // This is optional. Defaults to the latest model version
        inputs: [
          {
            data: { image: { base64: imageBytes, allow_duplicate_url: true } },
          },
        ],
      },
      this.metadata,
      (err, response) => {
        if (err) {
          throw new Error(err);
        }

        if (response.status.code !== 10000) {
          throw new Error(
            "Post model outputs failed, status: " + response.status.description
          );
        }

        // Since we have one input, one output will exist here
        const output = response.outputs[0];

        console.log("Predicted concepts:");
        for (const concept of output.data.concepts) {
          // Check if concept confidence is greater than the threshold
          if (concept.value >= this.threshold) {
            // Add concept to concepts object
            this.addElementToObject(
              this.concepts,
              concept.name,
              concept.value.toFixed(2)
            );
          }
        }

        console.log(this.concepts);
      }
    );
  }

  addElementToObject(obj, key, value) {
    obj[key] = value;
  }
}

module.exports = ImageAnalyzer;
