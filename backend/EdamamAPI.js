require("dotenv").config();

class EdamamAPI {
  constructor(
    appId = process.env.EDAMAM_APP_ID,
    appKey = process.env.EDAMAM_APP_KEY
  ) {
    this.appId = appId;
    this.appKey = appKey;
    this.baseURL = "https://api.edamam.com/api/nutrition-details";
  }

  async getRecipeAnalysis(ingredients) {
    const requestBody = {
      title: ingredients.title,
      ingr: ingredients.ingr,
    };

    const url = `${this.baseURL}?app_id=${this.appId}&app_key=${this.appKey}`;

    console.log(requestBody);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error fetching recipe analysis:", error);
      return null;
    }
  }
}

module.exports = EdamamAPI;
