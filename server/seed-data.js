/**
 * Seed Script - Ajoute des commentaires d'exemple
 * Pour tester le système de commentaires
 *
 * Usage: node server/seed-data.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(path.join(dbDir, 'comments.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    } else {
        console.log('Connected to database');
    }
});

// Sample comments data
const sampleComments = [
    // Restaurant Project
    {
        project_id: 'restaurant',
        author_name: 'Sophie Martin',
        author_email: 'sophie.m@example.com',
        comment: 'Interface très élégante et intuitive ! Le design est moderne et la navigation fluide. Parfait pour un restaurant haut de gamme.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'restaurant',
        author_name: 'Thomas Dubois',
        author_email: null,
        comment: 'Excellent travail sur la partie responsive. Le site s\'affiche parfaitement sur mobile et tablette. Très professionnel.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'restaurant',
        author_name: 'Marie Lefèvre',
        author_email: 'marie.l@example.com',
        comment: 'Super projet ! J\'apprécie particulièrement la section menu avec les photos des plats. Le système de réservation est bien pensé.',
        rating: 4,
        is_featured: 0
    },

    // Machina Project
    {
        project_id: 'machina',
        author_name: 'Alexandre Chen',
        author_email: 'alex.chen@example.com',
        comment: 'Application innovante ! L\'intégration de l\'IA pour l\'estimation de l\'âge est impressionnante. La précision est étonnante.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'machina',
        author_name: 'Julie Rousseau',
        author_email: null,
        comment: 'Très bonne utilisation du Machine Learning. L\'interface utilisateur est claire et l\'application répond rapidement.',
        rating: 4,
        is_featured: 1
    },
    {
        project_id: 'machina',
        author_name: 'Pierre Moreau',
        author_email: 'p.moreau@example.com',
        comment: 'Excellente démonstration de compétences en IA et développement mobile. Fonctionne parfaitement sur iOS et Android.',
        rating: 5,
        is_featured: 0
    },

    // Zephyr Password Manager
    {
        project_id: 'zephyr',
        author_name: 'Lucas Bernard',
        author_email: 'lucas.b@example.com',
        comment: 'Enfin un gestionnaire de mots de passe vraiment sécurisé et hors ligne ! Le chiffrement Argon2 + AES-256 inspire confiance.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'zephyr',
        author_name: 'Emma Petit',
        author_email: null,
        comment: 'Application indispensable pour gérer mes mots de passe en toute sécurité. L\'interface CustomTkinter est moderne et agréable.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'zephyr',
        author_name: 'Nicolas Laurent',
        author_email: 'n.laurent@example.com',
        comment: 'Très satisfait de cette application. Le générateur de mots de passe est puissant et les fonctionnalités de sécurité sont au top.',
        rating: 4,
        is_featured: 0
    },
    {
        project_id: 'zephyr',
        author_name: 'Camille Girard',
        author_email: 'camille.g@example.com',
        comment: 'Super outil ! J\'apprécie le fait qu\'il soit complètement hors ligne, mes données restent sur mon ordinateur.',
        rating: 5,
        is_featured: 1
    },

    // M'Bello Encryption
    {
        project_id: 'encryption',
        author_name: 'Antoine Mercier',
        author_email: 'a.mercier@example.com',
        comment: 'Application de chiffrement très complète ! Support de plusieurs algorithmes (AES, ChaCha20, RSA). Parfait pour sécuriser mes fichiers.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'encryption',
        author_name: 'Léa Bonnet',
        author_email: null,
        comment: 'Interface claire et professionnelle. Le chiffrement est rapide même sur de gros fichiers. Excellent travail !',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'encryption',
        author_name: 'Maxime Simon',
        author_email: 'm.simon@example.com',
        comment: 'Très impressionné par les fonctionnalités avancées : chiffrement de fichiers, de texte, génération de clés RSA. Application complète.',
        rating: 4,
        is_featured: 0
    },
    {
        project_id: 'encryption',
        author_name: 'Sarah Michel',
        author_email: 'sarah.m@example.com',
        comment: 'Outil indispensable pour protéger mes données sensibles. La documentation est claire et l\'utilisation intuitive.',
        rating: 5,
        is_featured: 1
    },
    {
        project_id: 'encryption',
        author_name: 'Julien Fournier',
        author_email: null,
        comment: 'Application professionnelle avec une excellente sécurité. Le support de ChaCha20-Poly1305 est un gros plus !',
        rating: 5,
        is_featured: 0
    }
];

// Insert sample comments
function seedDatabase() {
    console.log('\n🌱 Seeding database with sample comments...\n');

    const insertPromises = sampleComments.map((comment, index) => {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO comments (project_id, author_name, author_email, comment, rating, is_featured)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                comment.project_id,
                comment.author_name,
                comment.author_email,
                comment.comment,
                comment.rating,
                comment.is_featured
            ], function(err) {
                if (err) {
                    console.error(`❌ Error inserting comment ${index + 1}:`, err);
                    reject(err);
                } else {
                    console.log(`✅ Comment ${index + 1}/${sampleComments.length} added (${comment.project_id} - ${comment.author_name})`);
                    resolve(this.lastID);
                }
            });
        });
    });

    Promise.all(insertPromises)
        .then(() => {
            console.log('\n✨ Database seeded successfully!');
            updateAllStats();
        })
        .catch((err) => {
            console.error('\n❌ Error seeding database:', err);
            db.close();
            process.exit(1);
        });
}

// Update project stats for all projects
function updateAllStats() {
    console.log('\n📊 Updating project statistics...\n');

    const projects = ['restaurant', 'machina', 'zephyr', 'encryption'];

    const statsPromises = projects.map((projectId) => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT
                    COUNT(*) as total_comments,
                    AVG(rating) as average_rating,
                    COUNT(rating) as total_ratings
                FROM comments
                WHERE project_id = ? AND is_approved = 1
            `, [projectId], (err, stats) => {
                if (err) {
                    console.error(`❌ Error calculating stats for ${projectId}:`, err);
                    reject(err);
                } else {
                    db.run(`
                        INSERT INTO project_stats (project_id, total_comments, average_rating, total_ratings)
                        VALUES (?, ?, ?, ?)
                        ON CONFLICT(project_id) DO UPDATE SET
                            total_comments = excluded.total_comments,
                            average_rating = excluded.average_rating,
                            total_ratings = excluded.total_ratings
                    `, [projectId, stats.total_comments, stats.average_rating || 0, stats.total_ratings], (err) => {
                        if (err) {
                            console.error(`❌ Error updating stats for ${projectId}:`, err);
                            reject(err);
                        } else {
                            console.log(`✅ Stats updated for ${projectId}: ${stats.total_comments} comments, avg ${(stats.average_rating || 0).toFixed(2)} stars`);
                            resolve();
                        }
                    });
                }
            });
        });
    });

    Promise.all(statsPromises)
        .then(() => {
            console.log('\n🎉 All done! Database is ready to use.');
            displaySummary();
        })
        .catch((err) => {
            console.error('\n❌ Error updating stats:', err);
            db.close();
            process.exit(1);
        });
}

// Display summary
function displaySummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📈 SUMMARY');
    console.log('='.repeat(60));

    db.all(`
        SELECT project_id, total_comments, average_rating, total_ratings
        FROM project_stats
        ORDER BY project_id
    `, [], (err, rows) => {
        if (err) {
            console.error('Error fetching summary:', err);
        } else {
            rows.forEach(row => {
                console.log(`\n📁 ${row.project_id.toUpperCase()}`);
                console.log(`   Comments: ${row.total_comments}`);
                console.log(`   Average Rating: ${row.average_rating.toFixed(2)} ⭐`);
                console.log(`   Total Ratings: ${row.total_ratings}`);
            });

            console.log('\n' + '='.repeat(60));
            console.log('\n✅ You can now start the server with: npm run server:dev');
            console.log('🌐 Then visit: http://localhost:3000/api/stats\n');
        }

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed.\n');
            }
        });
    });
}

// Check if database already has data
db.get('SELECT COUNT(*) as count FROM comments', [], (err, row) => {
    if (err) {
        console.error('Error checking database:', err);
        db.close();
        process.exit(1);
    } else if (row.count > 0) {
        console.log(`\n⚠️  Database already contains ${row.count} comments.`);
        console.log('Do you want to add more sample comments? (This will not delete existing data)\n');

        // Auto-continue for this example
        console.log('Proceeding to add sample comments...\n');
        seedDatabase();
    } else {
        seedDatabase();
    }
});
