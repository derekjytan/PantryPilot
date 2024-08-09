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
app.use(express.json()); // Middleware to parse incoming JSON data

// First we need to authenticate the user
// We'll use middleware to help us its protected
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log("Token received:", token); // Checking to see if the backend received the token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all the pantry items from Firestore
// We'll use a get request to get the data
app.get('/pantry', authenticateUser, async (req, res) => {
  try {
    // Fetch the userID from authentication database  
    const userID = req.user.uid;
    // Fetch data from the Firestore collection 'pantryItems'
    const querySnapshot = await db.collection('users').doc(userID).collection('pantryItems').get();
    const pantryItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Send the fetched data as a JSON response
    console.log("Pantry Items:", pantryItems);
    res.json(pantryItems);
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    res.status(500).json({ error: 'An error occurred while fetching pantry items.' });
  }
});

// Endpoint to add a new item to the Firebase Firestore
app.post('/addItem', authenticateUser, async (req, res) => {
  try {
    const { item, quantity } = req.body;
    if (!item || !quantity) {
      return res.status(400).json({ error: 'Item and quantity are required.' });
    }  

    // Checking to see if the item is added or not
    console.log('Adding item:', item, 'quantity:', quantity);

    const userId = req.user.uid;
    const docRef = db.collection('users').doc(userId).collection('pantryItems').doc(item);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const existingQuantity = docSnap.data().quantity;
      await docRef.set({ name: item, quantity: existingQuantity + parseFloat(quantity) });
    } else {
      await docRef.set({ name: item, quantity: parseFloat(quantity) });
    }

    res.status(201).json({ message: 'Item added successfully.' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'An error occurred while adding the item.' });
  }
});

// Endpoint to remove an item from the Firebase Firestore
app.post('/removeItem', authenticateUser, async (req, res) => {
  console.log('Removing Item');
  try {
    console.log('Request body:', req.body); // Log request body
    const { item } = req.body; // Directly destructure from req.body
    if (!item) {
      return res.status(400).json({ error: 'Item is required.' });
    }

    console.log('Removing item:', item);
    
    const userId = req.user.uid;
    const docRef = db.collection('users').doc(userId).collection('pantryItems').doc(item);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await docRef.delete();
      } else {
        await docRef.set({ name: item, quantity: quantity - 1 });
      }
    }

    res.status(200).json({ message: 'Item removed successfully.' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'An error occurred while removing the item.' });
  }
});
  
// Endpoint to generate recipes 
app.get('/generateRecipe', authenticateUser, async (req, res) => {
  try {
    let ingredients = req.query.ingredients;

    if (!ingredients) {
      const userID = req.user.uid;
      const pantrySnapshot = await db.collection('users').doc(userID).collection('pantryItems').get();

      if (pantrySnapshot.empty) {
        console.log("Pantry is empty for user:", userID);
        return res.status(400).json({ error: 'Pantry is empty!' });
      }

      ingredients = pantrySnapshot.docs.map(doc => doc.data().item).join(', ');
    }

    console.log("Ingredients for recipe generation:", ingredients);

    const prompt = `Generate a list of detailed recipe ideas using the following ingredients: ${ingredients}.
    Please only use the ingredients provided. For each recipe idea, provide the name, a brief description, and separate the name from the description using a colon, like this:
    
    1. Recipe Name: Brief description.
    2. Recipe Name: Brief description.
    3. Recipe Name: Brief description.
    4. Recipe Name: Brief description.
    5. Recipe Name: Brief description.

    Provide 15 recipe ideas.
    
    Make sure each name is in English and clearly identifiable.`;

    const response = await queryOpenAI(prompt);
    console.log("OpenAI Response:", response);

    const recipeIdeas = response.split('\n').map(idea => {
      const [name, description] = idea.split(':');
      return { name: name.trim(), description: description?.trim() };
    });

    const recipeDetails = [];

    for (const recipe of recipeIdeas) {
      if (recipe.name) {
        console.log(`Fetching details for recipe: ${recipe.name}`);
        const newRecipeDetails = await fetchRecipeList(recipe.name);
        if (newRecipeDetails) {
          recipeDetails.push({ ...recipe, ...newRecipeDetails });
        }
      }
    }

    console.log("Final Recipe Details:", recipeDetails);
    res.json(recipeDetails);

  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'An error occurred while generating the recipe.' });
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });




