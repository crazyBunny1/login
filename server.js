// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock database
let orders = [];
let newsletterSubscribers = [];

// API Endpoints
app.post('/api/order', (req, res) => {
  try {
    const order = req.body;
    
    // Validate order data
    if (!order.items || !order.customerInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order data' 
      });
    }
    
    // Add order to database
    order.id = Date.now();
    order.status = 'received';
    order.orderDate = new Date().toISOString();
    orders.push(order);
    
    // Return success response
    res.json({ 
      success: true, 
      orderId: order.id,
      message: 'Order received successfully'
    });
  } catch (error) {
    console.error('Order processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing order'
    });
  }
});

app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email is required' 
      });
    }
    
    // Check if already subscribed
    if (!newsletterSubscribers.includes(email)) {
      newsletterSubscribers.push(email);
    }
    
    res.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing subscription'
    });
  }
});

app.get('/api/stores', (req, res) => {
  try {
    const location = req.query.location;
    
    // Validate location parameter
    if (!location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Location parameter is required' 
      });
    }
    
    // In a real app, you would query your database here
    // For demo, return mock data
    const stores = [
      {
        name: 'PizzaHut - Hazratganj',
        address: '91, Mahatma Gandhi Marg, opposite Governer House, Raj Bhavan Colony, Hazratganj, Lucknow',
        phone: '+91 18002022022',
        distance: '0.5 km'
      },
      {
        name: 'PizzaHut - Mahanagar',
        address: 'Prem Jyoti Tower, B 939/A, Gole Market, Mahanagar, Lucknow',
        phone: '+91 8448191079',
        distance: '2.1 km'
      }
    ];
    
    res.json({ 
      success: true, 
      stores: stores 
    });
  } catch (error) {
    console.error('Store location error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing location request'
    });
  }
});

// Get order status
app.get('/api/order/:orderId', (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true, 
      order: {
        id: order.id,
        status: order.status,
        orderDate: order.orderDate
      }
    });
  } catch (error) {
    console.error('Order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing order status request'
    });
  }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});