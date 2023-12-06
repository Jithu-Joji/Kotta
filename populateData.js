const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Cart = require('./models/cartModel');
const GroceryItem = require('./models/groceryItemModel');

// MongoDB connection setup
mongoose.connect("mongodb+srv://test:12345@cluster0.jcexqzk.mongodb.net/Project1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create sample grocery items with image URLs
async function createSampleGroceryItems() {
  try {
    const items = [
      { name: 'Apple', imageUrl: 'https://th.bing.com/th/id/OIP.5bLEGgrUJw9PXpPA3ReYBwHaGU?rs=1&pid=ImgDetMain' },
      { name: 'Banana', imageUrl: 'https://images.squarespace-cdn.com/content/v1/5a3ed64f4c326d77c53e744a/1548019757129-Z9RZRAOFJ7MXOBUE4QGG/ke17ZwdGBToddI8pDm48kMGtGj5MonXlQlAhELeIEjRZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVGcK7tbWhWmJW_hRYMmWGEqm71EdF1gzTwvvAnqrVSEsze1Z1RqLaAHWPx0CyAdPp4/Bananas.jpg' },
      { name: 'Milk', imageUrl: 'https://milma.com/storage/products//April2023//OcDXueDoR1F5XgXwaUkT.png' }, // Add the URL for the Milk image
      { name: 'Sugar', imageUrl: 'https://img.freepik.com/free-photo/world-diabetes-day-sugar-wooden-bowl-dark-surface_1150-26666.jpg?size=626&ext=jpg' }, // Add the URL for the Sugar image
      { name: 'Salt', imageUrl: 'https://www.bhf.org.uk/-/media/images/information-support/heart-matters/2022/november-2022/nutrition/salt-shaker-spilled-on-table-ss-no-exp-300x196.png?rev=c3bb1a5291c941d297864ee722f4e452&h=196&w=300&la=en&hash=F8025DC5CA5C049713BA3C127745A8FE' }, // Add the URL for the Salt image
      { name: 'Rice', imageUrl: 'https://www.vrisham.com/wp-content/uploads/2021/11/matta-rice-001.jpg' }, // Add the URL for the Rice image
      { name: 'Tomato', imageUrl: 'https://www.avtmccormick.com/wp-content/uploads/2019/12/p3.jpg' }, // Add the URL for the Vegetables image
      { name: 'Kera Oil', imageUrl: 'https://5.imimg.com/data5/ANDROID/Default/2023/1/BO/NG/SD/8821985/product-jpeg-500x500.jpg' }, // Add the URL for the Vegetables image
      // Add more sample items with image URLs as needed
    ];

    const createdItems = await GroceryItem.insertMany(items);
    console.log('Sample grocery items added to the database', createdItems);
  } catch (error) {
    console.error('Error adding sample grocery items:', error);
  }
}

// Create sample users with hashed passwords
async function saveSampleUsers() {
  try {
    const hashedPassword1 = await bcrypt.hash('q', 10); // Replace 'samplepassword1' with the actual password
    const hashedPassword2 = await bcrypt.hash('w', 10); // Replace 'samplepassword2' with the actual password

    const sampleUser1 = new User({
      email: 'q',
      password: hashedPassword1,
      userType: 'T1', // Or any user type you want to assign
      groupName: 'SampleGroup', // Assigning groupName instead of direct cart reference
    });

    const sampleUser2 = new User({
      email: 'w',
      password: hashedPassword2,
      userType: 'T2', // Assigning the user type 'T2' to sampleUser2
      groupName: 'SampleGroup', // Assigning groupName instead of direct cart reference
    });

    await sampleUser1.save();
    await sampleUser2.save();
    console.log('Sample users added to the database');
  } catch (error) {
    console.error('Error adding sample users:', error);
  }
}

// Create sample carts and link users by groupName and common cart
async function createSampleCarts() {
  try {
    const groceryItems = await GroceryItem.find({});

    const cartItems = groceryItems.slice(0, 2);

    const sharedCart = await new Cart({ groupName: 'SampleGroup', items: cartItems }).save();

    console.log('Sample carts added to the database');
  } catch (error) {
    console.error('Error adding sample carts:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Populate sample data
async function populateSampleData() {
  await createSampleGroceryItems();
  await saveSampleUsers();
  await createSampleCarts();
}

populateSampleData();
