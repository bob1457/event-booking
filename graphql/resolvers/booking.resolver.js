// const { dataToString } = require('../../helpers/date');
const { singleEvent, user, transformBooking, transformEvent} = require('./common');
const Booking = require('../../models/booking');
const Event = require('../../models/event');



module.exports = {    
    bookings: async (args, req) => {

        if(!req.isAuth){
            throw new Error('Not authenticated');
        }

        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
                
            })
        } catch (err) {
            throw err;
        }
    },
      

    bookEvent: async (args, req) => {

        if(!req.isAuth){
            throw new Error('Not authenticated');
        }

        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
        //   user: '61b7da5a56b89b783addfb1b',
        user: req.userId,
          event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
      },

    cancelBooking: async (args, req) => {

        if(!req.isAuth){
            throw new Error('Not authenticated');
        }

        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
}