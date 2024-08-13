import { useState, useEffect} from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

 
export const CreateRecipe = () => {
    const userID = useGetUserID();
    const [recipe, setRecipe] = useState({
        name: "",
        ingredients: [],
        instructions: "",
        imageUrl: "",
        cookingTime: 0,
        userOwner: userID,
    });
    const [cookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    useEffect(() => {
        if (recipe.imageUrl) {
            const img = new Image();
            img.src = recipe.imageUrl;
        }
    }, [recipe.imageUrl]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleIngredientChange = (event, idx) => {
        const { value } = event.target;
        const ingredients = recipe.ingredients;
        ingredients[idx] = value;
        setRecipe({ ...recipe, ingredients });
    };

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `http://localhost:3001/recipes`,
                recipe,
                { headers: { authorization: cookies.access_token } }
            );
            alert("Recipe Created!");
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="create-recipe-container">
            <h1>Create Recipe</h1>
            <form onSubmit={onSubmit} className="create-recipe-form">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    className="form-input"
                />

                <label htmlFor="ingredients">Ingredients</label>
                <button
                    className="add-ingredient-button"
                    onClick={addIngredient}
                    type="button"
                >
                    Add Ingredient
                </button>
                {recipe.ingredients.map((ingredient, idx) => (
                    <input
                        key={idx}
                        name="ingredients"
                        value={ingredient}
                        onChange={(event) => handleIngredientChange(event, idx)}
                        className="form-input"
                    />
                ))}

                <label htmlFor="instructions">Instructions</label>
                <textarea
                    id="instructions"
                    name="instructions"
                    onChange={handleChange}
                    className="form-textarea"
                ></textarea>

                <label htmlFor="imageUrl">Image URL</label>
                <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    onChange={handleChange}
                    className="form-input"
                />

                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input
                    type="number"
                    id="cookingTime"
                    name="cookingTime"
                    onChange={handleChange}
                    className="form-input"
                />

                <button className="create-recipe-button" type="submit">
                    Create Recipe
                </button>
            </form>
        </div>
    );
};
