require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
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
      username: faker.internet.userName(),
      password: await bcrypt.hash("password123", 12),
      role: i === 0 ? "admin" : "employee",
      name: faker.name.fullName(),
      mobile: faker.phone.number("##########"),
      email: faker.internet.email(),
      status: "enabled",
    });
    users.push(user);
  }
  await User.insertMany(users);

  // Create companies
  const companies = [];
  for (let i = 0; i < 10; i++) {
    const company = new Company({
      name: faker.company.name(),
    });
    companies.push(company);
  }
  await Company.insertMany(companies);

  // Create leads
  const leads = [];
  for (let i = 0; i < 50; i++) {
    const lead = new Lead({
      company: companies[faker.datatype.number({ min: 0, max: 9 })]._id,
      name: faker.name.fullName(),
      email: faker.internet.email(),
      mobile: faker.phone.number("##########"),
      query: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["open", "won", "loss"]),
      addedBy: users[faker.datatype.number({ min: 0, max: 9 })]._id,
      followUps: [],
    });
    leads.push(lead);
  }
  await Lead.insertMany(leads);

  // Create follow-ups
  const followUps = [];
  for (let i = 0; i < 100; i++) {
    const followUp = new FollowUp({
      lead: leads[faker.datatype.number({ min: 0, max: 49 })]._id,
      followDate: faker.date.future(),
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
