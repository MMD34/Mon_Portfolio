/**
 * Database Configuration
 * Automatically uses PostgreSQL if DATABASE_URL is available (Render production)
 * Falls back to SQLite for local development
 */

const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Check if PostgreSQL URL is available (production on Render)
const DATABASE_URL = process.env.DATABASE_URL;
const USE_POSTGRES = !!DATABASE_URL;

let db;

if (USE_POSTGRES) {
    console.log('📦 Using PostgreSQL database (production)');

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    db = {
        type: 'postgres',
        pool: pool,

        run: function(query, params = [], callback) {
            // Convert SQLite-style queries to PostgreSQL
            const pgQuery = query
                .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
                .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
                .replace(/ON CONFLICT\(project_id\) DO UPDATE SET/g, 'ON CONFLICT (project_id) DO UPDATE SET');

            pool.query(pgQuery, params)
                .then(result => {
                    if (callback) callback(null, result);
                })
                .catch(err => {
                    if (callback) callback(err);
                });
        },

        get: function(query, params = [], callback) {
            pool.query(query, params)
                .then(result => {
                    if (callback) callback(null, result.rows[0] || null);
                })
                .catch(err => {
                    if (callback) callback(err, null);
                });
        },

        all: function(query, params = [], callback) {
            pool.query(query, params)
                .then(result => {
                    if (callback) callback(null, result.rows);
                })
                .catch(err => {
                    if (callback) callback(err, []);
                });
        },

        close: function(callback) {
            pool.end()
                .then(() => {
                    if (callback) callback(null);
                })
                .catch(err => {
                    if (callback) callback(err);
                });
        }
    };

} else {
    console.log('📦 Using SQLite database (local development)');

    // Ensure database directory exists
    const dbDir = path.join(__dirname, 'database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const sqliteDb = new sqlite3.Database(
        path.join(dbDir, 'comments.db'),
        (err) => {
            if (err) {
                console.error('❌ Error connecting to SQLite database:', err);
            } else {
                console.log('✅ Connected to SQLite database');
            }
        }
    );

    db = {
        type: 'sqlite',
        run: (query, params, callback) => sqliteDb.run(query, params, callback),
        get: (query, params, callback) => sqliteDb.get(query, params, callback),
        all: (query, params, callback) => sqliteDb.all(query, params, callback),
        close: (callback) => sqliteDb.close(callback)
    };
}

// Initialize database tables
function initDatabase() {
    const queries = USE_POSTGRES ? [
        // PostgreSQL table creation
        `CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            project_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            author_email TEXT,
            comment TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_approved INTEGER DEFAULT 1,
            is_featured INTEGER DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS project_stats (
            project_id TEXT PRIMARY KEY,
            total_comments INTEGER DEFAULT 0,
            average_rating REAL DEFAULT 0,
            total_ratings INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ] : [
        // SQLite table creation
        `CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            author_email TEXT,
            comment TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_approved INTEGER DEFAULT 1,
            is_featured INTEGER DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS project_stats (
            project_id TEXT PRIMARY KEY,
            total_comments INTEGER DEFAULT 0,
            average_rating REAL DEFAULT 0,
            total_ratings INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    queries.forEach((query, index) => {
        db.run(query, [], (err) => {
            if (err) {
                console.error(`❌ Error creating table ${index + 1}:`, err);
            } else {
                console.log(`✅ Table ${index + 1} ready (${USE_POSTGRES ? 'PostgreSQL' : 'SQLite'})`);
            }
        });
    });
}

module.exports = { db, initDatabase, USE_POSTGRES };
