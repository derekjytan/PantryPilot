const queryOpenAI = require('./apis/openai-api');
const fetchRecipeList = require('./apis/edmam-api');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 8000; 

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
})

const db = admin.firestore();

app.use(cors());
app.use(express.json());  

// Get all the pantry items from Firestore
// We'll use a get request to get the data
app.get('/pantry', async (req, res) => {
  try {
    // Attempt to fetch data from the Firestore collection 'pantryItems'
    const querySnapshot = await db.collection('pantryItems').get();
    const pantryItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Send the fetched data as a JSON response
    res.json(pantryItems);
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    res.status(500).json({ error: 'An error occurred while fetching pantry items.' });
  }
});

// Creating an endpoint to generate recipe ideas using OpenAI and EdMam APIs
app.get('/generateRecipe', async (req, res) => {
    try {
      const ingredients = req.query.ingredients;
      const prompt = `Generate a detailed recipe for the following ingredients: ${ingredients}. 
      Please only use the ingredients provided. The recipe should highlight the fresh and vibrant flavors of the ingredients. 
      Also, give the recipe a suitable name in its local language based on cuisine preference.`;
      const response = await queryOpenAI(prompt);
      const recipeIdeas = response.split('|');

      const recipeDetails = []

      for (let i = 0; i < recipeIdeas.length; i++) {
        const newRecipeList = recipeIdeas[i].trim().split(" ");
        const newRecipe = newRecipeList[newRecipeList.length - 1];

        const newRecipeDetails = await fetchRecipeList(newRecipe);
        recipeDetails.push(newRecipeDetails);
      }
      res.json(recipeDetails);
      
    } catch (error) {
        console.error('Error generating recipes:', error);
        res.status(500).json({ error: 'An error occurred while generating the recipe.' });
    }
});

// Endpoint to add a new item to the Firebase Firestore
app.post('/addItem', async (req, res) => {
    try {
      const { item , quantity } = req.body.item;
      if (!item || !quantity) {
        return res.status(400).json({ error: 'Item is required.' });
      }  
      const newFoodItem = {
        name: item,
        quantity: parseFloat(quantity)
      };

      await db.collection('pantryItems').add(newFoodItem);

      res.status(201).json({ message: 'Item added successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the item.' });
    }
  });

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });




