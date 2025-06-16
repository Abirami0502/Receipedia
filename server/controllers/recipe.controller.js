const Recipe = require('../models/recipe.model');

// Get all recipes
exports.getRecipes = async (req, res, next) => {
  try {
    let query = {};
    
    // Handle search if provided
    if (req.query.search) {
      query = { $text: { $search: req.query.search } };
    }
    
    // Handle tag filtering if provided
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

// Get a single recipe
exports.getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

// Create a new recipe
exports.createRecipe = async (req, res, next) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    next(err);
  }
};

// Update a recipe
exports.updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    next(err);
  }
};