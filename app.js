const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

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
            description: String
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
            return events;
            
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            };
console.log(args);
            events.push(event);
            return event
        }
    },
    graphiql: true
}));

app.listen(3300, () => {
    console.log('Express serer is running at PORT: 3300');
});