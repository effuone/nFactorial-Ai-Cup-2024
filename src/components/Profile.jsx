import React, { useState } from 'react';
import user from "../img/user.png";

export const Profile = () => {
  // Define state variables for user stats
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(185);
  const [bmi, setBMI] = useState(21);
  const [diet, setDiet] = useState("Not Configured");
  const [allergies, setAllergies] = useState("None");

  // Function to handle updating user stats
  const handleUpdateStats = () => {
    // Here you can implement the logic to update user stats
    // For simplicity, let's just update BMI based on weight and height
    const newBMI = calculateBMI(weight, height);
    setBMI(newBMI);
  };

  // Function to calculate BMI
  const calculateBMI = (weight, height) => {
    // BMI formula: weight (kg) / height (m) ^ 2
    return Math.round((weight / ((height / 100) ** 2)) * 10) / 10; // Round to one decimal place
  };

  return (
    <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2">
      <p className="text-xl font-semibold text-center">Profile</p>
      <img className="block mx-auto h-24" src={user} alt="Profile Picture" />
      <div className="text-center space-y-2">
        <p className="text-lg text-black font-semibold">
          Jane Doe
        </p>
        <p className="text-gray-500 font-medium">
          Stats
        </p>
        <p>Weight: {weight}kg</p>
        <p>Height: {height}cm</p>
        <p>BMI: {bmi}</p>
        <p>Diet: {diet}</p>
        <p>Allergies: {allergies}</p>
        <button 
          onClick={handleUpdateStats}
          className="px-4 py-1 text-sm text-white font-semibold bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 block mx-auto"
        >
          Edit Profile
        </button>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">History</button>
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">Create</button>
        <button className="text-gray-500 hover:text-gray-700 font-semibold text-green-500 focus:outline-none border-b-4 border-green-500">Profile</button>
      </div>
    </div>
  );
}
