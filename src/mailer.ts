import nodemailer, { SendMailOptions } from 'nodemailer';
import fs from 'fs-extra';
import path from 'path';
import Fakerator from 'fakerator';
import { parse } from 'csv-parse/sync';
import { Config, SMTPAccount } from './config';

const fakerator = Fakerator();

export interface MailerContext {
    email: string;
    email64: string;
    user: string;
    rnum: number;
    company: string;
    f_company: string;
    date: string;
    short: string | undefined;
    Name: string;
    SchoolName: string;
    TargetID: string;
    [key: string]: any; // Allow dynamic CSV columns
}

export interface Lead {
    email: string;
    data?: Record<string, string>;
}

export class MailerEngine {
    private config: Config;
    private smtpAccounts: SMTPAccount[];
    private campaign: Config['config'];
    private headers: Config['custom_headers'];
    private currentSmtpIndex: number = 0;
    private sentCount: number = 0;

    constructor(config: Config) {
        this.config = config;
        this.smtpAccounts = config.smtp;
        this.campaign = config.config;
        this.headers = config.custom_headers;
    }

    public async start(): Promise<void> {
        console.log("ENGINE: Initializing campaign...");
        const leads = await this.loadLeads();
        if (leads.length === 0) {
            console.error("ENGINE: No leads found in " + this.campaign.fileName);
            return;
        }

        console.log(`ENGINE: Found ${leads.length} leads. Starting mailer...`);

        for (const lead of leads) {
            const success = await this.sendWithRotation(lead);
            this.sentCount++;

            if (success) {
                console.log(`[SUCCESS] ${lead.email}`);
            } else {
                console.error(`[FAILED] ${lead.email}`);
                await fs.appendFile(path.join(process.cwd(), 'Lion-Mailer/Failed.txt'), lead.email + '\n');
            }

            // Pacing Logic
            if (this.sentCount % this.campaign.pauseAfter === 0) {
                console.log(`ENGINE: Pausing for ${this.campaign.pauseFor} seconds...`);
                await new Promise(resolve => setTimeout(resolve, this.campaign.pauseFor * 1000));
            } else {
                await new Promise(resolve => setTimeout(resolve, this.campaign.sleep * 1000));
            }
        }

        console.log("ENGINE: Campaign finished.");
    }

    private async loadLeads(): Promise<Lead[]> {
        const filePath = path.join(process.cwd(), this.campaign.fileName);
        if (!await fs.pathExists(filePath)) {
            console.error(`ENGINE: File not found: ${filePath}`);
            return [];
        }

        const content = await fs.readFile(filePath, 'utf-8');
        const isCsv = filePath.endsWith('.csv');

        if (isCsv) {
            try {
                const records = parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                return records.map((r: any) => {
                    // Try to find an email column
                    const emailKey = Object.keys(r).find(k => k.toLowerCase().includes('email')) || Object.keys(r)[0];
                    return {
                        email: r[emailKey],
                        data: r
                    };
                });
            } catch (err: any) {
                console.error(`ENGINE: Failed to parse CSV: ${err.message}`);
                return [];
            }
        }

        return content.split(/\r?\n/)
            .filter(line => line.trim().length > 0)
            .map(email => ({ email: email.trim() }));
    }

    private async sendWithRotation(lead: Lead): Promise<boolean> {
        const email = lead.email;
        const smtp = this.smtpAccounts[this.currentSmtpIndex];
        this.currentSmtpIndex = (this.currentSmtpIndex + 1) % this.smtpAccounts.length;

        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: Number(smtp.port),
            secure: smtp.port === '465',
            auth: {
                user: smtp.username,
                pass: smtp.password
            }
        });

        try {
            const context = this.createContext(lead);
            const htmlLetter = await this.loadTemplate('Letter', context);
            const textLetter = await this.loadTemplate('Text', context);

            const fromName = this.getRandom(this.config.message.fromName, context) || '';
            const subject = this.getRandom(this.config.message.subject, context) || '';
            const replyTo = this.getRandom(this.config.message.replyTo, context);

            const mailOptions: SendMailOptions = {
                from: fromName,
                to: email,
                subject,

                // Only send ONE of html or text if you want pure mode,
                // otherwise send both for better deliverability.
                ...(this.campaign.textLetter
                    ? { text: textLetter }
                    : { html: htmlLetter, text: textLetter }),

                headers: this.headers ?? {}
            };

            if (replyTo) {
                mailOptions.replyTo = replyTo;
            }

            await transporter.sendMail(mailOptions);
            return true;
        } catch (err: any) {
            console.error(`ENGINE Error: ${err.message}`);
            return false;
        }
    }

    private createContext(lead: Lead): MailerContext {
        const email = lead.email;
        const user = email.split('@')[0];
        // Capitalize first letter of username for 'Name'
        const name = user.charAt(0).toUpperCase() + user.slice(1).replace(/[._-]/g, ' ');

        return {
            email: email,
            email64: Buffer.from(email).toString('base64'),
            user: user,
            rnum: Math.floor(Math.random() * 90000) + 10000,
            company: fakerator.company.name(),
            f_company: fakerator.company.name(),
            date: new Date().toLocaleDateString(),
            short: this.getRandom(this.campaign.links, { email } as any), // Fallback link
            Name: name,
            SchoolName: "Institutional Pride", // Default placeholder
            TargetID: Math.random().toString(36).substring(2, 10).toUpperCase(),
            ...lead.data // Overwrite with CSV data if present
        };
    }

    private async loadTemplate(folder: string, context: MailerContext): Promise<string> {
        const dir = path.join(process.cwd(), 'Lion-Mailer', folder);
        const files = await fs.readdir(dir);
        if (files.length === 0) return "";

        let content = await fs.readFile(path.join(dir, files[0]), 'utf-8');

        // 1. Identify all placeholders in the template: {{Variable}}
        const placeholderRegex = /{{([^}]+)}}/g;
        const matches = [...content.matchAll(placeholderRegex)];
        const templateVars = new Set(matches.map(m => m[1].trim()));

        // 2. Validate against context keys
        const missingVars: string[] = [];
        const contextKeys = new Set(Object.keys(context));

        for (const v of templateVars) {
            if (!contextKeys.has(v)) {
                missingVars.push(v);
            }
        }

        // 3. Throw comprehensive error if variables are missing
        if (missingVars.length > 0) {
            console.error("\n" + "!".repeat(60));
            console.error("TEMPLATE VALIDATION ERROR: MISSING DATA");
            console.error("!".repeat(60));
            console.error(`In template: Lion-Mailer/${folder}/${files[0]}`);
            console.error(`The following variables are missing from your CSV/Config:`);
            missingVars.forEach(v => console.error(` - {{${v}}}`));
            console.error("\nACTION REQUIRED:");
            console.error(`Add the columns [ ${missingVars.join(', ')} ] to your CSV file`);
            console.error("or define them in your environment configuration.");
            console.error("!".repeat(60) + "\n");
            throw new Error(`Template requires missing variables: ${missingVars.join(', ')}`);
        }

        // 4. Replace placeholders
        for (const [key, value] of Object.entries(context)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, String(value));
        }

        return content;
    }

    private getRandom(arr: string[] | undefined, context: MailerContext): string | undefined {
        if (!arr || arr.length === 0) return undefined;
        let val = arr[Math.floor(Math.random() * arr.length)];
        if (!val) return undefined;

        for (const [key, value] of Object.entries(context)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            val = val.replace ? val.replace(regex, String(value)) : val;
        }
        return val;
    }
}
