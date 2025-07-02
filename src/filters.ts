import LinkifyIt from 'linkify-it';
import {getDomain, parse} from 'tldts';

export const filters: any  = (message: string):string => {
    //const regex = /\b(?:https?:\/\/|www\.)\S+\.\S{2,}|\b\S+\.(?:com|co|net|org|io|gov|edu)\b/i;
    //const isLink: boolean = regex.test(message);
    return cleanSuspiciousLinks(message);
};

const linkify = new LinkifyIt();

const trustedDomains = ['discord.com', 'github.com'];
const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'grabify.link'];
const suspiciousTlds = ['tk', 'ml', 'gq', 'cf', 'xyz', 'click', 'top'];

export function cleanSuspiciousLinks(text: string): string {
    const matches = linkify.match(text);
    if (!matches) return text;

    let result = '';
    let lastIndex = 0;

    for (const match of matches) {
        const url = match.url;
        const parsed = parse(url);

        const rootDomain = getDomain(url); // e.g. "grabify.link"
        const tld = parsed.publicSuffix;   // e.g. "link"

        const isTrusted = trustedDomains.includes(rootDomain ?? '');
        const isSuspicious =
            suspiciousDomains.includes(rootDomain ?? '') || suspiciousTlds.includes(tld ?? '');

        // Append everything before this match
        result += text.slice(lastIndex, match.index);

        result += (!isTrusted && isSuspicious) ? '[suspicious link]' : url;

        lastIndex = match.lastIndex;
    }

    result += text.slice(lastIndex);
    return result;
}