# Pantry Pilot

Pantry Pilot is a full-stack application designed to help users take control of their kitchen inventory and meal planning. With Pantry Pilot, users can easily track and manage their pantry items, ensuring nothing goes to waste. The app offers personalized recipe suggestions based on the ingredients you have on hand, making meal prep easier and more creative. By securely saving your pantry data to your account, you can access and update your inventory anytime, anywhere. Pantry Pilot leverages the power of OpenAI and Edamam APIs to not only suggest recipe ideas but also provide detailed instructions, images, and links to full recipes, turning your available ingredients into delicious meals. Whether you’re an organized home cook or someone looking to reduce food waste, Pantry Pilot is your go-to kitchen companion.

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit%20Now-blue?style=for-the-badge&logo=vercel)](https://pantry-git clpilot-wheat.vercel.app/)
## Features and Interface

- **Landing Page**
  - Seamless landing page with `Login & Register` buttons using Firebase Authentication.
  - ![image](https://github.com/derekjytan/PantryPilot/raw/main/landing.png)

- **Pantry**
  - Smooth and responsive interface for pantry tracking, styled with `Material UI`.
  - ![image](https://github.com/derekjytan/PantryPilot/raw/main/pantryItems.png)

- **Recipe**
  - Customized recipe suggestions from your pantry items.
  - ![image](https://github.com/derekjytan/PantryPilot/raw/main/recipe.png)
## Tech Stack

![Next.js](https://github.com/derekjytan/PantryPilot/raw/main/nextjs.svg)  ![React.js](https://github.com/derekjytan/PantryPilot/raw/main/react.svg)  ![Material-UI](https://github.com/derekjytan/PantryPilot/raw/main/mui.svg)  ![Express.js](https://github.com/derekjytan/PantryPilot/raw/main/express.svg)  ![Node.js](https://github.com/derekjytan/PantryPilot/raw/main/nodejs.svg)  ![Firebase](https://github.com/derekjytan/PantryPilot/raw/main/firebase.svg)  ![OpenAI](https://github.com/derekjytan/PantryPilot/raw/main/openai.svg)

## Client Instructions
1. Clone the repository
   - `git clone https://github.com/derekjytan/PantryPilot.git`
3. Install node dependencies 
   - `npm install`
4. Go to the client directory
   - `cd client`
5. Replace Firebase API keys with your SDK configurations
6.  Create a `.env` file 
   - Add relevant credentials
   - `cp .env.example .env`
7. `npm run dev`

