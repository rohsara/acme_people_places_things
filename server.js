const db = require('./db');
const { syncAndSeed, model: { People, Places, Things }} = db;

const express = require('express');
const app = express();

const init = async() => {
    await syncAndSeed();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};
init();