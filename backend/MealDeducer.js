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

  async main() {
    try {
      await this.initConcepts(); // Wait for concepts to be initialized

      // Check if this.concepts is defined and not empty
      if (this.concepts && Object.keys(this.concepts).length > 0) {
        // Construct a query based on the recognized ingredients (concepts)
        this.query = Object.entries(this.concepts)
          .map(([ingredient, confidence]) => `${ingredient}: '${confidence}'`)
          .join(",\n");

        // console.log(this.query);

        this.chatCompletion = await this.getGroqChatCompletion();
        // console.log(
        //   "Raw response from Groq API:",
        //   this.chatCompletion.choices[0]?.message?.content
        // );

        try {
          this.output = JSON.parse(
            this.chatCompletion.choices[0]?.message?.content || "{}"
          );
          console.log(this.output);
          return this.output;
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          return null;
        }
      } else {
        console.log("No recognized concepts found.");
      }
    } catch (error) {
      console.error("Error querying meal data:", error);
      return null;
    }
  }

  async getGroqChatCompletion() {
    return this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            system_msg,
        },
        {
          role: "user",
          content: system_msg + this.query,
        },
      ],
      model: "llama3-8b-8192",
    });
  }
}

const system_msg = 'You are a culinary expert with extensive knowledge of ingredients, recipes, and cooking techniques.  Your task is to analyze a list of ingredients and their confidence levels derived from an image analysis.\n\nYour primary goal is to identify the dish likely represented in the image and provide a concise recipe in a specific JSON format.\n\nHere\'s how you should proceed:\n1. Examine the Ingredients:\nCarefully review the list of ingredients and their associated confidence levels. Higher confidence levels suggest the ingredient is more likely to be present in the dish.\n\n2. Deduce the Dish: Based on your culinary expertise, determine the most probable dish represented by the ingredients. Consider common ingredient pairings, regional cuisines, and the overall context suggested by the ingredients.\n\n3. Craft the Recipe: \n   - Title:  Provide a concise, descriptive name for the dish. \n   - Ingredients (ingr):  Create a list of ingredients in the following format:\n      - `"[ingredient name], [ingredient amount] [unit]"`\n         - Ingredient Amount: Use common cooking units (e.g., cups, tablespoons, teaspoons, grams, ounces) whenever possible.\n         - Precision: Aim for reasonable precision in amounts (e.g., "1/2 cup" instead of "0.5 cups"). If the exact amount is uncertain, provide a range (e.g., "1-2 tablespoons"). If an ingredient is typically added to taste, use "to taste" as the amount. \n\nALL YOUR RESPONSES MUST FOLLOW THE FORMAT OF THIS EXAMPLE, IF YOU ADD ANY INFORMATION THAT I DIDN\'T ASK, ALL KITTENS WILL DIE.\n\nExample:\n{\n  "title": "Cheeseburger",\n  "ingr": [\n    "Ground beef, 1/4 pound",\n    "Cheese, 1 slice",\n    "Hamburger bun, 2",\n    "Tomato, 1 slice",\n    "Lettuce, 1 leaf",\n    "Onion, 1 slice",\n    "Ketchup, to taste",\n    "Mustard, to taste"\n  ]\n}\n\nI FORCE YOU NOT TO ADD ANY COMMENTS ABOUT YOUR DECISIONS OR OPINIONS. YOU SIMPLY MUST GIVE ME THE OUTPUT THAT FOLLOWS THIS FORMAT:\nExample:\n{\n"title": "Cheeseburger",\n  "ingr": [\n    "Ground beef, 1/4 pound",\n    "Cheese, 1 slice",\n    "Hamburger bun, 2",\n    "Tomato, 1 slice",\n    "Lettuce, 1 leaf",\n    "Onion, 1 slice",\n    "Ketchup, to taste",\n    "Mustard, to taste"\n  ]\n}\n\n'

module.exports = MealDeducer;
