import { useState } from 'react';

const GenerateRecipe = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const ingredients = pantryItems.map(item => item.name).join(', ');
      const response = await fetch(`http://localhost:8000/generateRecipe?ingredients=${encodeURIComponent(ingredients)}`);
      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }
      const data = await response.json();
      setRecipes(data.hits); // 'hits' contains the list of recipes
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, error, generateRecipes };
};

export default GenerateRecipe;