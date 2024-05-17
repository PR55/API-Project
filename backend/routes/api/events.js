//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Member, Attendee, Image} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Op} = require('sequelize');
const e = require('express');
const venue = require('../../db/models/venue');

const router = express.Router();

//cleared
router.get('/', async (req,res) => {
    const queryParams = {};
    let {page, size} = req.query;
    page = parseInt(page);
    size = parseInt(size);

    if(!page || page < 0 || isNaN(page)) page = 1;
    if(!size || size < 0 || isNaN(size)) size = 20;

    queryParams.limit = size;
    queryParams.offset = size * (page - 1);

    const errors = {};

    const where = {};

    let {name, type, startDate} = req.query;

    if(name){
        if(typeof name !== 'string'){
            errors.name = "Name must be a string";
        }else{
            where.name = {[Op.like]:`%${name}%`}
        }
    }

    if(type){
        if(type !== 'Online' && type !== 'In person'){
            errors.type = "Type must be 'Online' or 'In Person'";
        }else{
            where.type = type;
        }
    }

    if(startDate){
        let date = new Date(startDate);
        if(isNaN(date)){
            errors.date = "Start date must be a valid datetime. I.E: '10-20-2012' or '10-20-2012 18:30:00'";
        }else{
            where.startDate = {[Op.gte]:date}
        }
    }

    if(Object.keys(errors).length){
        res.status(400);
        return res.json({
            message:"Bad Request",
            errors:{...errors}
        })
    }

    const events = await Event.findAll({
        where,
        ...queryParams
    });
    let toReturn = [];
    for(let event of events){
        let img = await Image.findOne({
            where:{
                eventId:event.id,
                isPreview:true
            }
        });
        let group = await Group.findByPk(event.groupId, {
            attributes:['id','name','city','state']
        });
        let venue = await Venue.findByPk(event.venueId, {
            attributes:['id','city','state']
        });

        let numAttending = await Attendee.count({
            where:{
                status:{
                    [Op.in]:['attending', 'waitlist']
                },
                eventId:event.id
            }
        });

        let holdA = {
            id: event.id,
            groupId:event.groupId,
            venueId:venue ? venue.id:null,
            name:event.name,
            type:event.type,
            startDate:event.startDate,
            endDate:event.endDate,
            numAttending,
            previewImage: img ?img.imageUrl:null,
            Group:group,
            Venue:venue ?venue:null

        };

        toReturn.push(holdA);
    }

    return res.json({Events:toReturn,page,size});
});
//cleared
router.get('/:eventId', async (req,res) => {
    let event = await Event.findByPk(parseInt(req.params.eventId))

    if(event){
        let img = await Image.findAll({
            where:{
                eventId:event.id
            }
        });
        let group = await Group.findByPk(event.groupId, {
            attributes:['id','name','private','city','state']
        });
        let venue = await Venue.findByPk(event.venueId, {
            attributes:['id','address','city','state','lat','lng']
        });
        let numAttending = await Attendee.count({
            where:{
                status:{
                    [Op.in]:['attending', 'waitlist']
                },
                eventId:event.id
            }
        });
        let safeEvent = {
            id:event.id,
            groupId:group.id,
            venueId:venue?venue.id:null,
            name:event.name,
            description:event.description,
            type:event.type,
            capacity:event.capacity,
            price:event.price,
            startDate:event.startDate,
            endDate:event.endDate,
            numAttending,
            Group:group,
            Venue:venue ?venue:null,
            EventImages:img
        };
        res.json(safeEvent);
    } else{
        res.status(404);
        res.json({message:"Event couldn't be found"})
    }
});
//cleared
router.get('/:eventId/attendees', async (req,res) => {
    let eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);

    const attendanceSorter = (Attendees)=>{
        let toReturn = [];

        for(let attendee of Attendees){
            let holder = {};
            let user = attendee.User;
            holder.id = user.id;
            holder.firstName = user.firstName;
            holder.lastName = user.lastName;
            holder.Attendance = {status:attendee.status};
            toReturn.push(holder);
        }

        return toReturn;
    }

    if(event){
        const group = await Group.findByPk(event.groupId);
        const {user} = req;
        if(user){
            const isOwner = user.id === group.organizerId;
            const membership = await Member.findOne({
                where:{
                    memberId:user.id,
                    groupId:group.id
                }
            });
            const isCoHost = membership? membership.status === 'co-host':false
            if(isOwner || isCoHost){
                const attendees = await Attendee.findAll({
                    where:{
                        eventId:eventId,
                        status:{[Op.in]:['pending','waitlist','attending','co-host','host']}
                    },
                    include:{model:User}
                });
                const toReturn = attendanceSorter(attendees);
                res.json(toReturn);
            }else{
                const attendees = await Attendee.findAll({
                    where:{
                        eventId:eventId,
                        status:{[Op.in]:['waitlist','attending','co-host','host']}
                    },
                    include:{model:User}
                });
                const toReturn = attendanceSorter(attendees);
                res.json(toReturn);
            }
        }else{
            const attendees = await Attendee.findAll({
                where:{
                    eventId:eventId,
                    status:{[Op.in]:['attending','co-host','host']}
                },
                include:{model:User}
            })
            const toReturn = attendanceSorter(attendees);
            res.json(toReturn);
        }

    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }


});
//cleared
router.post('/:eventId/images', requireAuth,async(req,res)=>{
    const {preview, url} = req.body;
    const {user} = req;
    const event = await Event.findByPk(parseInt(req.params.eventId));
    if(event){
        const attendStatus = await Attendee.findOne({
            where:{
                eventId:event.id,
                userId:user.id
            }
        });
        const isAble = attendStatus ? attendStatus.status === 'host' ||
        attendStatus.status === 'co-host'||
        attendStatus.status === 'attendee': false;
        if(isAble){
            try {
                if(preview === true){
                    let oldImage = await Image.findOne({
                        where:{
                            eventId:event.id,
                            isPreview:true
                        }
                    });
                    if(oldImage){
                        oldImage.isPreview = false;
                        await oldImage.validate();
                        await oldImage.save();
                    };
                };

                const newImage = await Image.create({
                    imageUrl:url,
                    isPreview:preview,
                    eventId:event.id
                }, {validate:true});

                await newImage.save();

                const safeImage = {
                    id:newImage.id,
                    url,
                    preview
                };
                res.json(safeImage);

            } catch (error) {
                let errorObj = {message:'Bad Request', errors:{}}
                for(let err of error.errors){
                    errorObj.errors[err.path] = err.message
                }
                res.status(400);
                res.json(errorObj);
            }
        }else{
            res.status(403);
            res.json({message:'Unable to add image to event, not an Attendee, co-host, or host for the event'});
        }

    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }
});
//cleared
router.post('/:eventId/attendance', requireAuth,async(req,res) => {
    const event = await Event.findByPk(parseInt(req.params.eventId));
    const {user} = req;
    if(event){
        const attendance = await Attendee.findOne({
            where:{
                userId:user.id,
                eventId:event.id
            }
        });
        if(attendance){
            if(attendance.status === 'host'){
            res.status(403)
            res.json({message:"User is the host of the event"});
            }else{
            res.status(400)
            res.json({message:"Attendance has already been requested"});
            }
        }else{
            const attendInfo= {
                userId:user.id,
                eventId:event.id,
                status:'pending'
            };
            const attend = await Attendee.create(attendInfo,{validate:true});
            await attend.save();
            res.json({
                userId:attend.userId,
                status:attend.status
            });
        }
    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }
});
//cleared
router.put('/:eventId', requireAuth ,async (req,res)=>{
    const {user} = req;
    let event = await Event.findByPk(parseInt(req.params.eventId));
    const errors = {};
    if(event){
        const group = await Group.findByPk(event.groupId);
        const status = await Member.findOne({
            where:{
                groupId:event.groupId,
                memberId:user.id
            }
        });

        if((status && status.status === 'co-host') || group.organizerId === user.id){
            const {venueId, name, type, capacity,price,description,startDate,endDate} = req.body;
            let newVenue;
            try {
                if(venueId) newVenue = await Venue.findByPk(venueId);
                if(newVenue !== undefined){
                    if(newVenue){
                        event.venueId = venueId;
                    }else{
                        errors.venueId = "Venue does not exist"
                    }
                }
                if(name) event.name = name;
                if(type) event.type = type;
                if(capacity) event.capacity = capacity;
                if(price) event.price = price;
                if(description) event.description = description;
                if(startDate) event.startDate = startDate;
                if(endDate) event.endDate = endDate;

                if(Object.keys(errors).length){
                    res.status(400);
                    return res.json({
                        message:"Bad Request",
                        errors
                    })
                };
                await event.validate();
                await event.save();

                const safeEvent = {
                    id:event.id,
                    groupId:group.id,
                    venueId:newVenue.id,
                    name:event.name,
                    type:event.type,
                    capacity:event.capacity,
                    price:event.price,
                    description:event.description,
                    startDate:event.startDate,
                    endDate:event.endDate
                };

                res.json(safeEvent);
            } catch (error) {
                let errorObj = {message:'Bad Request', errors:{...errors}}
                for(let e of error.errors){
                    errorObj.errors[e.path] = e.message;
                }
                res.status(400);
                res.json(errorObj);
            }
        }else{
            res.status(403);
            res.json({message:"User isn't the organizer or 'co-host' of the group"});
        }

    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }

});
//cleared
router.put('/:eventId/attendance', requireAuth,async (req,res) => {
    let eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);
    if(event){
        const group = await Group.findByPk(event.groupId);
        const {user} = req;
        const isOwner = user.id === group.organizerId;
        const membership = await Member.findOne({
            where:{
                memberId:user.id,
                groupId:group.id
            }
        });
        const isCoHost = membership? membership.status === 'co-host':false
        if(isOwner || isCoHost){
            let {userId, status} = req.body;
            userId = parseInt(userId);
            const attendance = await Attendee.findOne({
                where:{
                    userId:userId,
                    eventId:event.id
                }
            });
            if(attendance){
                const countAttend = await Attendee.count({
                    where:{
                        eventId:event.id
                    }
                });
                if(status === 'attending' && countAttend < event.capacity){
                    if(attendance.status === 'pending' || attendance.status === 'waitlist'){
                        attendance.status = status;
                        await attendance.validate();
                        await attendance.save()
                        res.json({
                            id:attendance.id,
                            eventId:event.id,
                            userId:user.id,
                            status:attendance.status
                        });
                    }else{
                            res.status(400);
                            res.json({message:"User is already attending event"});
                    }
                }else{
                    if(status === 'waitlist'){
                        if(attendance.status === 'pending'){
                            attendance.status = status;
                            await attendance.validate();
                            await attendance.save()
                            res.json({
                                id:attendance.id,
                                eventId:event.id,
                                userId:user.id,
                                status:attendance.status
                            });
                        }else{
                            res.status(400);
                            res.json({message:"User is already attending or on the waitlist"});
                        }
                    }else{
                        res.status(400);
                        if(status === 'pending'){
                            res.json({message:"Cannot change an attendance status to pending"});
                        }else{
                            res.json({message:"Invalid status was sent. May be at capacity and need to apply 'waitlist'."});

                        }
                    }
                }
            }else{
                res.status(404);
                res.json({message:"Attendance between the user and the event does not exist"});
            }
        }else{
            res.status(403);
            res.json({message:"Can only be modified by Organizer or co-host of the group"});
        }
    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }
});
//cleared
router.delete('/:eventId', requireAuth,async (req,res) => {
    const {user} = req;
    const event = await Event.findByPk(parseInt(req.params.eventId));
    if(event){
        const group = await Group.findByPk(event.groupId);
        const memberStatus = await Member.findOne(
        {
            where:{
                groupId: group.id,
                memberId:user.id
            }
        });
        if((memberStatus && memberStatus.status === 'co-host') || group.organizerId === user.id){
            try {
                await event.destroy();
                res.json({message:`Successfully deleted event of id:[${req.params.eventId}]`});
            } catch (error) {
                res.status(400);
                res.json({
                    message:"Something went wrong",
                    error:error.message
                })
            }
        }else{
            res.status(403);
            res.json({message:"User is not a co-host or owner of group organizing this event"});
        }
    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }
})
//cleared
router.delete('/:eventId/attendance/:userId', requireAuth,async (req,res) => {
    let eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);
    if(event){
        const group = await Group.findByPk(event.groupId);
        const {user} = req;
        const isOwner = user.id === group.organizerId;
        const membership = await Member.findOne({
            where:{
                memberId:user.id,
                groupId:group.id
            }
        });
        let userId = parseInt(req.params.userId);
        const isUser = userId === user.id;
        if(isOwner || isUser){
            const attendance = await Attendee.findOne({
                where:{
                    userId:userId,
                    eventId:event.id
                }
            });
            if(attendance){
                await attendance.destroy();
                res.json({message:"Successfully deleted attendance from event"});
            }else{
                res.status(404);
                res.json({message:"Attendance between the user and the event does not exist"});
            }
        }else{
            res.status(403);
            res.json({message:"Can only be deleted by the organizer of the group or the user being deleted"});
        }
    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }
});

module.exports = router;
