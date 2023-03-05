const fs = rquire('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4),(err) => err ? console.error(err) : console.info(`\nData Written to ${destination}`)
    );

    const readAndAppend = (content, file) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedData = JSON.parse(data);
                parsedData.push(content);
                writeToFile(file, parseData);
                        }
        });
    };

    module.exports = {
        readFromFile,
        writeToFile,
        readAndAppend
    };