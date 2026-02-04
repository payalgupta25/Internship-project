const { MongoClient } = require('mongodb');
const fs = require('fs');

// Load .env.production manually to avoid adding a dependency
let env = {};
try {
  const content = fs.readFileSync('.env.production', 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) {
      env[m[1]] = m[2].replace(/^"|"$/g, '');
    }
  });
} catch (e) {
  // ignore if file not found
}

process.env = { ...process.env, ...env };

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env.production');
    process.exit(2);
  }

  console.log('Testing MongoDB connection...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('MongoDB connection successful');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message || err);
    process.exit(1);
  }
}

test();
