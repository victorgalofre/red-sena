const path = require('path');

const fallback = (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
};

module.exports = fallback;
