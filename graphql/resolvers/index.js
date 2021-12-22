const authResolver = require('./auth');
const bookingResolver = require('./booking.resolver');
const eventREsolver = require('./event.resolver');

const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...eventREsolver
};

module.exports = rootResolver;