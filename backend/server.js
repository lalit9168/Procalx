const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Calculation = require('./models/Calculation');
const { execSync } = require('child_process');
const calculator = require('./index');

//const calculator = require('lalit-advanced-calculator');





const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/calculator');

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {const result = execSync(`java -cp ./java Calculator ${op} ${a} ${b}`).toString();
  console.error('MongoDB connection error:', err);
});

// API endpoint
app.post('/api/calculate', async (req, res) => {
  const { a, b, operation } = req.body;
  let result = 0;
  try {
    switch (operation) {
      case 'add':
        result = calculator.add(a, b);
        break;
      case 'subtract':
        result = calculator.subtract(a, b);
        break;
      case 'multiply':
        result = calculator.multiply(a, b);
        break;
      case 'divide':
        result = calculator.divide(a, b);
        break;
      case 'power':
        result = calculator.power(a, b);
        break;
      case 'factorial':
        result = calculator.factorial(a);
        break;
      case 'sqrt':
        result = calculator.sqrt(a);
        break;
      case 'modulus':
        result = calculator.modulus(a, b);
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

       // Convert result to number
    // const numericResult = Number(result);

    // // Validate result is a number
    // if (typeof result !== 'number' || isNaN(result)) {
    //   return res.status(400).json({ error: result || 'Calculation failed' });
    // }

    const calc = new Calculation({ a, b, operation, result });
    await calc.save();
    res.status(200).json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));