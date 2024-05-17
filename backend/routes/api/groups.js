//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, GroupImage, Event, EventImage, Member, Attendee} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');

const {Op} = require('sequelize');
const e = require('express');
const member = require('../../db/models/member');

const router = express.Router();

//cleared
router.get('/', async (req,res) => {
    const groups = await Group.findAll();
    let toReturn = [];
    for(let group of groups){
        let holdA = group.toJSON();
        let image = await GroupImage.findOne({
            where:{
                groupId:holdA.id,
                isPreview:true
            }
        })

        holdA.numMembers = await Member.count({
            where:{
              groupId:holdA.id,
              status:{[Op.in]:['member','co-host']}
            }
        });

        holdA.numMembers += 1;

        if(image){
            holdA.previewImage = image.url;
        }else{
            holdA.previewImage = image;
        }
        toReturn.push(holdA);
    }
    return res.json({Groups:toReturn});
});
//cleared
router.get('/current', requireAuth,async (req,res)=>{

    const {user} = req;

  let Groups = await Group.findAll({
      where:{
          organizerId:user.id
      }
  })

  let toReturn = [];

  for(let group of Groups){
    let g = group.toJSON();
    if(g){
      let numMembers = await Member.count({
        where:{
          groupId:g.id,
          status:{[Op.in]:['member','co-host']}
        }
      });
      numMembers += 1;
      const img = await GroupImage.findOne({
        where:{
          groupId:g.id,
          isPreview:true
        }
      })
      let holA;
      if(img){
        holA = {...g,numMembers, previewImage:img.url};
      }else{
        holA = {...g,numMembers, previewImage:null};
      }
      toReturn.push(holA);
    }
  }

  const memberGroups = await Member.findAll({
    where:{
      memberId:user.id,
      status:{[Op.in]:['member','co-host']}
    }
  });

  for(let memG of memberGroups){
    let g = await Group.findByPk(memG.groupId);
      if(g){
        g = g.toJSON();
        let numMembers = await Member.count({
          where:{
            groupId:g.id,
            status:{[Op.in]:['member','co-host']}
          }
        });
        numMembers += 1;
        const img = await GroupImage.findOne({
          where:{
            groupId:g.id,
            isPreview:true
          }
        })
        let holA;
        if(img){
          holA = {...g,numMembers, previewImage:img.url};
        }else{
          holA = {...g,numMembers, previewImage:null};
        }
        if(!toReturn.includes(holA)){
          toReturn.push(holA)
        }
      }
  }
  // console.log(memberGroups);

  res.json(toReturn);
});
//cleared
router.get('/:groupId', async (req, res) => {
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

    if(group){
        group = group.toJSON();

        let imagePreview = await GroupImage.findAll({
            where:{
                groupId:group.id
            }
        });

        group.numMembers = await Member.count({
            where:{
              groupId:holdA.id,
              status:{[Op.in]:['member','co-host']}
            }
        });
        group.numMembers += 1;

        group.GroupImages = imagePreview;


        group.Organizer = await User.findByPk(group.organizerId);

        group.Venues = await Venue.findAll({
            where:{
                groupId:group.id
            }
        });

        res.json(group);
    } else{
        res.statusCode = 404;
        res.json({"message": "Group couldn't be found"})
    }
})
//cleared
router.get('/:groupId/members', async (req, res) => {
    const {user} = req;
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }
    let Members = [];
    if(group){
       if(user && group.organizerId === user.id){
        let members = await Member.findAll({
            include:{
                model:User
            },
            attributes:['status'],
            where:{
                groupId:group.id
            },
            order:[
                [User, 'id', 'ASC']
            ]
        });
        for(let mem of members){
            let holder = {
                ...mem.User.toJSON()
            };
            holder.Membership = {
                status:mem.status
            }
            Members.push(holder);
        }
       }else {
        let members = await Member.findAll({
            include:{
                model:User
            },
            attributes:['status'],
            where:{
                groupId:group.id,
                status:{
                    [Op.in]:['member', 'co-host']
                }
            },
            order:[
                [User, 'id', 'ASC']
            ]
        });
        for(let mem of members){
            let holder = {
                ...mem.User.toJSON()
            };
            holder.Membership = {
                status:mem.status
            }
            Members.push(holder);
        }
       }

    res.json(Members);
    } else{
        res.statusCode = 404;
        res.json({"message": "Group couldn't be found"})
    }
})
//cleared
router.get('/:groupId/venues', requireAuth,async (req,res) => {
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }
    if(group !== null){
        const {user} = req;
        const membership = await Member.findOne({
            where:{
                groupId:group.id,
                memberId:user.id
            }
        });
        const isOrganizer = group.organizerId === user.id;
        const isCoHost = membership? membership.status === 'co-host' :false;
        if(isOrganizer || isCoHost){
            const groups = await Venue.findAll({
                where:{
                    groupId:group.id
                }
            });

            return res.json(groups);
        }else{
            res.status(403);
            res.json({message:"User must be the organizer or co-host to view this info"});
        }
    }else{
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

});
//cleared
router.get('/:groupId/events', async(req,res) => {
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId), {
            attributes:['id','name','city','state']
        });
    } catch (error) {

        res.status(404)
        return res.json({message:"Group couldn't be found"});
    }

    if(group){
        const events = await Event.findAll({
            where:{
                groupId:group.id
            }
        })
        let toReturn = [];
        for(let event of events){
            let img = await EventImage.findOne({
                where:{
                    eventId:event.id,
                    isPreview:true
                }
            });
            let venue = await Venue.findByPk(event.venueId,{
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
                previewImage: img ?img.url:null,
                Group:group,
                Venue:venue ?venue:null

            };
            toReturn.push(holdA);
        }
        res.json(toReturn);
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"})
    }
})
//cleared
router.post('/', requireAuth,async(req,res) => {
    const {user} = req;

    const {name, about, type, private, city, state} = req.body;

        try {
            const group = await Group.create({
                organizerId:user.id,
                name,
                about,
                type,
                private,
                city,
                state
            }, {validate:true})

            await group.save();
            res.status(201);
            res.json(group);
        } catch (error) {

            let errorObj = {message:'Bad Request', errors:{}}
            for(let err of error.errors){
                errorObj.errors[err.path] = err.message
            }
            res.status(400);
            res.json(errorObj);
        }
})
//cleared
router.post('/:groupId/venues', requireAuth, async (req,res) => {

    const user = req.user;
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

    if(group){
        if(group.organizerId === user.id){
            try {
                const {address, city,state, lat, lng} = req.body;
                const newVenue = await Venue.create({
                    groupId:group.id,
                    address,
                    city,
                    state,
                    lat,
                    lng
                },{validate:true});
                await newVenue.save();
                let safeVenue = {
                    id:newVenue.id,
                    groupId:newVenue.groupId,
                    address:newVenue.address,
                    city:newVenue.city,
                    state:newVenue.state,
                    lat:newVenue.lat,
                    lng:newVenue.lng
                };
                res.json(safeVenue);
            } catch (error) {
                let errorObj = {message:'Bad Request', errors:{}}
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
                    try {
                        const {address, city,state, lat, lng} = req.body;
                        const newVenue = await Venue.create({
                            groupId:group.id,
                            address,
                            city,
                            state,
                            lat,
                            lng
                        },{validate:true});
                        await newVenue.save();
                        let safeVenue = {
                            id:newVenue.id,
                            groupId:newVenue.groupId,
                            address:newVenue.address,
                            city:newVenue.city,
                            state:newVenue.state,
                            lat:newVenue.lat,
                            lng:newVenue.lng
                        };
                        res.json(safeVenue);
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
                    return res.json({message:"User does not have the valid member level"});
                }
            }else{
                res.status(403);
                return res.json({message:"User is not a member of this group"});
            }
        }
    }else{
        res.status(404);
        res.json({"message": "Group couldn't be found"})
    }

});
//cleared
router.post('/:groupId/events', requireAuth,async (req,res) => {
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }
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
                    res.status(403);
                    res.json({message:"Invalid membership level"});
                }
            }else{
                res.status(403);
                res.json({message:"User is not a member"});
            }
        }
    } else{
        res.status(400);
        res.json({message:"Group couldn't be found"});
    }
});
//cleared
router.post('/:groupId/images', requireAuth, async (req,res) => {

    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId),{
            include:{model:GroupImage}
        });
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

    const {url, preview} = req.body;

    if(group !== null){
        if(preview === true && group.GroupImages.length){
            let images = group.GroupImages;

            for(let image of images){
                if(image.isPreview){
                    let oldImage = await GroupImage.findByPk(image.id);
                    oldImage.isPreview = false;
                    await oldImage.save();
                    break;
                };
            };
        };

        try {
            let newImage = await GroupImage.create({
                url:url,
                isPreview:preview,
                groupId: group.id
            }, {validate:true});
            await newImage.save();
            res.json({...newImage.toJSON()});
        } catch (error) {
            res.json(error.errors);
        }
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"});
    }



})
//cleared
router.post('/:groupId/membership', requireAuth,async (req,res) => {
    const group = await Group.findByPk(req.params.groupId);

    if(group){
        const {user} = req;
        if(group.organizerId !== user.id){
            const checkMembrship = await Member.findOne({
                where:{
                    memberId:user.id,
                    groupId:group.id
                }
            });
            if(!checkMembrship){
                try {
                    let newMembership;
                    newMembership = await Member.create({
                        groupId:group.id,
                        memberId:user.id,
                        status:"pending"
                    }, {validate:true});
                    await newMembership.save();
                    res.json({
                        memberId:newMembership.memberId,
                        status:newMembership.status
                    });
                } catch (error) {
                    res.status
                }
            }else{
                res.status(400);
                if(checkMembrship.status === 'pending'){
                    res.json({message:"Membership has already been requested"})
                } else{
                    res.json({message:"User is already a member of the group"})
                }
            }
        }else{
            res.status(403);
            res.json({message:"User is the organizer/owner of the group!"})
        }
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"})
    }
});
//cleared
router.put('/:groupId', requireAuth,async (req,res)=> {
    const {user} = req;

    const {name, about, type, private, city, state} = req.body;
        let group = await Group.findByPk(req.params.groupId);
        if(group && group.organizerId === user.id){
            try {
                if(!!name) group.name = name;
                if(!!about) group.about = about;
                if(!!type) group.type = type;
                if(private !== undefined) group.private = private;
                if(!!city) group.city = city;
                if(!!state) group.state = state;

                await group.validate();
                await group.save();

                res.json({...group.toJSON()})
            } catch (error) {
                let errorObj = {message:'Bad Request', errors:{}}
                for(let err of error.errors){
                    errorObj.errors[err.path] = err.message
                }
                res.statusCode = 400;
                res.json(errorObj);
            }
        }else{
            if(!group){
                res.status(404);
                res.json({message:"Group couldn't be found"});
            }else{
                res.status(403);
                res.json({message:"Not the owner of this group"});
            }
        }
});
//cleared
router.put("/:groupId/membership", requireAuth,async (req,res) => {
    const {memberId, status} = req.body;
    const {user} = req;
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }
    const statusTypes = ['member', 'co-host', 'organizer']
    if(group){
        if(user.id === group.organizerId){
            const memUser = await User.findByPk(memberId);
            console.log(memUser);
            if(memUser){
                const toPromote = await Member.findOne({
                    where:{
                        groupId:group.id,
                        memberId:memUser.id
                    }
                });
                if(toPromote){
                    let isPending = toPromote.status === 'pending';
                    let isMem = toPromote.status === 'member';
                    let isCo = toPromote.status === 'co-host';
                    if(((status === 'member' && (isPending||isCo)) || (status === 'co-host' && (isPending||isMem)))){
                        toPromote.status = status;
                        await toPromote.validate();
                        await toPromote.save();
                        res.json({id:toPromote.id,groupId:group.id, memberId:memUser.id, status:toPromote.status});
                    }else {
                        res.status(400);
                        const errObj = {message:"Bad Message", errors:{}};
                        if(status === 'pending'){
                            errObj.errors['status'] = "Cannot set a user's status to pending";
                        }else{
                            errObj.errors['status'] = "Invalid status has been sent. Can only be one of these types: ['member','co-host']";
                        }
                        res.json(errObj);
                    }
                }else{
                    res.status(404);
                    res.json({message:"Membership between the user and the group does not exist"});
                }
            }else{
                res.status(400);
                res.json({
                    message:'Bad message',
                    errors:{
                        memberId:"User to promote does not exist"
                    }
                });
            }
        }else{
            const changeStatus = await Member.findOne({
                where:{
                    memberId:user.id,
                    groupId:group.id
                }
            });
            if(changeStatus && changeStatus.status === 'co-host'){
                const memUser = await User.findByPk(memberId);
            if(memUser){
                const toPromote = await Member.findOne({
                    where:{
                        groupId:group.id,
                        memberId
                    }
                });
                if(toPromote){
                    if(((status === 'member') && (toPromote.status === 'pending'))){
                        toPromote.status = status;
                        await toPromote.save();
                        res.json({id:toPromote.id,groupId:group.id, memberId:user.id, status:toPromote.status});
                    }else {
                        res.status(400);
                        const errObj = {message:"Bad Message", errors:{}};
                        if(status === 'pending'){
                            errObj.errors['status'] = "Cannot set a user's status to pending";
                        }else if(status === 'co-host'){
                            errObj.errors['status'] = "Proper status not obtained, must be an organizer of a group to make some a co-host";
                        }else if(status === 'member'){
                            errObj.errors['status'] = "User is already a member, must be pending to change";
                        }else{
                            errObj.errors['status'] = "Invalid status has been sent. Can only be one of these types: ['member']";
                        }
                        res.json(errObj);
                    }
                }else{
                    res.status(404);
                    res.json({message:"Membership between the user and the group does not exist"});
                }
            }else{
                res.status(400);
                res.json({
                    message:'Bad message',
                    errors:{
                        memberId:"User to promote does not exist"
                    }
                });
            }
            }else{
                res.status(403);
                res.json({message:'Invalid Request', errors:{user:"User is not a co-host or organizer of the group."}})
            }
        }
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"});
    }

})
//cleared
router.delete('/:groupId', requireAuth,async (req,res)=> {
    const {user} = req;

    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

    if(group && group.organizerId === user.id){
        try {

            await group.destroy();

            res.json({message:"Successfully deleted"});
        } catch (error) {
            let errorObj = {message:'Bad Request', errors:{}}
            for(let err of error.errors){
                errorObj.errors[err.path] = err.message
            }
            res.statusCode = 400;
            res.json(errorObj);
        }
    }else{
        if(!group){
            res.status(404);
            res.json({message:"Group couldn't be found"});
        }else{
            res.status(403);
            res.json({message:"Not the owner of this group"});
        }
    };
});
//cleared
router.delete('/:groupId/membership/:memberId', requireAuth,async (req,res)=>{
    let group;

    try {
        group = await Group.findByPk(parseInt(req.params.groupId));
    } catch (error) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }
    const {user} = req;
    let {memberId} = req.params;
    if(group){
        if(group.organizerId === user.id){
            const remUser = await User.findByPk(parseInt(memberId));
            if(remUser){
                const membership = await Member.findOne({
                    where:{
                        groupId:group.id,
                        memberId:remUser.id
                    }
                });
                if(membership){
                    await membership.destroy();
                    res.json({message:"Successfully deleted membership from group"});
                } else{
                    res.status(404);
                    res.json({message:"No membership is held for the user with this group"});
                }
            }else{
                res.status(400);
                res.json({message:"Bad Message",errors:{memberId:"User couldn't be found"}});
            }
        }else if (parseInt(memberId) === user.id){
            const membership = await Member.findOne({
                where:{
                    groupId:group.id,
                    memberId:user.id
                }
            });
            if(membership){
                await membership.destroy();
                res.json({message:"Successfully deleted membership from group"});
            } else{
                res.status(404);
                res.json({message:"No membership is held for the user with this group"});
            }
        }else{
            res.status(403);
            res.json({message:"Must be organizer of group or referred user to remove from group"});
        }
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"});
    }
})

module.exports = router;
