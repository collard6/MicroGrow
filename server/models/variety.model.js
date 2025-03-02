const mongoose = require('mongoose');

const varietySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Variety name is required'],
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Growing specifications
    germTime: {
      type: Number,
      required: [true, 'Germination time is required'],
      min: 0,
    },
    blackoutDays: {
      type: Number,
      required: [true, 'Blackout period is required'],
      min: 0,
    },
    growingDays: {
      type: Number,
      required: [true, 'Growing days is required'],
      min: 0,
    },
    seedDensity: {
      type: Number,
      required: [true, 'Seed density is required'],
      min: 0,
    },
    soakHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Temperature requirements (°C)
    tempMin: {
      type: Number,
      default: 15,
    },
    tempOptimal: {
      type: Number,
      default: 20,
    },
    tempMax: {
      type: Number,
      default: 25,
    },
    // Humidity requirements (%)
    humidityMin: {
      type: Number,
      default: 40,
    },
    humidityOptimal: {
      type: Number,
      default: 60,
    },
    humidityMax: {
      type: Number,
      default: 80,
    },
    // Expected yield
    expectedYieldPerTray: {
      type: Number,
      default: 0,
    },
    // Financial data
    costPerKg: {
      type: Number,
      default: 0,
    },
    pricePerGram: {
      type: Number,
      default: 0,
    },
    otherCostsPerTray: {
      type: Number,
      default: 0,
    },
    // Optional attributes
    color: {
      type: String,
      default: '#22c55e', // Default green color
    },
    tags: [String],
    notes: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Variety = mongoose.model('Variety', varietySchema);

module.exports = Variety;
