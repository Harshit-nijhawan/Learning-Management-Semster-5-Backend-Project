const Message = require("../models/Message");
const Student = require("../models/Students");

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id; // From middleware

        if (!receiverId || !content) {
            return res.status(400).json({ message: "Receiver and content are required" });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get conversation with a specific user
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId },
            ],
        }).sort({ createdAt: 1 }); // Oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get list of people the user has chatted with (Conversations)
exports.getConversations = async (req, res) => {
    try {
        const myId = req.user.id;

        // Find all distinct users involved in messages with me
        // This is a simplified approach. Ideally, use aggregation.

        const sentMessages = await Message.find({ sender: myId }).distinct("receiver");
        const receivedMessages = await Message.find({ receiver: myId }).distinct("sender");

        // Combine and unique
        const contactIds = [...new Set([...sentMessages.map(id => id.toString()), ...receivedMessages.map(id => id.toString())])];

        // Fetch user details
        const contacts = await Student.find({ _id: { $in: contactIds } })
            .select("name email role profileImage"); // Adjust fields as needed

        // For each contact, get the last message (optional but good for UI)
        const conversations = await Promise.all(contacts.map(async (contact) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender: myId, receiver: contact._id },
                    { sender: contact._id, receiver: myId },
                ],
            }).sort({ createdAt: -1 });

            return {
                ...contact.toObject(),
                lastMessage: lastMessage ? lastMessage.content : "",
                lastMessageTime: lastMessage ? lastMessage.createdAt : null,
            };
        }));

        // Sort by last message time
        conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get potential contacts (e.g., Instructors for Students, etc.)
// This helps populate the list if Chat is empty
exports.getContacts = async (req, res) => {
    try {
        const currentUser = await Student.findById(req.user.id);
        let contacts = [];

        if (currentUser.role === 'student') {
            // Fetch all instructors and admin
            const instructors = await Student.find({ role: { $in: ['instructor', 'admin'] } }).select('name role email');
            contacts = instructors;
        } else if (currentUser.role === 'instructor') {
            // Fetch all students and admin
            const students = await Student.find({ role: { $in: ['student', 'admin'] } }).select('name role email');
            contacts = students;
        } else {
            // Admin sees everyone
            contacts = await Student.find({ _id: { $ne: req.user.id } }).select('name role email');
        }

        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Server error" });
    }
};
