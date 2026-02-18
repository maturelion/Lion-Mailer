import { Config } from './config';

export class EnvValidator {
    /**
     * Validates the configuration and environment variables.
     * Throws an error if critical values are missing or malformed.
     */
    public static validate(config: Config): void {
        console.log("VALIDATOR: Checking environment health...");
        const errors: string[] = [];

        // 1. Check SMTP Accounts
        if (!config.smtp || config.smtp.length === 0) {
            errors.push("No SMTP accounts configured. Check your .env file for SMTP_HOST_1, etc.");
        } else {
            config.smtp.forEach((account, index) => {
                const id = index + 1;
                if (!account.host) errors.push(`SMTP_${id}: Host is missing.`);
                if (!account.username) errors.push(`SMTP_${id}: Username is missing.`);
                if (!account.password) errors.push(`SMTP_${id}: Password is missing.`);
                if (!account.port || isNaN(Number(account.port))) {
                    errors.push(`SMTP_${id}: Port must be a valid number.`);
                }

                // Validate fromEmail
                if (!account.fromEmail || account.fromEmail.length === 0 || !account.fromEmail[0]) {
                    errors.push(`SMTP_${id}: From Email address is missing.`);
                } else if (!this.isValidEmail(account.fromEmail[0])) {
                    // Primitive check for email format, allowing placeholders
                    if (!account.fromEmail[0].includes('{{')) {
                        errors.push(`SMTP_${id}: '${account.fromEmail[0]}' is not a valid email format.`);
                    }
                }
            });
        }

        // 2. Check Campaign Config
        if (!config.config.fileName) errors.push("Campaign: Leads file name (LEADS_FILE) is missing.");

        // 3. Check Message Config
        if (config.message.subject.length === 0) errors.push("Message: At least one Subject is required.");
        if (config.message.fromName.length === 0) errors.push("Message: At least one From Name is required.");

        if (errors.length > 0) {
            console.error("\n" + "=".repeat(50));
            console.error("ENVIRONMENT VALIDATION FAILED");
            console.error("=".repeat(50));
            errors.forEach(err => console.error(` - ${err}`));
            console.error("=".repeat(50) + "\n");
            throw new Error("Critical environment configuration missing.");
        }

        console.log("VALIDATOR: [OK] Environment is healthy.");
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Strip out display name portion if present (e.g. "Name <email@site.com>")
        const actualEmail = email.includes('<') ? email.match(/<([^>]+)>/)?.[1] : email;
        return emailRegex.test(actualEmail || '');
    }
}
