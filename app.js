const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/isAuthenticated');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

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


app.listen(3300, () => {
    console.log('Express serer is running at PORT: 3300');
});