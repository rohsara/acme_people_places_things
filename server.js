const db = require('./db');
const { syncAndSeed, model: { Person, Place, Thing, Souvenir }} = db;

const express = require('express');
const app = express();
const html = require('html-template-tag');

app.post('/', async(req, res, next)=>{
    try{
		await Souvenir.create(req.body);
		res.redirect('/');
	}
	catch(ex){
		next(ex);
	}
})
app.get('/', async(req, res, next)=>{
    try{
        const [ people, places, things, souvenirs ] = await Promise.all([
            Person.findAll(),
            Place.findAll(),
            Thing.findAll(),
            Souvenir.findAll({
                include: [Person, Place, Thing]
            })
        ])
        
        res.send(html`<!DOCTYPE>
        <html>
            <head>
                <title>Acme Souvenirs</title>
            </head>
        <body>
        <h1>People</h1>
            <ul>
                ${people.map(person => html`
                    <li>
                        ${person.name}
                    </li>
                `)}
            </ul>
        <h1>Places</h1>
            <ul>
                ${places.map(place => html`
                    <li>
                        ${place.name}
                    </li>
                `)}
            </ul>
        <h1>Things</h1>
            <ul>
                ${things.map(thing => html`
                    <li>
                        ${thing.name}
                    </li>
                `)}
            </ul>
        <h1>Souvenirs</h1>
        <form method='POST'>
            <select name='personId'>
              ${
                people.map( person => {
                  return `
                    <option value=${person.id}>
                      ${ person.name }
                    </option>
                  `;
                })
              }
            </select>
            <select name='placeId'>
              ${
                places.map( place => {
                  return `
                    <option value=${place.id}>
                      ${ place.name }
                    </option>
                  `;
                })
              }
            </select>
            <select name='thingId'>
              ${
                things.map( thing => {
                  return `
                    <option value=${thing.id}>
                      ${ thing.name }
                    </option>
                  `;
                })
              }
            </select>
            
            <button>Create</button>
          </form>
            
            <ul>
                ${ souvenirs.map( souvenir => {
                  return `
                    <li>${ souvenir.person.name } bought a ${ souvenir.thing.name } in ${ souvenir.place.name }</li>
                  `;
                })}
                
            </ul>
        </body>
        </html>
        `);

    }
    catch(ex){
        next(ex);
    }
})

const init = async() => {
    await syncAndSeed();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};
init();