const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Database setup
const db = new sqlite3.Database(path.join(dbDir, 'comments.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            author_email TEXT,
            comment TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_approved INTEGER DEFAULT 1,
            is_featured INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error('Error creating comments table:', err);
        } else {
            console.log('Comments table ready');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS project_stats (
            project_id TEXT PRIMARY KEY,
            total_comments INTEGER DEFAULT 0,
            average_rating REAL DEFAULT 0,
            total_ratings INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error('Error creating project_stats table:', err);
        } else {
            console.log('Project stats table ready');
        }
    });
}

// API Routes

// Get all comments for a specific project
app.get('/api/comments/:projectId', (req, res) => {
    const { projectId } = req.params;
    const { limit = 10, offset = 0, featured = false } = req.query;

    let query = `
        SELECT id, project_id, author_name, comment, rating,
               datetime(created_at, 'localtime') as created_at, is_featured
        FROM comments
        WHERE project_id = ? AND is_approved = 1
    `;

    if (featured === 'true') {
        query += ' AND is_featured = 1';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    db.all(query, [projectId, parseInt(limit), parseInt(offset)], (err, rows) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).json({ error: 'Failed to fetch comments' });
        } else {
            res.json({ success: true, comments: rows });
        }
    });
});

// Get featured comments for homepage carousel
app.get('/api/comments/featured/all', (req, res) => {
    const { limit = 20 } = req.query;

    const query = `
        SELECT id, project_id, author_name, comment, rating,
               datetime(created_at, 'localtime') as created_at
        FROM comments
        WHERE is_approved = 1 AND is_featured = 1
        ORDER BY created_at DESC LIMIT ?
    `;

    db.all(query, [parseInt(limit)], (err, rows) => {
        if (err) {
            console.error('Error fetching featured comments:', err);
            res.status(500).json({ error: 'Failed to fetch featured comments' });
        } else {
            res.json({ success: true, comments: rows });
        }
    });
});

// Get project statistics
app.get('/api/stats/:projectId', (req, res) => {
    const { projectId } = req.params;

    db.get(`
        SELECT project_id, total_comments, average_rating, total_ratings
        FROM project_stats
        WHERE project_id = ?
    `, [projectId], (err, row) => {
        if (err) {
            console.error('Error fetching stats:', err);
            res.status(500).json({ error: 'Failed to fetch statistics' });
        } else if (!row) {
            res.json({
                success: true,
                stats: {
                    project_id: projectId,
                    total_comments: 0,
                    average_rating: 0,
                    total_ratings: 0
                }
            });
        } else {
            res.json({ success: true, stats: row });
        }
    });
});

// Add a new comment
app.post('/api/comments', (req, res) => {
    const { project_id, author_name, author_email, comment, rating } = req.body;

    // Validation
    if (!project_id || !author_name || !comment || !rating) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields'
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            error: 'Rating must be between 1 and 5'
        });
    }

    if (comment.length < 10) {
        return res.status(400).json({
            success: false,
            error: 'Comment must be at least 10 characters long'
        });
    }

    // Insert comment
    db.run(`
        INSERT INTO comments (project_id, author_name, author_email, comment, rating)
        VALUES (?, ?, ?, ?, ?)
    `, [project_id, author_name, author_email || null, comment, rating], function(err) {
        if (err) {
            console.error('Error inserting comment:', err);
            res.status(500).json({ success: false, error: 'Failed to add comment' });
        } else {
            // Update project stats
            updateProjectStats(project_id);

            res.json({
                success: true,
                message: 'Comment added successfully',
                comment_id: this.lastID
            });
        }
    });
});

// Update project statistics
function updateProjectStats(projectId) {
    db.get(`
        SELECT
            COUNT(*) as total_comments,
            AVG(rating) as average_rating,
            COUNT(rating) as total_ratings
        FROM comments
        WHERE project_id = ? AND is_approved = 1
    `, [projectId], (err, stats) => {
        if (err) {
            console.error('Error calculating stats:', err);
            return;
        }

        db.run(`
            INSERT INTO project_stats (project_id, total_comments, average_rating, total_ratings)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(project_id) DO UPDATE SET
                total_comments = excluded.total_comments,
                average_rating = excluded.average_rating,
                total_ratings = excluded.total_ratings
        `, [projectId, stats.total_comments, stats.average_rating || 0, stats.total_ratings]);
    });
}

// Get all projects stats
app.get('/api/stats', (req, res) => {
    db.all(`
        SELECT project_id, total_comments, average_rating, total_ratings
        FROM project_stats
    `, [], (err, rows) => {
        if (err) {
            console.error('Error fetching all stats:', err);
            res.status(500).json({ error: 'Failed to fetch statistics' });
        } else {
            res.json({ success: true, stats: rows });
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Comments API Server running on port ${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   - GET  /api/comments/:projectId - Get comments for a project`);
    console.log(`   - GET  /api/comments/featured/all - Get featured comments`);
    console.log(`   - GET  /api/stats/:projectId - Get project statistics`);
    console.log(`   - GET  /api/stats - Get all projects statistics`);
    console.log(`   - POST /api/comments - Add a new comment`);
    console.log(`   - GET  /api/health - Health check\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nClosing database connection...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
