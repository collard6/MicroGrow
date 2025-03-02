const mongoose = require('mongoose');

const traySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    variety: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variety',
      required: true,
    },
    batchId: {
      type: String,
      required: true,
    },
    seedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    traySize: {
      type: String,
      enum: ['10x20', '20x20', 'custom'],
      default: '10x20',
    },
    trayArea: {
      type: Number, // in square inches
      default: 200, // 10x20 tray
    },
    seedBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SeedBatch',
    },
    status: {
      type: String,
      enum: ['seeding', 'blackout', 'growing', 'ready', 'harvested', 'discarded'],
      default: 'seeding',
    },
    location: {
      type: String,
      default: 'main',
    },
    growingArea: {
      type: String,
      default: 'default',
    },
    // Timing information
    seedingDate: {
      type: Date,
      required: true,
    },
    blackoutEndDate: {
      type: Date,
    },
    expectedHarvestDate: {
      type: Date,
    },
    actualHarvestDate: {
      type: Date,
    },
    // Harvest information
    yieldWeight: {
      type: Number, // in grams
    },
    yieldQuality: {
      type: Number, // 1-10 scale
    },
    // Issues tracking
    issues: [{
      type: {
        type: String,
        enum: ['pest', 'disease', 'environmental', 'other'],
      },
      description: String,
      severity: {
        type: Number, // 1-5 scale
        min: 1,
        max: 5,
      },
      reportDate: {
        type: Date,
        default: Date.now,
      },
      resolved: {
        type: Boolean,
        default: false,
      },
      resolutionDate: Date,
      resolutionNotes: String,
    }],
    // Additional information
    notes: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for calculating tray age in days
traySchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const seedingDate = this.seedingDate;
  const diffTime = Math.abs(now - seedingDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for calculating days until harvest
traySchema.virtual('daysUntilHarvest').get(function() {
  if (!this.expectedHarvestDate) return null;
  
  const now = new Date();
  const harvestDate = this.expectedHarvestDate;
  
  if (now > harvestDate) return 0;
  
  const diffTime = Math.abs(harvestDate - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for accessing tray photos
traySchema.virtual('photos', {
  ref: 'TrayPhoto',
  localField: '_id',
  foreignField: 'tray'
});

// Virtual for accessing tray updates
traySchema.virtual('updates', {
  ref: 'TrayUpdate',
  localField: '_id',
  foreignField: 'tray'
});

const Tray = mongoose.model('Tray', traySchema);

module.exports = Tray;
