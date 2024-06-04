require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const User = require("./models/User");
const Company = require("./models/Company");
const Lead = require("./models/Lead");
const FollowUp = require("./models/FollowUp");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");
  try {
    await createDummyData();
    console.log("Dummy data created successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating dummy data:", error);
    mongoose.connection.close();
  }
});

async function createDummyData() {
  // Clear existing data
  await User.deleteMany({});
  await Company.deleteMany({});
  await Lead.deleteMany({});
  await FollowUp.deleteMany({});

  // Create users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = new User({
      username: `user${i}`,
      password: await bcrypt.hash("password123", 12),
      role: i === 0 ? "admin" : "employee",
      name: `User ${i}`,
      mobile: `123456789${i}`, // Unique mobile number for each user
      email: `user${i}@example.com`,
      status: "enabled",
    });
    users.push(user);
  }
  await User.insertMany(users);

  // Create companies
  const companies = [];
  for (let i = 0; i < 10; i++) {
    const company = new Company({
      name: `Company ${i}`,
    });
    companies.push(company);
  }
  await Company.insertMany(companies);

  // Create leads
  const leads = [];
  const today = new Date();
  for (let i = 0; i < 50; i++) {
    const lead = new Lead({
      company: companies[i % 10]._id,
      name: `Lead ${i}`,
      email: `lead${i}@example.com`,
      mobile: "1234567890",
      query: `Query ${i}`,
      status: i % 3 === 0 ? "won" : i % 3 === 1 ? "lost" : "open",
      addedBy: users[i % 10]._id,
      followUps: [],
      createdAt: today, // Leads created today
    });
    leads.push(lead);
  }
  await Lead.insertMany(leads);

  // Create follow-ups for leads
  // Create follow-ups
  const followUps = [];
  for (let i = 0; i < 100; i++) {
    const futureDate = new Date();
    futureDate.setDate(
      futureDate.getDate() + faker.datatype.number({ min: 1, max: 30 })
    ); // Adding 1 to 30 days to the current date
    const followUp = new FollowUp({
      lead: leads[faker.datatype.number({ min: 0, max: 49 })]._id,
      followDate: futureDate,
      remarks: faker.lorem.sentence(),
      addedBy: users[faker.datatype.number({ min: 0, max: 9 })]._id,
      assignedTo: users[faker.datatype.number({ min: 0, max: 9 })]._id,
    });
    followUps.push(followUp);
  }
  await FollowUp.insertMany(followUps);

  // Assign follow-ups to leads
  for (let followUp of followUps) {
    await Lead.findByIdAndUpdate(followUp.lead, {
      $push: { followUps: followUp._id },
    });
  }
}
