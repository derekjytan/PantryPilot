const queryOpenAI = require('./apis/openai-api');
const fetchRecipeList = require('./apis/edmam-api');
const express = require('express');
const cors = require('cors'); // CORS middleware 
const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = express(); // Express 
const port = process.env.PORT || 8000; 

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DB_URL
});

// Getting a reference to the Firestore database
const db = admin.firestore();

// Enable CORS for all routes
// This allows the frontend on a different localhost to send requests to the backend
// frontend is 3000, backend is 8000
app.use(cors()); 
app.use(express.json()); // Middleware to parse incoming JSON data

// First we need to authenticate the user so that we can request data based on the user
// Middleware function to authenticate users based on the Firebase token 
// This ensures that the authentication happens before any get requests
const authenticateUser = async (req, res, next) => {
  // Get the token from the request
  // Sent from the frontend -> "Bearer <token>"
  const token = req.headers.authorization?.split(' ')[1];

  console.log("Token received:", token); // Checking to see if the backend received the token

  // Handle case when there is no token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Verifying the token request 
    // await is used to wait for the token to be verified before preceeding to the next lines of code 
    const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user now has the decoded token
    req.user = decodedToken;
    next(); // Passes the request to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// get request to get all the pantry items in the database based on the authenicated user
app.get('/pantry', authenticateUser, async (req, res) => {
  try {
    // Fetch the userID from authenticated token  
    const userID = req.user.uid;
    // Fetch data from the Firestore collection 'pantryItems' from userID
    const querySnapshot = await db.collection('users').doc(userID).collection('pantryItems').get();
    // Mapping the pantry items into an array of objects
    const pantryItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Send the fetched data as a JSON response
    console.log("Pantry Items:", pantryItems); // Checking to see if the pantry items are fetched into an array
    res.json(pantryItems);
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    res.status(500).json({ error: 'An error occurred while fetching pantry items.' });
  }
});

// Endpoint to add a new item to the users pantry in Firestore
app.post('/addItem', authenticateUser, async (req, res) => {
  try {
    const { item, quantity } = req.body; // Get the item and quantity from the request body
    // Check to see if the item or quantity are not empty
    if (!item || !quantity) {
      // We need an item and quantity to add an item
      return res.status(400).json({ error: 'Item and quantity are required.' });
    }  

    // Checking to see if the item is added or not
    console.log('Adding item:', item, 'quantity:', quantity);

    const userId = req.user.uid; // User ID from the authenticated token
    // Reference the pantry items collection in the Firestore database
    const docRef = db.collection('users').doc(userId).collection('pantryItems').doc(item);
    // Check if the item already exists in the database
    const docSnap = await docRef.get();

    // If the items do exist in the database, update the quantity
    if (docSnap.exists) {
      // Get the existing quantity
      const existingQuantity = docSnap.data().quantity;
      // Update the quantity of the item in the database
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
    // Reference the pantry items collection in the Firestore database
    const docRef = db.collection('users').doc(userId).collection('pantryItems').doc(item);
    // Check if the item already exists in the database
    const docSnap = await docRef.get();

    // If items exists, update the quantity
    if (docSnap.exists) {
      /// Get the existing quantity
      const { quantity } = docSnap.data();
      // If the quantity is 1, delete the document, otherwise update the quantity
      if (quantity === 1) {
        await docRef.delete();
        // Updating the quantity of the item in the database (deleting by 1)
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
    // Get the ingredients from the query string from the frontend as a query parameter
    let ingredients = req.query.ingredients;

    // If ingredients are not provided, get the ingredients from the user's pantry
    if (!ingredients) {
      // Getting the user ID from the authenticated token
      const userID = req.user.uid;
      // Reference the pantry items collection in the Firestore database
      const pantrySnapshot = await db.collection('users').doc(userID).collection('pantryItems').get();

      // Checking to see if the user's pantry is empty
      if (pantrySnapshot.empty) {
        console.log("Pantry is empty for user:", userID);
        return res.status(400).json({ error: 'Pantry is empty!' });
      }

      // Convert the pantry items to a comma-separated string to use as ingredients
      ingredients = pantrySnapshot.docs.map(doc => doc.data().item).join(', ');
    }

    console.log("Ingredients for recipe generation:", ingredients);

    // Ask OpenAI to generate recipe ideas
    const prompt = `Generate a list of detailed recipe ideas using the following ingredients: ${ingredients}.
    Please only use the ingredients provided. For each recipe idea, provide the name, a brief description, and separate the name from the description using a colon, like this:
    
    1. Recipe Name: Brief description.
    2. Recipe Name: Brief description.
    3. Recipe Name: Brief description.
    4. Recipe Name: Brief description.
    5. Recipe Name: Brief description.

    Provide 15 recipe ideas.
    
    Make sure each name is in English and clearly identifiable.`;

    // Send the prompt to the OpenAI API and wait for a response (asynchronously)
    // Asynchronous function to prevent the server from blocking
    const response = await queryOpenAI(prompt);
    console.log("OpenAI Response:", response);

    // Process the response from OpenAI and generate the recipe details
    const recipeIdeas = response.split('\n').map(idea => {
      const [name, description] = idea.split(':'); // Split the idea into name and description
      return { name: name.trim(), description: description?.trim() }; // Get rid of the extra spaces
    });

    // An array to build the final recipe details
    const recipeDetails = [];

    // Fetch the recipe details for each recipe idea
    // Call the fetchRecipeList function from the Edamam API to get the recipe details
    for (const recipe of recipeIdeas) {
      if (recipe.name) { // Only fetch the recipe details if the name is not empty
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




