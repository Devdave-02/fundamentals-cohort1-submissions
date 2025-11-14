import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const MealList = ({ userId, refreshKey }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setMeals([]);
      return;
    }
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await apiService.getMealsByUser(userId);
        setMeals(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchMeals();
  }, [userId, refreshKey]);

  if (loading) return <p>Loading meals...</p>;

  return (
    <div className="list-container">
      <h3>Meal Log</h3>
      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        <ul>
          {meals.map(meal => (
            <li key={meal._id}>
              <div>
                <strong>{meal.name}</strong> - {meal.totalCalories} kcal
                <small>{new Date(meal.date).toLocaleDateString()}</small>
              </div>
              {/* Optional: List food items */}
              <ul className="food-item-sublist">
                {meal.foodItems.map((item, idx) => (
                  <li key={idx}>{item.name} ({item.calories} kcal)</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default MealList;