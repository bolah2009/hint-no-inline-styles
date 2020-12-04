const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

// Generate i18n.import.ts
const i18nFile = path.join(cwd, 'src', '_locales', 'en', 'messages.json');
const packageJSON = require(path.join(cwd, 'package.json'));

const messages = require(i18nFile);
const rxValidKey = /^[_a-zA-Z0-9]+$/;
const filename = path.join(cwd, 'src', 'i18n.import.ts');
const content = `// autogenerated by scripts/create-i18n.js
import { getMessage as getMessageGlobal } from '${packageJSON.name === '@hint/utils-i18n' ? './get-message' : '@hint/utils-i18n'}';
export type MessageName =
${
    Object.keys(messages).map((name) => {
        if (!rxValidKey.test(name)) {
            throw new Error(`Localization keys must match ${rxValidKey}. Found '${name}'.`);
        }

        return `    '${name}'`;
    })
        .join(' |\n')
};
export const getMessage = (message: MessageName, language: string, substitutions?: string | string[]) => {
    const options = {
        language,
        substitutions
    };

    return getMessageGlobal(message, __dirname, options);
};
`;

fs.writeFile(filename, content, (err) => {
    if (err) {
        throw err;
    } else {
        console.log(`Created: ${filename} `);
    }
});
