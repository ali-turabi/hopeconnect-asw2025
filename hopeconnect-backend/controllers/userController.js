const UserModel = require('../models/userModel');
const StaffModel = require('../models/staffModel');
const jwt = require('jsonwebtoken');

const UserController = {
    async signup(req, res) {
        try {
            const userId = await UserModel.createUser(req.body);
            res.status(201).json({ message: 'User registered', user_id: userId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
// In controllers/userController.js add this method to UserController
async deleteUser(req, res) {
    const targetUserId = parseInt(req.params.id);
    
    try {
        // First check if user exists
        const user = await UserModel.getUserById(targetUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await UserModel.deleteUser(targetUserId);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
},
    async login(req, res) {
        console.log("🧪 Login endpoint hit!");
        console.log("🧑‍💻 ali turabi");

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await UserModel.findUserByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, user_type: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                email: user.email,
                name: user.name,
                user_type: user.user_type
            }
        });
    },

    async updateUser(req, res) {
        const targetUserId = parseInt(req.params.id);
        const currentUserId = req.user.user_id;
        const isAdmin = req.user.user_type === 'admin';

        if (!isAdmin && currentUserId !== targetUserId) {
            return res.status(403).json({ message: 'You can only update your own profile' });
        }

        try {
            await UserModel.updateUser(targetUserId, req.body);
            res.json({ message: 'User updated' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getUserById(req, res) {
        const targetUserId = parseInt(req.params.id);
        const currentUserId = req.user.user_id;
        const isAdmin = req.user.user_type === 'admin';

        if (!isAdmin && currentUserId !== targetUserId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        try {
            const user = await UserModel.getUserById(targetUserId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createStaff(req, res) {
        try {
            const staffId = await StaffModel.createStaff(req.body);
            res.status(201).json({ message: 'Staff created', staff_id: staffId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = UserController;
