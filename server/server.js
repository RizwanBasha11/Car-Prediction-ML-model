const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const { CarListing } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autoverse';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Base Check
app.get('/', (req, res) => {
  res.json({ message: 'AutoVerse AI Orchestration Server is online!' });
});

// Database seeding function
async function seedDatabase() {
  try {
    const count = await CarListing.countDocuments();
    if (count === 0) {
      console.log('No listings found. Seeding initial recommendation dataset...');
      const sampleListings = [
        {
          brand: 'Maruti Suzuki',
          model: 'Swift VXI',
          year: 2020,
          price: 5.4,
          mileage: 21.2,
          fuelType: 'Petrol',
          transmission: 'Manual',
          engineCapacity: 1197,
          safetyRating: 2,
          seatingCapacity: 5,
          maintenanceCost: 'Low',
          image: 'swift.png',
          description: 'Top hatchback choice for absolute low-maintenance, reliability, and excellent fuel mileage.',
          category: 'Budget'
        },
        {
          brand: 'Hyundai',
          model: 'Creta SX',
          year: 2021,
          price: 13.8,
          mileage: 16.8,
          fuelType: 'Diesel',
          transmission: 'Automatic',
          engineCapacity: 1493,
          safetyRating: 3,
          seatingCapacity: 5,
          maintenanceCost: 'Medium',
          image: 'creta.png',
          description: 'Spacious and premium mid-size SUV featuring automatic shifting, ventilated seats, and panoramic sunroof.',
          category: 'Family'
        },
        {
          brand: 'Toyota',
          model: 'Fortuner Legender',
          year: 2022,
          price: 36.5,
          mileage: 12.4,
          fuelType: 'Diesel',
          transmission: 'Automatic',
          engineCapacity: 2755,
          safetyRating: 5,
          seatingCapacity: 7,
          maintenanceCost: 'Medium',
          image: 'fortuner.png',
          description: 'Ultimate rugged off-roader with extreme resale value preservation, luxury design, and commanding street presence.',
          category: 'Luxury'
        },
        {
          brand: 'BMW',
          model: '3 Series 330i M Sport',
          year: 2021,
          price: 41.5,
          mileage: 14.8,
          fuelType: 'Petrol',
          transmission: 'Automatic',
          engineCapacity: 1998,
          safetyRating: 5,
          seatingCapacity: 5,
          maintenanceCost: 'High',
          image: 'bmw3.png',
          description: 'Stunning luxury sedan with sporty performance, adaptive suspension, digital cockpit, and elite comfort.',
          category: 'Luxury'
        },
        {
          brand: 'Tesla',
          model: 'Model 3 Performance',
          year: 2023,
          price: 48.0,
          mileage: 490.0,
          fuelType: 'Electric',
          transmission: 'Automatic',
          engineCapacity: 0,
          safetyRating: 5,
          seatingCapacity: 5,
          maintenanceCost: 'Low',
          image: 'tesla3.png',
          description: 'Futuristic electric vehicle with rapid acceleration, autopilot suite, minimalist interior, and zero fuel cost.',
          category: 'Luxury'
        },
        {
          brand: 'Honda',
          model: 'City ZX',
          year: 2019,
          price: 9.2,
          mileage: 17.8,
          fuelType: 'Petrol',
          transmission: 'Manual',
          engineCapacity: 1497,
          safetyRating: 4,
          seatingCapacity: 5,
          maintenanceCost: 'Low',
          image: 'city.png',
          description: 'Classic luxury sedan at an affordable price point. Known for its super smooth ivtec engine and passenger legroom.',
          category: 'Maintenance'
        },
        {
          brand: 'Tata',
          model: 'Nexon EV Max',
          year: 2022,
          price: 15.2,
          mileage: 437.0,
          fuelType: 'Electric',
          transmission: 'Automatic',
          engineCapacity: 0,
          safetyRating: 5,
          seatingCapacity: 5,
          maintenanceCost: 'Low',
          image: 'nexon.png',
          description: 'India\'s safest electric SUV. High ground clearance, solid build quality, and extremely cheap per-kilometer running costs.',
          category: 'Mileage'
        },
        {
          brand: 'Mahindra',
          model: 'Thar LX 4-Wheel Drive',
          year: 2021,
          price: 12.9,
          mileage: 15.2,
          fuelType: 'Diesel',
          transmission: 'Manual',
          engineCapacity: 2184,
          safetyRating: 4,
          seatingCapacity: 4,
          maintenanceCost: 'Medium',
          image: 'thar.png',
          description: 'Adventure lifestyle vehicle with convertible roof, robust 4x4 layout, and high water-wading capabilities.',
          category: 'Family'
        },
        {
          brand: 'Tata',
          model: 'Tiago Revotron XZ',
          year: 2018,
          price: 3.9,
          mileage: 20.0,
          fuelType: 'Petrol',
          transmission: 'Manual',
          engineCapacity: 1199,
          safetyRating: 4,
          seatingCapacity: 5,
          maintenanceCost: 'Low',
          image: 'tiago.png',
          description: 'Robustly built budget hatchback. Awarded 4-star safety rating, making it the safest car in the entry-level tier.',
          category: 'Budget'
        },
        {
          brand: 'Toyota',
          model: 'Innova Crysta VX',
          year: 2020,
          price: 18.5,
          mileage: 13.6,
          fuelType: 'Diesel',
          transmission: 'Manual',
          engineCapacity: 2393,
          safetyRating: 5,
          seatingCapacity: 7,
          maintenanceCost: 'Low',
          image: 'innova.png',
          description: 'Unbeatable king of family roadtrips. Captain seats, bulletproof engine reliability, and unmatched cruising comfort.',
          category: 'Family'
        }
      ];
      await CarListing.insertMany(sampleListings);
      console.log('Successfully seeded 10 base car listings.');
    }
  } catch (err) {
    console.error('Error seeding recommendation database:', err);
  }
}

// Connect to MongoDB and start Express
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB successfully connected.');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`AutoVerse Server running on port ${PORT}`);
    });
  })
  .catch(async err => {
    console.warn(`WARNING: MongoDB connection failed (${err.message}). Booting server in stand-alone In-Memory mode.`);
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`AutoVerse Server running in In-Memory Standalone Mode on port ${PORT}`);
    });
  });
