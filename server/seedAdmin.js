const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB');

        const hashed = await bcrypt.hash('admin123', 10);

        const existingAdmin = await User.findOne({ email: 'kumarbablu74824@gmail.com' });
        if (existingAdmin) {
            existingAdmin.password = hashed;
            await existingAdmin.save();
            console.log('Admin already exists. Password forcibly updated to correct hash.');
            process.exit(0);
        }

        const adminUser = new User({
            name: "Super Admin",
            email: 'kumarbablu74824@gmail.com',
            password: hashed,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user successfully created!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
