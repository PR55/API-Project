//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Image, Event} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');

const router = express.Router();

router.get('/', async (req,res) => {
    const groups = await Group.findAll();

    return res.json(groups);
});

router.get('/:groupId', async (req, res) => {
    let group = await Group.findByPk(req.params.groupId);

    if(group){
        group = group.toJSON();

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

router.get('/:groupId/events', async(req,res) => {
    const group = await Group.findByPk(req.params.groupId);
    if(group){
        const events = await Event.findAll({
            where:{
                groupId:group.id
            },
            include:{
                model:Venue,
                attributes:['id','city','state']
            }

        })
        res.json(events);
    }else{
        res.status(404);
        res.json({message:"Group couldn't be found"})
    }
})

router.post('/', requireAuth,async(req,res) => {
    const {user} = req;

    if(user){
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



    }else{
        res.statusCode = 400;
        res.json({message:'Not currently logged in'})
    }
})

router.post('/:groupId/image', requireAuth, async (req,res) => {

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


router.patch('/:groupId', requireAuth,async (req,res)=> {
    const {user} = req;

    if(user){
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
    }else{
        res.status(404);
        res.json({message:'Not currently logged in'});
    }
});

router.delete('/:groupId', requireAuth,async (req,res)=> {
    const {user} = req;

    if(user){
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
        }
    }else{
        res.status(404);
        res.json({message:'Not currently logged in'});
    }
});

module.exports = router;
