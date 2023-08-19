const mongoose = require('mongoose');
const { Schema } = mongoose;

const Subscription = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  subscriptionInfo: {
    endpoint: String,
    expirationTime: Number,
    keys: {
      p256dh: String,
      auth: String,
    },
  }
});
module.exports = mongoose.model('subscription', Subscription);
// endpoint: String,
//   expirationTime: Number,
//   keys: {
//     p256dh: String,
//     auth: String,
//   },
