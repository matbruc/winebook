// MongoDB initialization script
// This script will create the database and restore from the dump

// Create the database
use winedb;

// Create indexes that might be needed
db.wines.createIndex({ "name": "text" });
db.producers.createIndex({ "name": "text" });
db.users.createIndex({ "email": 1 }, { unique: true });

// Note: The actual data restoration from dump should be handled separately
// This script is for schema definitions only