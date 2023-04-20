const User = require("./models/User");
const Job = require("./models/Job");
const connectDB = require("./db/connect");
require("dotenv").config();

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("Connected to DB - Success");

  await User.deleteMany();
  console.log("Deleted all users");

  await Job.deleteMany();
  console.log("Deleted all Jobs");

  process.exit(0)
};

start();
