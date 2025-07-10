# Database Setup CLI

This is a command-line interface (CLI) tool designed to streamline the setup process for Neon Postgres and Upstash Redis databases.

## Features

-   **Neon Postgres Setup**: Automates the provisioning of Neon Postgres databases, with options for default settings or custom configurations (seed file, .env path, connection string key).
-   **Upstash Redis Setup**: Facilitates the creation of Upstash Redis instances, supporting authentication via email/API key login or environment variables. It also saves the generated credentials to your `.env` file.

## Installation

To use this CLI tool, you need Node.js and npm (Node Package Manager) installed on your system.

### Global Installation (Recommended for frequent use)

```bash
npm install -g enveasy
```

After global installation, you can run the CLI from any directory:

```bash
enveasy
```

### Run with npx (No global installation required)

If you prefer not to install the tool globally, you can run it directly using `npx`:

```bash
npx enveasy
```

## Usage

Once installed (globally) or run via `npx`, simply execute the command:

```bash
enveasy
```

The CLI will then guide you through the setup process, asking you to choose between setting up Neon Postgres, Upstash Redis, or both. Follow the prompts to configure your database instances.

### Neon Postgres

-   You will be asked if you want to use default settings. Choosing "yes" will skip further prompts.
-   If you choose "no", you can specify a SQL seed file, a path to your `.env` file, and the environment variable key for the connection string.

### Upstash Redis

-   You will be prompted to choose an authentication method: login with email/API key or use existing environment variables (`UPSTASH_EMAIL`, `UPSTASH_API_KEY`).
-   If you choose to log in, the CLI will run `upstash auth login`.
-   You will then be asked for a database name and region.
-   The generated Redis credentials (URL, REST Token) will be saved to your specified `.env` file (defaults to `./.env`).

## Important Notes

-   Ensure you have the `npx neondb` and `upstash` CLIs installed globally or available in your project's `node_modules` for the respective database setups to work correctly.
-   The tool will attempt to write database credentials directly into your `.env` file. Always review the changes made to your `.env` file.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the ISC License. See the `LICENSE` file for details. (Note: A `LICENSE` file is not included in the current directory, but it's good practice to mention it if one exists or will be added.)