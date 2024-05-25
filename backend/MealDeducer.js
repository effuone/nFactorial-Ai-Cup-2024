require("dotenv").config();
const ImageAnalyzer = require("./ImageAnalyser");
const Groq = require("groq-sdk");

class MealDeducer {
  constructor(imagePath, threshold = 0.05) {
    this.imagePath = imagePath;
    this.threshold = threshold;
    this.groq = new Groq({ apiKey: process.env.GROQ_API });
  }

  async initConcepts() {
    try {
      const imageAnalyzer = new ImageAnalyzer(this.imagePath, this.threshold);
      await imageAnalyzer.analyzeImage();
      this.concepts = imageAnalyzer.concepts;
    } catch (error) {
      console.error("Error analyzing the image:", error);
      return null;
    }
  }

  async getGroqChatCompletion() {
    return this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are the best cook in the world. You utilize advanced natural language processing techniques for semantic analysis and contextual understanding. You must be able to analyze food images and infer additional details about the recognized ingredients. For example, if the image contains 'lettuce' and 'tomato,' the system should recognize them as common ingredients in a salad and provide relevant information about salad recipes, dressings, etc. Furthermore, the system should consider the context in which the food items appear to enhance accuracy and provide more detailed information about the dish. For instance, if 'lettuce,' 'tomato,' and 'bread' are recognized together, the system should infer that it's likely a sandwich or burger and provide relevant details accordingly. Implement these features to create a comprehensive food analysis system that offers users rich and informative insights into the dishes depicted in the images.\n\nAll you response must be in this JSON format:\n{\n[name]: String\n[explanation]: String\n[ingredients (with units)]: Array\n[recipe (step by step detailed plan)]: String\n}",
        },
      ],
      model: "llama3-8b-8192",
    });
  }

  async main() {
    try {
      await this.initConcepts(); // Wait for concepts to be initialized

      // Check if this.concepts is defined and not empty
      if (this.concepts && Object.keys(this.concepts).length > 0) {
        // Construct a query based on the recognized ingredients (concepts)
        const query = Object.entries(this.concepts)
          .map(([ingredient, confidence]) => `${ingredient}: '${confidence}'`)
          .join(",\n");

        console.log(query);

        this.chatCompletion = await this.getGroqChatCompletion();
      } else {
        console.log("No recognized concepts found.");
      }
    } catch (error) {
      console.error("Error querying meal data:", error);
      return null;
    }
  }
}

const systemPrompt = {
  role: "system",
  content:
    "You are the best cook in the world. You utilize advanced natural language processing techniques for semantic analysis and contextual understanding. You must be able to analyze food images and infer additional details about the recognized ingredients. For example, if the image contains 'lettuce' and 'tomato,' the system should recognize them as common ingredients in a salad and provide relevant information about salad recipes, dressings, etc. Furthermore, the system should consider the context in which the food items appear to enhance accuracy and provide more detailed information about the dish. For instance, if 'lettuce,' 'tomato,' and 'bread' are recognized together, the system should infer that it's likely a sandwich or burger and provide relevant details accordingly. Implement these features to create a comprehensive food analysis system that offers users rich and informative insights into the dishes depicted in the images.\n\nAll you response must be in this JSON format:\n{\n[name]: String\n[explanation]: String\n[ingredients (with units)]: Array\n[recipe (step by step detailed plan)]: String\n}",
};

module.exports = MealDeducer;
