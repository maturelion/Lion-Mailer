import { MailerEngine } from './src/mailer';
import * as config from './src/config';
import { EnvValidator } from './src/env_validator';

async function main() {
    console.log("-----------------------------------------");
    console.log("      LION-MAILER MODERN ENGINE (TS)        ");
    console.log("-----------------------------------------");

    try {
        // Validate Environment
        EnvValidator.validate(config);

        const engine = new MailerEngine(config);
        await engine.start();
    } catch (err: any) {
        console.error("FATAL ERROR during engine startup:");
        console.error(err.message || err);
        process.exit(1);
    }
}

main();
