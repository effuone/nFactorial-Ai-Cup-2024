require("dotenv").config();
const MealDeducer = require("./MealDeducer");
const EdamamAPI = require("./EdamamAPI");

async function run() {
  const deducer = new MealDeducer("img/cheeseburger.jpg", 0.1);
  const output = await deducer.main();

  const edamam = new EdamamAPI();
  
  console.log(output)


  // Ensure output is properly structured
  if (output && output.ingr) {
    try {
      const analysis = await edamam.getRecipeAnalysis(output);
      console.log(analysis);
    } catch (error) {
      console.error("Error getting recipe analysis:", error);
    }
  } else {
    console.error("No ingredients found in output.");
  }
}

run();
