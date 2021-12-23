const Event = require('../../models/event');
const { dataToString } = require('../../helpers/date');
const { user, transformEvent } = require('./common');
const User = require('../../models/user');


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            // console.log('list', events);
        
            return events.map(event => {               
                return transformEvent(event);
            });
        } catch (err) {
            throw err
        }
        
        
    },
    
    createEvent: async (args, req) => {  

        if(!req.isAuth){
            throw new Error('Not authenticated');
        }

        try {          
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '61b7da5a56b89b783addfb1b'
            // creator: req.userId
        });
        let createdEVent;
        const result = await event.save();       
            createdEVent = transformEvent(result);            
            const creator = await User.findById('61b7da5a56b89b783addfb1b')
        
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();       
        
            return createdEVent;
        } catch(error){
            throw error;
        }            
       
        // events.push(event);
        // return event
    },
    
}