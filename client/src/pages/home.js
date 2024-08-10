import React, { useEffect, useState } from "react"
import axios from "axios"
import {useGetUserID } from "../hooks/useGetUserID"
import {useCookies} from "react-cookie"
 
 
export const Home = () => {

    const [recipes, setRecipes] = useState([])
    const [savedRecipes, setSavedRecipes] = useState([])
    const [cookies, ] = useCookies(["access_token"]);
    const userID = useGetUserID()

    useEffect(() => {
        const fetchRecipe = async() =>{
            try {
                const response = await axios.get(`http://localhost:3001/recipes`)
                setRecipes(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
                console.log('Fetched saved recipes:', response.data);
                setSavedRecipes(response.data.savedRecipes || []); // Default to empty array if undefined
            } catch (err) {
                console.error('Error fetching saved recipes:', err);
            }
        };
        

        fetchRecipe()
        if (cookies.access_token) {
            fetchSavedRecipes()
        }
    }, [userID, cookies.access_token])
    


    const saveRecipe = async (recipeID) => {
    
        try {
            const response = await axios.put(`http://localhost:3001/recipes`, 
                {
                recipeID, 
                userID
             }, 
             {headers: {authorization: cookies.access_token}}
            )
            setSavedRecipes(response.data.savedRecipes)
        } catch (err) {
            console.error(err)
        }
    }

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    return (
        <div className="container">
            <h1>Recipes</h1>
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                    <li key={recipe._id} className="recipe-card">
                        <div>
                            <h2>{recipe.name}</h2>
                            <button
                                onClick={() => saveRecipe(recipe._id)}
                                disabled={isRecipeSaved(recipe._id)}
                                className="save-button"  
                            >
                                {isRecipeSaved(recipe._id) ? "Saved" : "Save" }
                            </button>
                        </div> 
                        <div className="instructions">
                            <p>{recipe.instructions}</p>
                        </div>
                        <img src={recipe.imageUrl} alt={recipe.name} />
                        <p>Cooking Time: {recipe.cookingTime} minutes</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}