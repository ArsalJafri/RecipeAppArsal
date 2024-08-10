import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { apiUrl } from "../hooks/axiosSimple";

export const SavedRecipes = () => {

  const [savedRecipe, setSavedRecipe] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/recipes/savedRecipes/${userID}`
        );
        setSavedRecipe(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const deleteRecipe = async (recipeID) => {
    try {
        await axios.delete(
            `${apiUrl}/recipes/savedRecipes/${userID}/${recipeID}`
        );
        // Remove recipe from local state
        setSavedRecipe(prev => prev.filter(recipe => recipe._id !== recipeID));
    } catch (err) {
        console.error(err);
    } 
};

  return (
    <div className="container">
      <h1>Saved Recipes</h1>
      <ul className="recipe-list">
        {savedRecipe.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <div>
              <h2>{recipe.name}</h2>
            </div>
            <p className="instructions">{recipe.instructions}</p>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
            <button 
            onClick={() => deleteRecipe(recipe._id)}
            button className="save-button"
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

