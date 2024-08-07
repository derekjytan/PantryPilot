'use client'

import React, { useState, useEffect } from 'react'

const FetchPantryItems = () => {
    const [pantryItems, setPantryItems] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {   
        const fetchPantryItems = async () => {
            try {
                const response = await fetch('http://localhost:8000/pantry');
                if (!response.ok) {
                    throw new Error('Failed to fetch pantry items');
                }
                const data = await response.json();
                setPantryItems(data);
                setLoading(false);                
            } catch (error) {
                setError('Failed to fetch pantry items');
                setLoading(false);
            }            
        };
        fetchPantryItems();        
    }, []);
  return {
    pantryItems,
    loading,
    error
  };
}

export default FetchPantryItems;