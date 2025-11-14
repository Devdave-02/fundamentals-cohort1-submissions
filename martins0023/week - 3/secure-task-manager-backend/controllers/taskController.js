const Task = require('../models/Task');
const { sanitizeString } = require('../utils/validators');

// Create Task
exports.createTask = async (req, res) => {
    // 1. Sanitize
    const title = sanitizeString(req.body.title);
    const description = sanitizeString(req.body.description);
    
    // 2. Validate
    if (!title || title.length < 3) {
        return res.status(400).json({ message: 'Title is required and must be at least 3 characters long.' });
    }

    try {
        const task = new Task({
            title,
            description,
            user: req.user.id // from auth middleware
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating task.', error: error.message });
    }
};

// Get All Tasks (respecting roles)
exports.getTasks = async (req, res) => {
    const query = {};
    // A regular user can only see their own tasks
    if (req.user.role === 'user') {
        query.user = req.user.id;
    }
    // An admin can see all tasks (no user filter needed)

    try {
        const tasks = await Task.find(query).populate('user', 'username');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching tasks.', error: error.message });
    }
};

// Delete Task (Admin only)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        
        await task.deleteOne(); // Mongoose 5+
        res.json({ message: 'Task removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting task.', error: error.message });
    }
};

const executePaginatedQuery = async (res, query, page, limit) => {
    try {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const results = await Task.find(query).populate('user', 'username').limit(limitNum).skip(skip);
        const total = await Task.countDocuments(query);

        res.json({
            data: results,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during query.', error: error.message });
    }
}

// Search Tasks
exports.searchTasks = async (req, res) => {
    const { searchTerm, page, limit } = req.body;
    
    const sanitizedTerm = sanitizeString(searchTerm);
    if (!sanitizedTerm) {
        return res.status(400).json({ message: 'Search term is required.' });
    }
    
    // Use regex for a simple "contains" search on title and description
    const searchRegex = new RegExp(sanitizedTerm, 'i');
    
    const query = {
        $or: [{ title: searchRegex }, { description: searchRegex }]
    };

    if (req.user.role === 'user') {
        query.user = req.user.id;
    }
    
    await executePaginatedQuery(res, query, page, limit);
};

// Filter Tasks
exports.filterTasks = async (req, res) => {
    const { status, page, limit } = req.body;
    
    const query = {};

    if (status && ['pending', 'completed'].includes(status)) {
        query.status = status;
    }
    
    if (req.user.role === 'user') {
        query.user = req.user.id;
    }

    await executePaginatedQuery(res, query, page, limit);
};