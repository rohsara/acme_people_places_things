const Sequelize = require('sequelize');
const { STRING } = Sequelize.DataTypes;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_place_things')

const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
};

const People = db.define('people', {
    title: {
        type: STRING,
        unique: true
    }
})

const Places = db.define('places', {
    title: {
        type: STRING,
        unique: true
    }
})

const Things = db.define('things', {
    title: {
        type: STRING,
        unique: true
    }
})

const syncAndSeed = async() => {
    await db.sync( { force: true });
    const people = await Promise.all(data.people.map(itm => People.create({name: itm})));
    const places = await Promise.all(data.places.map(itm => Places.create({name: itm})));
    const things = await Promise.all(data.things.map(itm => Things.create({name: itm})));
    console.log('synced and seeded')
}

module.exports = {
    syncAndSeed,
    model:{
        People,
        Places,
        Things
    }
}