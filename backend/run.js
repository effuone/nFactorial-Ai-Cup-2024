require("dotenv").config();
const MealDeducer = require("./MealDeducer");
const EdamamAPI = require("./EdamamAPI");

async function run() {
  const deducer = new MealDeducer("img/chicken-broccoli.jpg", 0.1);
  const output = await deducer.main();

  const edamam = new EdamamAPI();

  // Ensure output is properly structured
  if (output && output.ingr) {
    try {
      const analysis = await edamam.getRecipeAnalysis(output);
      return analysis;
    } catch (error) {
      console.error("Error getting recipe analysis:", error);
    }
  } else {
    console.error("No ingredients found in output.");
  }
}

module.exports = run;
