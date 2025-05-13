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

    async getAllStaff(req, res) {
        try {
            const staff = await StaffModel.getAllStaff();
            
            // Always return an array, even if empty
            res.json(staff || []);
        } catch (err) {
            console.error('Error in getAllStaff:', err);
            res.status(500).json({ 
                error: err.message || 'Failed to retrieve staff list'
            });
        }
    },

    // async createStaff(req, res) {
    //     try {
    //         const staffId = await StaffModel.createStaff(req.body);
    //         res.status(201).json({ message: 'Staff created', staff_id: staffId });
    //     } catch (err) {
    //         res.status(500).json({ error: err.message });
    //     }
    // },
    async createStaff(req, res) {
        try {
            // Extract all possible fields
            const { 
                name, 
                email, 
                password, 
                phone, 
                address,
                position, 
                salary, 
                hire_date 
            } = req.body;
    
            // Validate required fields
            const requiredFields = ['name', 'email', 'password', 'position', 'salary'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    error: `Missing required fields: ${missingFields.join(', ')}` 
                });
            }
    
            // Create user and staff records
            const result = await StaffModel.createStaff(
                { name, email, password, phone, address }, // User data
                { position, salary, hire_date }            // Staff data
            );
    
            res.status(201).json({ 
                message: 'Staff created successfully',
                data: {
                    user_id: result.user_id,
                    staff_id: result.staff_id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    address: result.address,
                    position: result.position,
                    salary: result.salary,
                    hire_date: result.hire_date || new Date().toISOString().split('T')[0]
                }
            });
        } catch (err) {
            console.error('Error creating staff:', err);
            
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Email already exists' });
            }
            res.status(500).json({ 
                error: err.message || 'Failed to create staff member' 
            });
        }
    },

    async getStaffById(req, res) {
        try {
            const staffId = parseInt(req.params.id);
            const staff = await StaffModel.getStaffById(staffId);
            
            if (!staff) {
                return res.status(404).json({ message: 'Staff not found' });
            }
            
            res.json(staff);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateStaff(req, res) {
        try {
            const staffId = parseInt(req.params.id);
            const { name, email, phone, address, position, salary, hire_date, is_active } = req.body;
    
            // Validate position if provided
            if (position) {
                const validPositions = ['director', 'nurse', 'social_worker', 'caregiver', 'teacher', 'accountant', 'admin'];
                if (!validPositions.includes(position)) {
                    return res.status(400).json({ error: 'Invalid position value' });
                }
            }
    
            // Validate salary if provided
            if (salary && (isNaN(salary) || salary <= 0)) {
                return res.status(400).json({ error: 'Salary must be a positive number' });
            }
    
            await StaffModel.updateStaff(
                staffId,
                { name, email, phone, address, is_active },
                { position, salary, hire_date }
            );
    
            // Fetch updated staff data to return
            const updatedStaff = await StaffModel.getStaffById(staffId);
            res.json({ 
                message: 'Staff updated successfully',
                data: updatedStaff
            });
        } catch (err) {
            console.error('Update staff error:', err);
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
   // controllers/userController.js
async getAllStaff(req, res) {
    try {
        const staff = await StaffModel.getAllStaff();
        
        // Transform data if needed
        const responseData = staff.map(staffMember => ({
            id: staffMember.staff_id,
            user_id: staffMember.user_id,
            name: staffMember.name,
            email: staffMember.email,
            position: staffMember.position,
            salary: staffMember.salary,
            hire_date: staffMember.hire_date,
            contact: {
                phone: staffMember.phone,
                address: staffMember.address
            },
            status: staffMember.user_active ? 'active' : 'inactive'
        }));
        
        res.json(responseData);
    } catch (err) {
        console.error('Controller error:', err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? {
                sqlError: err.sqlMessage,
                stack: err.stack
            } : undefined
        });
    }
},

    async deleteStaff(req, res) {
        try {
            const staffId = parseInt(req.params.id);

            // Check if staff exists
            const existingStaff = await StaffModel.getStaffById(staffId);
            if (!existingStaff) {
                return res.status(404).json({ message: 'Staff not found' });
            }

            await StaffModel.deleteStaff(staffId);
            res.json({ message: 'Staff deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = UserController;