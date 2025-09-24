const { readFile, writeFile } = require('../models/contactUs');

const getMessages = (req, res)=>{
    try {
        const messages = readFile();

        const newMessage = {
            id: messages.length + 1,
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
        }

        messages.push(newMessage);
        writeFile(messages);

        res.status(201).json({ message: 'Message received', data: newMessage });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Error saving message' });

    }
}

module.exports = { getMessages };