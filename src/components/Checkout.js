// src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [cart, setCart] = useState({});
  const [laptops, setLaptops] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(0);

  useEffect(() => {
    // Extract cart and laptops from the location state
    const { state } = location;

    // Check if state is defined and has cart and laptops properties
    if (state && state.cart && state.laptops) {
      setCart(state.cart);
      setLaptops(state.laptops);
    } else {
      console.error('Cart or laptops is undefined or null');
    }
  }, [location]);

  const calculateTotalPrice = () => {
    // Calculate the total price based on the items in the cart
    const totalPrice = Object.entries(cart).reduce(
      (total, [laptopId, quantity]) => {
        const laptop = laptops.find((l) => l.id === parseInt(laptopId, 10));
        return total + (laptop ? laptop.price * quantity : 0);
      },
      0
    );

    return totalPrice;
  };
  const applyCoupon = () => {
    if (coupon === 'NEWYEAR') {
      let discountedTotal = 0;
      const modelsWithQuantity2Discount = new Set();
  
      Object.entries(cart).forEach(([laptopId, quantity]) => {
        const laptop = laptops.find((l) => l.id === parseInt(laptopId, 10));
        console.log(laptop);
  
        if (laptop) {
          let discount;
          const parsedQuantity = parseInt(quantity, 10); // Convert quantity to a number
          console.log(parsedQuantity);
  
          switch (parsedQuantity) {
            case 1:
              discount = 0.25; // 25% discount for quantity 1
              break;
            case 2:
              if (!modelsWithQuantity2Discount.has(laptop.model)) {
                discount = 0.4; // 40% discount for quantity 2 of the same model (applied only once)
                modelsWithQuantity2Discount.add(laptop.model);
              } else {
                discount = 0.25; // 25% discount for quantity 2 of a different model
              }
              break;
            default:
              discount = 0; // No discount for other cases
          }
  
          console.log(discount);
          const discountedPrice = laptop.price * (1 - discount) * parsedQuantity;
          discountedTotal += discountedPrice;
        }
      });
  
      setDiscountedPrice(discountedTotal);
    } else {
      setDiscountedPrice(0); // Reset discount if coupon is invalid
    }
  };
  
  
  
  const handleCheckout = async () => {
    const totalPrice = discountedPrice > 0 ? discountedPrice : calculateTotalPrice();
    console.log(`Checkout initiated for ${email}. Total Price: $${totalPrice}`);
  
    try {
      const response = await axios.post('http://localhost:8080/api/send-order-email', {
        email,
        orderDetails: {
          laptops: laptops.map(laptop => ({
            model: laptop.model,
            quantity: cart[laptop.id],
            price: laptop.price,
          })),
          totalPrice,
        },
      });
  
      if (response.status === 200) {
        console.log('Order confirmation email sent successfully');
        navigate('/thankyou');
      } else {
        console.error('Failed to send order confirmation email');
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  };

  
  return (
    <div>
      <h2>Checkout</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <h3>Order Summary</h3>
        <ul>
          {Object.entries(cart).map(([laptopId, quantity]) => {
            const laptop = laptops.find((l) => l.id === parseInt(laptopId, 10));
            return (
              <li key={laptopId}>
                {laptop ? `${laptop.model} - Quantity: ${quantity}` : 'Laptop not found'}
              </li>
            );
          })}
        </ul>
        <p>Total Price: ${calculateTotalPrice()}</p>
      </div>
      <div>
        <label>Coupon:</label>
        <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
        <button onClick={applyCoupon}>Apply Coupon</button>
        {discountedPrice > 0 && <p>Discounted Price: ${discountedPrice}</p>}
      </div>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

export default Checkout;
  
