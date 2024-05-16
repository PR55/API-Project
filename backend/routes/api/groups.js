//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Image, Event, Member, Attendee} = require('../../db/models');

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
        let image = await Image.findOne({
            where:{
                groupId:holdA.id,
                isPreview:true
            }
        })
        if(image){
            holdA.previewImage = image.imageUrl;
        }else{
            holdA.previewImage = image;
        }
        toReturn.push(holdA);
    }
    return res.json({Groups:toReturn});
});

//allgroups joined by current user goes here

//cleared
router.get('/:groupId', async (req, res) => {
    let group = await Group.findByPk(req.params.groupId);

    if(group){
        group = group.toJSON();

        let imagePreview = await Image.findAll({
            where:{
                groupId:group.id
            }
        });

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
    let group = await Group.findByPk(req.params.groupId);
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
router.get('/:groupId/events', async(req,res) => {
    const group = await Group.findByPk(req.params.groupId, {
        attributes:['id','name','city','state']
    });
    if(group){
        const events = await Event.findAll({
            where:{
                groupId:group.id
            }
        })
        let toReturn = [];
        for(let event of events){
            let img = await Image.findOne({
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
                previewImage: img ?img.imageUrl:null,
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
router.post('/:groupId/images', requireAuth, async (req,res) => {

    let group = await Group.findByPk(req.params.groupId, {
        include:{
            model:Image
        }
    });

    const {url, preview} = req.body;

    if(group !== null){
        if(preview === true && group.Images.length){
            let images = group.Images;

            for(let image of images){
                if(image.isPreview){
                    let oldImage = await Image.findByPk(image.id);
                    oldImage.isPreview = false;
                    await oldImage.save();
                    break;
                };
            };
        };

        try {
            let newImage = await Image.create({
                imageUrl:url,
                isPreview:preview
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
router.post('/:groupId/members', requireAuth,async (req,res) => {
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
                    if(group.private){
                        newMembership = await Member.create({
                            groupId:group.id,
                            memberId:user.id,
                            status:"pending"
                        }, {validate:true});
                    }else{
                        newMembership = await Member.create({
                            groupId:group.id,
                            memberId:user.id,
                            status:"member"
                        }, {validate:true});
                    }
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
                if(group.private && checkMembrship.status === 'pending'){
                    res.json({message:"Membership has already been requested"})
                } else{
                    res.json({message:"User is already a member of the group"})
                }
            }
        }else{
            res.status(400);
            res.json({message:"User is the organizer/owner of the group!"})
        }
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"})
    }
});

//cleared
router.patch('/:groupId', requireAuth,async (req,res)=> {
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
                res.status(404);
                res.json({message:"Not the owner of this group"});
            }
        }
});

//cleared
router.patch("/:groupId/members", requireAuth,async (req,res) => {
    const {memberId, status} = req.body;
    const {user} = req;
    const group = await Group.findByPk(req.params.groupId);
    const statusTypes = ['pending', 'member', 'co-host', 'organizer']
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
                    if((status === 'member' && (toPromote.status === 'pending' || toPromote.status === 'co-host')) || (status === 'co-host' && toPromote.status === 'member')){
                        toPromote.status = status;
                        await toPromote.validate();
                        await toPromote.save();
                        res.json({id:toPromote.id,groupId:group.id, memberId:memUser.id, status:toPromote.status});
                    }else {
                        res.status(400);
                        const errObj = {message:"Bad Message", errors:{}};
                        if(status === 'pending'){
                            errObj.errors['status'] = "Cannot set a user's status to pending";
                        }else if(status === 'co-host'){
                            errObj.errors['status'] = "User must already be a member to become a co-host";
                        }else if(status === 'member'){
                            errObj.errors['status'] = "User is already a member, must be pending or co-host to change";
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
                res.status(404);
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
                    if((status === 'member' && (toPromote.status === 'pending'))){
                        toPromote.status = status;
                        await toPromote.save();
                        res.json({id:toPromote.id,groupId:group.id, memberId:user.id, status:toPromote.status});
                    }else {
                        res.status(400);
                        const errObj = {message:"Bad Message", errors:{}};
                        if(status === 'pending'){
                            errObj.errors['status'] = "Cannot set a user's status to pending";
                        }else if(status === 'co-host'){
                            errObj.errors['status'] = "Proper status not obetained, must be an organizer of a group to make some a co-host";
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
                res.status(404);
                res.json({
                    message:'Bad message',
                    errors:{
                        memberId:"User to promote does not exist"
                    }
                });
            }
            }else{
                res.status(400);
                res.json({message:'Invalid Request', errors:{user:"User is either not a co-host, organizer or is not a part of the group."}})
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

    let group = await Group.findByPk(req.params.groupId);

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
            res.status(404);
            res.json({message:"Not the owner of this group"});
        }
    };
});

//cleared
router.delete('/:groupId/members', requireAuth,async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId);
    const {user} = req;
    let {memberId} = req.body;
    if(group){
        if(group.organizerId === user.id){
            const remUser = await User.findByPk(memberId);
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
                    res.status(400);
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
                res.status(400);
                res.json({message:"No membership is held for the user with this group"});
            }
        }
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"});
    }
})

router.delete('/:groupId/images', requireAuth,async (req,res) => {
    const group = await Group.findByPk(parseInt(req.params.groupId));
    if(group){
        let {searchId} = req.query;
        if(!searchId) searchId = 1;

        const {user} = req;
        const membership = await Member.findOne({
            where:{
                groupId:group.id,
                memberId:user.id
            }
        });

        const isHost = group.organizerId === user.id;
        const isCoHost = membership?membership.status === 'co-host':false;
        if(isHost || isCoHost){
            let image = await Image.findOne({
                where:{
                    groupId:group.id
                },
                offset:parseInt(searchId)-1
            });
            if(image){
                await image.destroy();
                res.json({message:"Successfully deleted"});
            }else{
                res.status(404);
                res.json({message:"No images are associated with the group or searchId is out of range of known images"});
            }
        }else{
            res.status(404);
            res.json({message:"Neccessary role not assigned. Must be Organizer or Co-host of the group"});
        }

    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"});
    }
})

module.exports = router;
