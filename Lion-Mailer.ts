import { MailerEngine } from './src/mailer';
import * as config from './src/config';
import { EnvValidator } from './src/env_validator';
import { SMTPValidator } from './src/smtp_validator';

async function main() {
    console.log("-----------------------------------------");
    console.log("      LION-MAILER MODERN ENGINE (TS)        ");
    console.log("-----------------------------------------");

    try {
        // Validate Environment
        await EnvValidator.validate(config);

        // Validate SMTP Accounts
        const validSmtps = await SMTPValidator.validateAccounts(config.smtp);

        if (validSmtps.length === 0) {
            console.error("\n\x1b[31m[CRITICAL] No valid SMTP accounts found. Campaign aborted.\x1b[0m");
            process.exit(1);
        }

        // Use only valid SMTPs for the campaign
        const engineConfig = { ...config, smtp: validSmtps };
        const engine = new MailerEngine(engineConfig);
        await engine.start();
    } catch (err: any) {
        console.error("FATAL ERROR during engine startup:");
        console.error(err.message || err);
        process.exit(1);
    }
}

main();
