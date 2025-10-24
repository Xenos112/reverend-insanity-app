import fs from 'fs';
import os from 'os';
import path from 'path';

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  // Look for the first non-internal IPv4 address
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost';
}

function updateEnvFile() {
  const envPath = path.join(__dirname, '../.env');
  const localIP = getLocalIP();

  console.log(`🔍 Detected local IP: ${localIP}`);

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  let updated = false;

  // Process each line
  const updatedLines = lines.map(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      return line;
    }

    // Only update lines that contain IP addresses in their values
    // This targets variables like SERVER_IP=192.168.1.x or API_URL=http://192.168.1.x:3000
    const [key, value] = line.split('=');

    if (value && /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(value)) {
      // Replace the IP address in the value
      const newValue = value.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, localIP);
      console.log(`✅ Updated ${key.trim()}`);
      updated = true;
      return `${key}=${newValue}`;
    }

    return line;
  });

  if (updated) {
    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log('✨ .env file updated successfully!\n');
  } else {
    console.log('ℹ️  No IP addresses found to update in .env\n');
  }
}

// Run the update
updateEnvFile();
