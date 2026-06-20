const mongoose = require('mongoose');

// 1. Define Mongoose Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  favorites: [{ type: Object }],
  recentlyViewed: [{ type: Object }],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  inputFeatures: {
    brand: String,
    model: String,
    year: Number,
    fuel_type: String,
    transmission: String,
    owner_count: Number,
    km_driven: Number,
    mileage: Number,
    engine_capacity: Number,
    seating_capacity: Number,
    safety_rating: Number,
    city: String,
    health_score: Number,
    maintenance_cost: String
  },
  predictedPrice: { type: Number, required: true },
  confidenceScore: { type: Number, required: true },
  marketRange: { min: Number, max: Number },
  depreciation: { year_1: Number, year_3: Number, year_5: Number },
  healthScore: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const CarListingSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  engineCapacity: { type: Number, required: true },
  safetyRating: { type: Number, required: true },
  seatingCapacity: { type: Number, required: true },
  maintenanceCost: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  category: { type: String }
});

const MongooseUser = mongoose.model('MongooseUser', UserSchema);
const MongoosePrediction = mongoose.model('MongoosePrediction', PredictionSchema);
const MongooseCarListing = mongoose.model('MongooseCarListing', CarListingSchema);

// 2. In-Memory Storage Cache fallback
const memoryStore = {
  users: [],
  predictions: [],
  carListings: []
};

// 3. User Class Wrapper
class UserWrapper {
  constructor(data) {
    this.data = { ...data };
    this.isMongoose = mongoose.connection.readyState === 1;
    if (this.isMongoose) {
      this.instance = new MongooseUser(data);
    } else {
      this.data._id = data._id || new mongoose.Types.ObjectId().toString();
      this.data.createdAt = data.createdAt || new Date();
      this.data.favorites = data.favorites || [];
      this.data.recentlyViewed = data.recentlyViewed || [];
      Object.assign(this, this.data);
    }
  }

  async save() {
    if (mongoose.connection.readyState === 1) {
      const saved = await this.instance.save();
      Object.assign(this, saved.toObject());
      return saved;
    } else {
      const idx = memoryStore.users.findIndex(u => u._id === this.data._id || u.email === this.data.email);
      if (idx !== -1) {
        memoryStore.users[idx] = { ...memoryStore.users[idx], ...this.data };
        Object.assign(this, memoryStore.users[idx]);
      } else {
        memoryStore.users.push(this.data);
        Object.assign(this, this.data);
      }
      return this;
    }
  }
}

UserWrapper.findOne = async (query) => {
  if (mongoose.connection.readyState === 1) {
    return await MongooseUser.findOne(query);
  } else {
    const found = memoryStore.users.find(u => {
      for (let k in query) {
        if (u[k] !== query[k]) return false;
      }
      return true;
    });
    if (!found) return null;
    const wrapped = new UserWrapper(found);
    return wrapped;
  }
};

UserWrapper.findById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    return await MongooseUser.findById(id);
  } else {
    const found = memoryStore.users.find(u => u._id.toString() === id.toString());
    if (!found) return null;
    const wrapped = new UserWrapper(found);
    return wrapped;
  }
};

// 4. Prediction Class Wrapper
class PredictionWrapper {
  constructor(data) {
    this.data = { ...data };
    this.isMongoose = mongoose.connection.readyState === 1;
    if (this.isMongoose) {
      this.instance = new MongoosePrediction(data);
    } else {
      this.data._id = data._id || new mongoose.Types.ObjectId().toString();
      this.data.createdAt = data.createdAt || new Date();
      Object.assign(this, this.data);
    }
  }

  async save() {
    if (mongoose.connection.readyState === 1) {
      return await this.instance.save();
    } else {
      memoryStore.predictions.push(this.data);
      return this.data;
    }
  }
}

PredictionWrapper.find = (query) => {
  if (mongoose.connection.readyState === 1) {
    return MongoosePrediction.find(query);
  } else {
    let results = memoryStore.predictions.filter(p => {
      for (let k in query) {
        if (p[k]?.toString() !== query[k]?.toString()) return false;
      }
      return true;
    });

    const builder = {
      sort: (sortObj) => {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return builder;
      },
      then: (resolve) => resolve(results)
    };
    // Make builder acts like a promise
    builder.then = (resolve) => resolve(results);
    return builder;
  }
};

PredictionWrapper.findOneAndDelete = async (query) => {
  if (mongoose.connection.readyState === 1) {
    return await MongoosePrediction.findOneAndDelete(query);
  } else {
    const idx = memoryStore.predictions.findIndex(p => {
      for (let k in query) {
        if (p[k]?.toString() !== query[k]?.toString()) return false;
      }
      return true;
    });
    if (idx !== -1) {
      const deleted = memoryStore.predictions[idx];
      memoryStore.predictions.splice(idx, 1);
      return deleted;
    }
    return null;
  }
};

// 5. CarListing Class Wrapper
class CarListingWrapper {
  constructor(data) {
    this.data = { ...data };
    this.isMongoose = mongoose.connection.readyState === 1;
    if (this.isMongoose) {
      this.instance = new MongooseCarListing(data);
    } else {
      this.data._id = data._id || new mongoose.Types.ObjectId().toString();
      Object.assign(this, this.data);
    }
  }
}

CarListingWrapper.countDocuments = async () => {
  if (mongoose.connection.readyState === 1) {
    return await MongooseCarListing.countDocuments();
  } else {
    return memoryStore.carListings.length;
  }
};

CarListingWrapper.insertMany = async (arr) => {
  if (mongoose.connection.readyState === 1) {
    return await MongooseCarListing.insertMany(arr);
  } else {
    arr.forEach(item => {
      const listing = new CarListingWrapper(item);
      memoryStore.carListings.push(listing.data);
    });
    return arr;
  }
};

CarListingWrapper.find = (query = {}) => {
  if (mongoose.connection.readyState === 1) {
    return MongooseCarListing.find(query);
  } else {
    let results = memoryStore.carListings.filter(c => {
      for (let k in query) {
        if (query[k] instanceof RegExp) {
          if (!query[k].test(c[k])) return false;
        } else if (typeof query[k] === 'object' && query[k] !== null) {
          const op = Object.keys(query[k])[0];
          const val = query[k][op];
          if (op === '$lte' && c[k] > val) return false;
          if (op === '$gte' && c[k] < val) return false;
        } else {
          if (c[k] !== query[k]) return false;
        }
      }
      return true;
    });

    const builder = {
      sort: (sortObj) => {
        const key = Object.keys(sortObj)[0];
        const ord = sortObj[key];
        results.sort((a, b) => ord === -1 ? b[key] - a[key] : a[key] - b[key]);
        return builder;
      },
      limit: (n) => {
        results = results.slice(0, n);
        return builder;
      },
      then: (resolve) => resolve(results)
    };
    return builder;
  }
};

module.exports = {
  User: UserWrapper,
  Prediction: PredictionWrapper,
  CarListing: CarListingWrapper
};
