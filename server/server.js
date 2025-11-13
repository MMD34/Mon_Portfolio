const express = require('express');
const cors = require('cors');
const { db, initDatabase, USE_POSTGRES } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS configuration for production
app.use(cors({
    origin: [
        'https://mmd34.github.io',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase();

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

// Toggle featured status for a comment
app.patch('/api/comments/:id/feature', (req, res) => {
    const { id } = req.params;
    const { featured } = req.body;

    // If featured is not provided, toggle the current value
    if (featured === undefined) {
        db.get('SELECT is_featured FROM comments WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error fetching comment:', err);
                return res.status(500).json({ success: false, error: 'Failed to fetch comment' });
            }
            if (!row) {
                return res.status(404).json({ success: false, error: 'Comment not found' });
            }

            const newFeaturedValue = row.is_featured === 1 ? 0 : 1;
            updateFeaturedStatus(id, newFeaturedValue, res);
        });
    } else {
        updateFeaturedStatus(id, featured ? 1 : 0, res);
    }
});

function updateFeaturedStatus(id, featuredValue, res) {
    db.run('UPDATE comments SET is_featured = ? WHERE id = ?', [featuredValue, id], function(err) {
        if (err) {
            console.error('Error updating featured status:', err);
            res.status(500).json({ success: false, error: 'Failed to update featured status' });
        } else {
            res.json({
                success: true,
                message: `Comment ${featuredValue === 1 ? 'marked as featured' : 'unmarked as featured'}`,
                is_featured: featuredValue
            });
        }
    });
}

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
    console.log(`   - GET   /api/comments/:projectId - Get comments for a project`);
    console.log(`   - GET   /api/comments/featured/all - Get featured comments`);
    console.log(`   - GET   /api/stats/:projectId - Get project statistics`);
    console.log(`   - GET   /api/stats - Get all projects statistics`);
    console.log(`   - POST  /api/comments - Add a new comment`);
    console.log(`   - PATCH /api/comments/:id/feature - Toggle featured status`);
    console.log(`   - GET   /api/health - Health check\n`);
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
