const fs = require('fs');
const path = require('path');

const contactUsFile = path.join(__dirname, '..', 'contactUs.json');

const readFile = () => {
    if (!fs.existsSync(contactUsFile)) {
        fs.writeFileSync(contactUsFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(contactUsFile, 'utf-8'));
};

const writeFile = (data) => {
    fs.writeFileSync(contactUsFile, JSON.stringify(data, null, 2));
};

module.exports = { readFile, writeFile };
