
import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ClockIcon, ChefHatIcon } from './IconComponents';

interface RecipeDisplayProps {
  ingredients: string[];
  recipes: Recipe[];
  onReset: () => void;
}

const RecipeCard: React.FC<{ recipe: Recipe; isSelected: boolean; onSelect: () => void }> = ({ recipe, isSelected, onSelect }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1 ${isSelected ? 'ring-4 ring-emerald-400' : 'hover:shadow-xl'}`}
      onClick={onSelect}
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold font-display text-gray-800">{recipe.title}</h3>
        <p className="text-gray-600 mt-2">{recipe.description}</p>
        <div className="flex items-center text-gray-500 mt-4">
          <ClockIcon className="h-5 w-5 mr-2" />
          <span>{recipe.cookingTime} minutes</span>
        </div>
      </div>
      {isSelected && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h4 className="font-bold text-lg text-gray-700 mb-2">Ingredients</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
          <h4 className="font-bold text-lg text-gray-700 mb-2">Instructions</h4>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
};

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ ingredients, recipes, onReset }) => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(0);

  return (
    <div className="bg-gray-100 min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <ChefHatIcon className="h-10 w-10 text-emerald-500"/>
            <h1 className="text-4xl font-bold font-display text-gray-800">Your Custom Recipes</h1>
          </div>
          <p className="text-lg text-gray-600">Based on what we found in your kitchen!</p>
        </header>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Identified Ingredients:</h2>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {recipes.map((recipe, index) => (
            <RecipeCard 
              key={index} 
              recipe={recipe} 
              isSelected={selectedRecipeIndex === index}
              onSelect={() => setSelectedRecipeIndex(selectedRecipeIndex === index ? null : index)}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gray-700 text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
          >
            Scan Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
