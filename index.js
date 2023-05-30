// Dependencies
const mongoose = require('mongoose');
const path = require('path');
// require('dotenv').config(); // NB: .env should be in the root folder (ws-mongoose-f3)
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

// Connect to database
// then/catch:
// mongoose
//   .connect(process.env.MONGO_URI, {
//     autoIndex: false, // Don't build indexes
//     maxPoolSize: 10, // Maintain up to 10 socket connections
//     serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
//     socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//     family: 4, // Use IPv4, skip trying IPv6
//   })
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB:', err.message));

// async/await:
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log('Connected to MongoDB...');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
  }
}

// console.log(process.env.PORT);
// console.log(process.env.MONGO_URI);

connectDB();

// Schema
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  phone: { type: String },
  addedAt: { type: Date, default: Date.now() },
});

// Model
const Contact = mongoose.model('contact', contactSchema);

// Create Contact (aka: create document)
const createContact = async newContact => {
  const contact = new Contact(newContact);
  try {
    const result = await contact.save();
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Create many contacts
const createManyContacts = async contacts => {
  try {
    const result = await Contact.create(contacts);
    console.log('Contacts added:', result);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Get contacts
const getContacts = async () => {
  /*
  Comparison Query Operators
  - eq
  - ne (not equal)
  - gt
  - gte
  - lt
  - lte
  - in 
  - nin (not in)
  */
  try {
    // const contacts = await Contact.find();
    // const contacts = await Contact.find(
    //   { _id: '6475d84385a050334f8766ac' },
    //   { fullName: 0, email: 0 }
    // );

    // const contacts = await Contact.find({
    //   _id: '6475d84385a050334f8766ac',
    // }).select('-fullName -email');

    // const contacts = await Contact.find().sort('-age').limit(2);

    const contacts = await Contact.find({ age: { $gte: 25 } });

    // const contact = await Contact.findOne({ _id: '6475d84385a050334f8766ac' });

    console.log(contacts);
    // console.log(contact);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Update Contact
const updateContact = async (id, newAge) => {
  try {
    // Query First
    // const contact = await Contact.findById(id);
    // contact.age = newAge;
    // const result = await contact.save();
    // console.log(result);

    // ---------------------

    // Update First
    // const result = await Contact.updateOne(
    //   { _id: id },
    //   { $set: { age: newAge } }
    // );

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        $set: { age: newAge },
      },
      {
        new: true,
      }
    );
    console.log(contact);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Remove Contact
const removeContact = async id => {
  try {
    // const result = await Contact.deleteOne({ _id: id });
    // console.log(result);

    const removedContact = await Contact.findByIdAndRemove(id);
    console.log(removedContact);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// removeContact('6475d84385a050334f8766ad');

// updateContact('6475d84385a050334f8766ac', 18);

// getContacts();

// createManyContacts([
//   {
//     fullName: 'John Doe',
//     email: 'John@gmail.com',
//     phone: '111-111-1111',
//     age: 25,
//   },
//   {
//     fullName: 'Jane Doe',
//     email: 'jane@gmail.com',
//     phone: '222-222-2222',
//     age: 15,
//   },
//   { fullName: 'Sam Smtih', email: 'sam@gmail.com', age: 25 },
// ]);

// createContact({
//   fullName: 'Jane Doe',
//   email: 'jane@gmail.com',
//   age: 15,
// });
