const express = require('express');
console.log('--- recipe.routes.js file is being loaded ---');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

// GET all recipes
router.get('/', recipeController.getRecipes);

// GET a single recipe
router.get('/:id', recipeController.getRecipe);

// POST create a new recipe
router.post('/', recipeController.createRecipe);

// PUT update a recipe
router.put('/:id', recipeController.updateRecipe);

// DELETE a recipe
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;