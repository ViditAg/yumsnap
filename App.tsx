
import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import type { Recipe } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import CameraCapture from './components/CameraCapture';
import LoadingScreen from './components/LoadingScreen';
import RecipeDisplay from './components/RecipeDisplay';
import ErrorScreen from './components/ErrorScreen';
import { identifyIngredients, getRecipesForIngredients } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleStart = () => {
    setAppState(AppState.CAPTURING);
    setError(null);
  };
  
  const handleReset = () => {
    setAppState(AppState.WELCOME);
    setIngredients([]);
    setRecipes([]);
    setError(null);
  };

  const processImage = useCallback(async (imageData: string) => {
    try {
      setAppState(AppState.LOADING);
      setLoadingMessage("Identifying Ingredients...");
      const foundIngredients = await identifyIngredients(imageData);
      
      if (foundIngredients.length === 0) {
        setError("We couldn't find any ingredients in your photo. Please try again with a clearer picture.");
        setAppState(AppState.ERROR);
        return;
      }
      
      setIngredients(foundIngredients);
      setLoadingMessage("Finding Recipes...");
      
      const suggestedRecipes = await getRecipesForIngredients(foundIngredients);
      
      if (suggestedRecipes.length === 0) {
        setError("We couldn't generate recipes for the identified ingredients. Please try again.");
        setAppState(AppState.ERROR);
        return;
      }

      setRecipes(suggestedRecipes);
      setAppState(AppState.RESULTS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error(err);
      setError(`Failed to process image. ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case AppState.CAPTURING:
        return <CameraCapture onCapture={processImage} onCancel={handleReset} />;
      case AppState.LOADING:
        return <LoadingScreen message={loadingMessage} />;
      case AppState.RESULTS:
        return <RecipeDisplay ingredients={ingredients} recipes={recipes} onReset={handleReset} />;
      case AppState.ERROR:
        return <ErrorScreen message={error || "An unknown error occurred."} onRetry={handleStart} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 font-sans antialiased">
      <main className="h-full w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
