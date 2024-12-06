const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assets: [
    {
      assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
      },
      visibilityIndex: {
        type: Number,
        default: 0,
      },
      position: {
        lat: {
          type: Number,
          required: true,
        },
        long: {
          type: Number,
          required: true,
        },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  actions: [
    {
      actionType: {
        type: String,
        required: true, // "create", "update", "remove"
      },
      assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
