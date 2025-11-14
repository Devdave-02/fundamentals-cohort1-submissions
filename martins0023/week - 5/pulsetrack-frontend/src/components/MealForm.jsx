import React, { useState } from 'react';
import apiService from '../api/apiService';

const MealForm = ({ userId, onNewMeal }) => {
  const [name, setName] = useState('Breakfast');
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState(null);

  // State for the sub-form (adding individual food items)
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  const handleAddFoodItem = (e) => {
    e.preventDefault(); // Stop this button from submitting the main form
    if (!foodName || !foodCalories) return;

    setFoodItems([
      ...foodItems,
      { name: foodName, calories: parseInt(foodCalories) }
    ]);
    
    // Reset sub-form
    setFoodName('');
    setFoodCalories('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please select a user first.');
      return;
    }
    if (foodItems.length === 0) {
      setError('Please add at least one food item.');
      return;
    }

    try {
      setError(null);
      const mealData = { user: userId, name, foodItems };
      await apiService.createMeal(mealData);
      
      onNewMeal(); // Trigger refresh
      
      // Clear form
      setName('Breakfast');
      setFoodItems([]);
    } catch (err) {
      setError('Failed to create meal.');
    }
  };

  return (
    <div className="form-container">
      <h3>Log New Meal</h3>
      
      {/* Main Meal Form */}
      <form onSubmit={handleSubmit}>
        <label>Meal Type:</label>
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
        
        <hr />
        
        {/* Sub-form for food items */}
        <h4>Add Food Items</h4>
        <div className="food-item-form">
          <input 
            type="text" 
            placeholder="Food Name (e.g., Apple)" 
            value={foodName} 
            onChange={(e) => setFoodName(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Calories" 
            value={foodCalories} 
            onChange={(e) => setFoodCalories(e.target.value)} 
          />
          <button type="button" onClick={handleAddFoodItem} className="secondary-button">
            Add Food
          </button>
        </div>

        {/* List of added food items */}
        <div className="added-food-list">
          {foodItems.map((item, index) => (
            <div key={index} className="added-food-item">
              <span>{item.name} ({item.calories} kcal)</span>
            </div>
          ))}
        </div>
        
        <hr />

        <button type="submit" disabled={!userId || foodItems.length === 0}>
          Log Meal
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
export default MealForm;