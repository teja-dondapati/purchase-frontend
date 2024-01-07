// src/components/LaptopList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LaptopList = () => {
  const [laptops, setLaptops] = useState([]);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch laptops from the backend
    axios.get('http://localhost:8080/api/purchases/laptops')
      .then(response => setLaptops(response.data))
      .catch(error => console.error('Error fetching laptops:', error));
  }, []);

  const handleAddToCart = (laptopId, quantity) => {
    // Update the cart state with the selected laptop and quantity
    setCart(prevCart => ({
      ...prevCart,
      [laptopId]: quantity,
    }));
  };

  const handleProceedToCheckout = () => {
    // Navigate to the checkout page with the cart and laptops as state
    navigate('/checkout', { state: { cart, laptops } });
  };

  return (
    <div>
      <h2>List of Laptops</h2>
      <ul>
        {laptops.map(laptop => (
          <li key={laptop.id}>
            {laptop.model} - ${laptop.price}
            <input
              type="number"
              min="1"
              value={cart[laptop.id] || ''}
              onChange={(e) => {
                const quantity = e.target.value;
                handleAddToCart(laptop.id, quantity);
              }}
            />
            <button onClick={() => handleAddToCart(laptop.id, cart[laptop.id])}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
      <div>
        <h3>Shopping Cart</h3>
        <ul>
          {Object.entries(cart).map(([laptopId, quantity]) => (
            <li key={laptopId}>
              {laptops.find(laptop => laptop.id === parseInt(laptopId, 10)).model} - Quantity: {quantity}
            </li>
          ))}
        </ul>
        <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default LaptopList;
