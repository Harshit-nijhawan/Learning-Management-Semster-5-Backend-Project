const ContactModel = require('../models/contactUs');

const getMessages = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save to MongoDB
        const newMessage = await ContactModel.create({ 
            name, 
            email, 
            message 
        });

        res.status(201).json({ 
            message: 'Message received successfully', 
            data: newMessage 
        });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getMessages };