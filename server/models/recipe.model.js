const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true
  },
  ingredients: {
    type: [String],
    required: [true, 'At least one ingredient is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Recipe must have at least one ingredient'
    }
  },
  steps: {
    type: String,
    required: [true, 'Preparation steps are required'],
    trim: true
  },
  preparationTime: {
    type: String,
    required: [true, 'Preparation time is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  tags: {
    type: [String]
  }
}, {
  timestamps: true
});

// Add text index for search
recipeSchema.index({
  name: 'text',
  'ingredients': 'text',
  'tags': 'text'
});

module.exports = mongoose.model('Recipe', recipeSchema);