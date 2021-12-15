const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const Event = require('./models/event');
// const User = require('./models/user');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

// const events = eventIds => {
//     return Event.find({_id: {$in: eventIds}})
//     .then(events => {
//         return events.map(event => {
//             return {
//                 ...event._doc, 
//                 _id: event.id,
//                 creator:user.bind(this, event.creator)    
//             };
//         })
//     })
//     .catch(err => {throw err})
// };


// const user = userId => {
//     return User.findById(userId)
//                 .then(user => {
//                     return {
//                         ...user._doc, 
//                         _id: user.id,
//                         createdEvents: events.bind(this, user._doc.createdEvents)
//                     }
//                 })
//                 .catch(err => {throw err});
// }

app.use(
    '/graphql', 
    graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true    
    }),
);

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