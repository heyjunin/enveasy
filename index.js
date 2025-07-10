const readline = require('readline-sync');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
    console.log(`
${description}...`);
    try {
        const output = execSync(command, { stdio: 'inherit' });
        console.log('Command executed successfully.');
        return output;
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

function setupNeon() {
    console.log('\n--- Setting up Neon Postgres ---');
    const useDefaults = readline.keyInYNStrict('Do you want to use default settings for Neon (skip prompts)?');
    let neonCommand = 'npx neondb';

    if (useDefaults) {
        neonCommand += ' --yes';
    } else {
        const seedFile = readline.question('Enter path to SQL seed file (optional, leave blank to skip): ');
        if (seedFile) {
            neonCommand += ` --seed ${seedFile}`;
        }
        const envPath = readline.question('Enter path to .env file (default: ./.env): ');
        if (envPath) {
            neonCommand += ` --env ${envPath}`;
        }
        const envKey = readline.question('Enter environment variable key for connection string (default: DATABASE_URL): ');
        if (envKey) {
            neonCommand += ` --key ${envKey}`;
        }
    }
    runCommand(neonCommand, 'Running Neon CLI to provision database');
    console.log('Neon setup complete. Check your .env file for credentials.');
}

function setupUpstashRedis() {
    console.log('\n--- Setting up Upstash Redis ---');

    const authMethod = readline.keyInSelect(['Login with email/API key', 'Use environment variables (UPSTASH_EMAIL, UPSTASH_API_KEY)'], 'How do you want to authenticate with Upstash?');

    if (authMethod === 0) { // Login with email/API key
        console.log('Please log in to Upstash. You will be prompted for your email and API key.');
        runCommand('upstash auth login', 'Logging in to Upstash');
    } else if (authMethod === 1) { // Use environment variables
        console.log('Assuming UPSTASH_EMAIL and UPSTASH_API_KEY are set in your environment.');
    } else {
        console.log('Authentication cancelled. Skipping Upstash Redis setup.');
        return;
    }

    const dbName = readline.question('Enter a name for your Redis database: ');
    const region = readline.question('Enter the region for your Redis database (e.g., eu-west-1, us-central1): ');

    const upstashCommand = `upstash redis create --name=${dbName} --region=${region} --json`;
    console.log('Creating Upstash Redis database...');
    const output = execSync(upstashCommand).toString();
    const dbDetails = JSON.parse(output);

    const envFilePath = readline.question('Enter the path to your .env file to save Redis credentials (default: ./.env): ');
    const finalEnvPath = envFilePath || path.join(process.cwd(), '.env');

    let envContent = '';
    if (fs.existsSync(finalEnvPath)) {
        envContent = fs.readFileSync(finalEnvPath, 'utf8');
    }

    const redisEnvVars = `\nUPSTASH_REDIS_URL=redis://${dbDetails.password}@${dbDetails.endpoint}:${dbDetails.port}\nUPSTASH_REDIS_REST_TOKEN=${dbDetails.rest_token}`;
    fs.writeFileSync(finalEnvPath, envContent + redisEnvVars);

    console.log('Upstash Redis setup complete. Credentials saved to your .env file.');
    console.log('Redis Endpoint:', dbDetails.endpoint);
    console.log('Redis Port:', dbDetails.port);
    console.log('Redis Password:', dbDetails.password);
    console.log('Redis REST Token:', dbDetails.rest_token);
}

async function main() {
    console.log('Welcome to the Database Setup CLI!');

    const setupChoice = readline.keyInSelect(['Neon Postgres', 'Upstash Redis', 'Both'], 'Which database do you want to set up?');

    if (setupChoice === 0) {
        setupNeon();
    } else if (setupChoice === 1) {
        setupUpstashRedis();
    }
    else if (setupChoice === 2) {
        setupNeon();
        setupUpstashRedis();
    } else {
        console.log('No database setup selected. Exiting.');
    }

    console.log('\nSetup process finished.');
}

main();