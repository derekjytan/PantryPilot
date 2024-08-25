const axios = require('axios');

// Asynchronous function to fetch a list of recipes based on the provided meal
async function fetchRecipeList(meal) {
    try {
        // Encoding the meal parameter to ensure it's safe for use in a URL (spaces, special characters, etc.)
        const encodedMeal = encodeURIComponent(meal); 
        // Edamam API request URL with the encoded meal and API credentials
        const recipeList =  `https://api.edamam.com/search?q=${encodedMeal}&app_id=a2bf45c9&app_key=f380a808c0043346c4413948c63d8a27`;

        // get request to the Edamam API and await the response (asynchronously)
        // with API calls, we need to await the response before continuing
        // this ensures that the response is received before the next line of code
        // server runs smoother and more responsive with slow API requests 
        const response = await axios.get(recipeList);
        const data = response.data; // Extract the data from the response

        // Check if any recipes were found in the response
        if (data.hits.length === 0) {
            // If no recipes are found, return null
            return null;
        }

        // Extract the first recipe from the hits array
        // the hits array is the object that includes all of information about ingredients, steps, images, and instructions
        const recipe = data.hits[0].recipe;

        // Return an object containing the relevant recipe details
        return {
            imageUrl: recipe.image, // Image URL of the recipe
            steps: recipe.ingredientLines, // Array of ingredients or steps to use
            url: recipe.url // URL for recipe instructions
        };
    
    } catch (error) {
        // Debugging errors here in a catch block
        console.error('Error fetching recipe list:', error);
        // Operation failed
        return null;
    }
}

module.exports = fetchRecipeList;