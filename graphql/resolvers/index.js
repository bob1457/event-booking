const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return {
                ...event._doc, 
                _id: event.id,
                creator:user.bind(this, event.creator)    
            };
        })
    })
    .catch(err => {throw err})
};


const user = userId => {
    return User.findById(userId)
                .then(user => {
                    return {
                        ...user._doc, 
                        _id: user.id,
                        createdEvents: events.bind(this, user._doc.createdEvents)
                    }
                })
                .catch(err => {throw err});
}

module.exports = {
    events: () => {
        // return events;
        return Event.find() //.populate('creator')
        .then(events => {
            return events.map(event => {
                // return {...event._doc};// this works as well. may not need to the next line
                // return {...event._doc, _id: event._doc._id.toString()};
                return {
                    ...event._doc, 
                    _id: event.id,
                    creator: user.bind(this, event._doc.creator)
                };
            })
        })
        .catch(err => {throw err;})
        
    },
    createEvent: (args) => {            
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '61b7da5a56b89b783addfb1b'
        });
        let createdEVent;
        return event.save()
        .then( result => {
            createdEVent = { 
                ...result._doc, 
                password: null, _id: 
                result.id, 
                creator: user.bind(this, result._doc.creator) };
            return User.findById('61b7da5a56b89b783addfb1b')
            // console.log(result);
            // return {...result._doc};
        })
        .then(user => {
            if (!user) {
                throw new Error('User not found.');
            }
            user.createdEvents.push(event);
            user.save();
        })
        .then(result => {
            return createdEVent;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
        // events.push(event);
        // return event
    },
    createUser: args => {
        return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error('User exists already.');
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null };
      })
      .catch(err => {
        throw err;
      });
  }
}