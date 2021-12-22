const Event = require('../../models/event');
const User = require('../../models/user');
const { dataToString } = require('../../helpers/date');

const events = async eventIds => {    
    try{
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return transformEvent(event);
        });
        // return events;
    } catch(err) {
        throw err
    }
};

const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch(err){
        throw err;
    };
}

const user = async userId => {
    try{
    const user = await User.findById(userId);            
    return {
        ...user._doc, 
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
    }    
    } catch(err){
        throw err
    }                
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dataToString(booking._doc.createdAt),
        updatedAt: dataToString(booking._doc.updatedAt)
    }
}

const transformEvent = event => {
    return {
        ...event._doc, 
        _id: event.id,
        date: dataToString(event._doc.date),
        creator:user.bind(this, event.creator) 
    }
}

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

exports.user = user;
// exports.events = events;
exports.singleEvent = singleEvent;
