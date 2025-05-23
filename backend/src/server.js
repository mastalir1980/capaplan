const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
