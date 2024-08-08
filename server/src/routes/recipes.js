import express from "express"
import { recipeModel } from "../models/Recipe.js"
import { userModel } from "../models/Users.js"
import { verifyToken } from "./user.js"

const router = express.Router()

router.get("/", async(req, res) => {
    try {
        const response = await recipeModel.find({})
        res.json(response)
    }
    catch (err) {
        res.json(err)
    }
})

router.post("/", verifyToken, async(req, res) => {
    const recipe = new recipeModel(req.body)
    try {
        const response = await recipe.save()
        res.json(response)
    }
    catch (err) {
        res.json(err)
    }
})

router.put("/", verifyToken, async (req, res) => {
    const { recipeID, userID } = req.body;


    try {
        const recipe = await recipeModel.findById(recipeID);
        const user = await userModel.findById(userID);

        if (!recipe || !user) {
            console.error("Recipe or User not found");
            return res.status(404).json({ message: "Recipe or User not found" });
        }

        user.savedRecipes.push(recipe._id); // Push only the ID
        await user.save();

        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        console.error("Error during saveRecipe PUT request:", err);
        res.status(500).json({ error: err.message });
    }
});


router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userID)
        res.json({savedRecipes: user.savedRecipes})
    } catch (err) {
        res.json(err)
        
    }
})


router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const savedRecipes = await recipeModel.find({
            _id: { $in: user.savedRecipes }
        });
        res.json(savedRecipes);
    } catch (err) {
        res.status(500).json(err);
    }
});



// Route to remove a saved recipe from a user's saved list
router.delete("/savedRecipes/:userID/:recipeID", async (req, res) => {
    try {
        const { userID, recipeID } = req.params;
        
        // Find the user and remove the recipe from savedRecipes
        const user = await userModel.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeID);
        await user.save();
        
        // Optionally, delete the recipe from the database
        // await recipeModel.findByIdAndDelete(recipeID);
        
        res.json({ message: "Recipe removed from saved list", savedRecipes: user.savedRecipes });
    } catch (err) {
        res.status(500).json(err);
    }
});




export {router as recipesRouter}