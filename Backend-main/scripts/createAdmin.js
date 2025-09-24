const mongoose = require('mongoose');
const StudentModel = require('../models/Students');
const { hashPassword } = require('../utils/passwordUtils');
const connectDb = require('../utils/db');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await connectDb();

        const adminData = {
            name: 'Admin User',
            email: 'admin@learnify.com',
            password: 'admin123',
            number: '1234567890',
            role: 'admin'
        };

        const existingAdmin = await StudentModel.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const hashedPassword = await hashPassword(adminData.password);
        adminData.password = hashedPassword;

        const admin = await StudentModel.create(adminData);
        console.log('Admin user created successfully!');
        console.log('Email:', adminData.email);
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
