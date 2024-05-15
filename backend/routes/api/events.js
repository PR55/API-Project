//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Member, Attendee, Image} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req,res) => {
    const events = await Event.findAll({
        include:{
            model:Venue,
            attributes:['id','city','state']
        }
    });

    return res.json(events);
});

router.get('/:eventId', async (req,res) => {
    let event = await Event.findByPk(req.params.eventId, {
        include:[
            {
                model:Group,
                attributes:['id','name','private','city','state']
            },
            {
                model:Venue,
                attributes:['id','address','city','state','lat','lng']
            }
        ]
    })

    if(event){
        res.json(event);
    } else{
        res.status(404);
        res.json({message:"Event couldn't be found"})
    }
});

router.post('/:groupId', requireAuth,async (req,res) => {
    const group = await Group.findByPk(req.params.groupId);
    const {user} = req;
    const errors = {};

    if(group){
        if(group.organizerId === user.id){
            const {venueId, name, type, capacity,price,description,startDate,endDate} = req.body;
                    try {
                    let venue;
                    if(venueId)venue = await Venue.findByPk(venueId);

                    if(venue === null){
                    errors.venueId = "Venue does not exist";
                    }

                    if(Object.keys(errors).length){
                        res.status(400);
                        return res.json({
                            message:"Bad Request",
                            errors
                        })
                    }

                    const newEvent = await Event.create({
                        groupId:group.id,
                        venueId,
                        name,
                        type,
                        capacity,
                        price,
                        description,
                        startDate,
                        endDate
                    });
                    await newEvent.save();
                    const safeEvent = {
                        id:newEvent.id,
                        groupId:newEvent.groupId,
                        venueId:newEvent.venueId,
                        name:newEvent.name,
                        type:newEvent.type,
                        capacity:newEvent.capacity,
                        price:newEvent.price,
                        description:newEvent.description,
                        startDate:newEvent.startDate,
                        endDate:newEvent.startDate
                    };

                    const newHost = await Attendee.create({
                        eventId:safeEvent.id,
                        userId:user.id,
                        status:'host'
                    }, {validate:true});
                    newHost.save();

                    res.json(safeEvent);
                } catch (error) {
                    let errorObj = {message:'Bad Request', errors:{...errors}}
                        for(let err of error.errors){
                            errorObj.errors[err.path] = err.message
                        }
                        res.status(400);
                        res.json(errorObj);
                }
        }else{
            let status = await Member.findOne({
                where:{
                    groupId:group.id,
                    memberId:user.id
                }
            });
            if(status){
                if(status.status === 'co-host'){
                    const {venueId, name, type, capacity,price,description,startDate,endDate} = req.body;
                    try {
                    let venue;
                    if(venueId)venue = await Venue.findByPk(venueId);

                    if(venue === null){
                    errors.venueId = "Venue does not exist";
                    }

                    if(Object.keys(errors).length){
                        res.status(400);
                        return res.json({
                            message:"Bad Request",
                            errors
                        })
                    }

                    const newEvent = await Event.create({
                        groupId:group.id,
                        venueId,
                        name,
                        type,
                        capacity,
                        price,
                        description,
                        startDate,
                        endDate
                    });
                    await newEvent.save();
                    const safeEvent = {
                        id:newEvent.id,
                        groupId:newEvent.groupId,
                        venueId:newEvent.venueId,
                        name:newEvent.name,
                        type:newEvent.type,
                        capacity:newEvent.capacity,
                        price:newEvent.price,
                        description:newEvent.description,
                        startDate:newEvent.startDate,
                        endDate:newEvent.startDate
                    };
                    const newHost = await Attendee.create({
                        eventId:safeEvent.id,
                        userId:user.id,
                        status:'host'
                    }, {validate:true});
                    newHost.save();
                    res.json(safeEvent);
                } catch (error) {
                    let errorObj = {message:'Bad Request', errors:{...errors}}
                        for(let err of error.errors){
                            errorObj.errors[err.path] = err.message
                        }
                        res.status(400);
                        res.json(errorObj);
                }
                }else{
                    res.status(400);
                    res.json({message:"Invalid membership level"});
                }
            }else{
                res.status(400);
                res.json({message:"User is not a member"});
            }
        }
    } else{
        res.status(400);
        res.json({message:"Group couldn't be found"});
    }
});

router.post('/:eventId/image', requireAuth,async(req,res)=>{
    const {preview, url} = req.body;
    const {user} = req;
    const event = await Event.findByPk(req.params.eventId);
    if(event){
        const attendStatus = await Attendee.findOne({
            where:{
                eventId:event.id,
                userId:user.id
            }
        });
        const isAble = attendStatus.status === 'host' ||
        attendStatus.status === 'co-host'||
        attendStatus.status === 'attendee';
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
            res.status(400);
            res.json({message});
        }

    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }
})

router.patch('/:eventId', requireAuth ,async (req,res)=>{
    const {user} = req;
    const {} = req.body;
    const event = await Event.findByPk(req.params.eventId);

    if(event){
        res.json(event);
    }else{
        res.status(404);
        res.json({message:"Event couldn't be found"});
    }

})

module.exports = router;
