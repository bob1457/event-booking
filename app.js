const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

const events = [];

app.use(
    '/graphql', 
    graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {            
            title: String!
            description: String
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query:RootQuery,
            mutation:RootMutation
        }
    `),
    rootValue: {
        events: () => {
            // return events;
            return Event.find()
            .then(events => {
                return events.map(event => {
                    // return {...event._doc};// this works as well. may not need to the next line
                    // return {...event._doc, _id: event._doc._id.toString()};
                    return {...event._doc, _id: event.id};
                })
            })
            .catch(err => {throw err;})
            
        },
        createEvent: (args) => {
            
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            
            return event.save()
            .then( result => {
                console.log(result);
                return {...result._doc};
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
            // events.push(event);
            // return event
        }
    },
    graphiql: true
}));

var mongoDB = 'mongodb://127.0.0.1/events-booking';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(console.log('mongodb connected...'))
.catch(err => {
    console.log('error connecting mongodb')
});

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(3300, () => {
    console.log('Express serer is running at PORT: 3300');
});