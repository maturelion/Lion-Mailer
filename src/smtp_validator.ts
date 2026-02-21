import nodemailer from 'nodemailer';
import { SMTPAccount } from './config';

export class SMTPValidator {
    /**
     * Validates a list of SMTP accounts.
     * Returns an array of valid accounts.
     */
    public static async validateAccounts(accounts: SMTPAccount[]): Promise<SMTPAccount[]> {
        console.log("\n" + "=".repeat(50));
        console.log("SMTP VALIDATOR: Verifying connections...");
        console.log("=".repeat(50));

        const validAccounts: SMTPAccount[] = [];

        for (const [index, account] of accounts.entries()) {
            const id = index + 1;
            process.stdout.write(`Testing SMTP_${id} (${account.username})... `);

            const isValid = await this.verify(account);

            if (isValid) {
                console.log("\x1b[32m[VALID]\x1b[0m");
                validAccounts.push(account);
            } else {
                console.log("\x1b[31m[INVALID]\x1b[0m");
            }
        }

        console.log("=".repeat(50));
        console.log(`VALIDATOR: Found ${validAccounts.length} / ${accounts.length} working SMTPs.`);
        console.log("=".repeat(50) + "\n");

        return validAccounts;
    }

    private static async verify(account: SMTPAccount): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            host: account.host,
            port: Number(account.port),
            secure: account.port === '465',
            auth: {
                user: account.username,
                pass: account.password
            },
            connectionTimeout: 5000 // 5 second timeout
        });

        try {
            await transporter.verify();
            return true;
        } catch (err: any) {
            return false;
        } finally {
            transporter.close();
        }
    }
}
