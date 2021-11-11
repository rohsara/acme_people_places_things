const Sequelize = require('sequelize');
const { STRING } = Sequelize.DataTypes;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_place_things')

const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
};

const Person = db.define('person', {
    name: {
        type: STRING,
        unique: true
    }
})

const Place = db.define('place', {
    name: {
        type: STRING,
        unique: true
    }
})

const Thing = db.define('thing', {
    name: {
        type: STRING,
        unique: true
    }
})

const Souvenir = db.define('souvenir', {

})

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

const syncAndSeed = async() => {
    await db.sync( { force: true });
    const [moe, larry, lucy, ethyl] = await Promise.all(
        data.people.map( name => Person.create({name}))
    )
    const [paris, nyc, chicago, london] = await Promise.all(
        data.places.map( name => Place.create({name}))
    )
    const [foo, bar, bazz, quq] = await Promise.all(
        data.things.map( name => Thing.create({name}))
    )
    
    console.log('synced and seeded')

    await Promise.all([
        Souvenir.create({ personId: moe.id, placeId: london.id, thingId: foo.id}),
        Souvenir.create({ personId: moe.id, placeId: nyc.id, thingId: bar.id}),
        Souvenir.create({ personId: ethyl.id, placeId: nyc.id, thingId: quq.id})
    ])
}

module.exports = {
    syncAndSeed,
    model:{
        Person,
        Place,
        Thing,
        Souvenir
    }
}