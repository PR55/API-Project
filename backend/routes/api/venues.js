//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Member} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const member = require('../../db/models/member');

const router = express.Router();
// cleared
router.get('/:groupId', requireAuth,async (req,res) => {

    const group = await Group.findByPk(req.params.groupId);

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
            res.status(400);
            res.json({message:"User must be the organizer or co-host to view this info"});
        }
    }else{
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

});
//cleared
router.post('/:groupId', requireAuth, async (req,res) => {

    const user = req.user;
    const group = await Group.findByPk(req.params.groupId);

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
                    res.status(400);
                    return res.json({message:"User does nto have the valid member level"});
                }
            }else{
                res.status(400);
                return res.json({message:"User is not a member of this group"});
            }
        }
    }else{
        res.status(404);
        res.json({"message": "Group couldn't be found"})
    }

})
//cleared
router.patch('/:venueId', requireAuth, async (req,res) => {

    const user = req.user;
    const venue = await Venue.findByPk(req.params.venueId);
    if(venue){
    const group = await Group.findByPk(venue.groupId);
        if(group.organizerId === user.id){
            try {
                const {address, city,state, lat, lng} = req.body;
                if(address) venue.address = address;
                if(address) venue.city = city;
                if(address) venue.state = state;
                if(lat) venue.lat = lat;
                if(lng) venue.lng = lng;
                await venue.validate();
                await venue.save();
                let safeVenue = {
                    id:venue.id,
                    groupId:venue.groupId,
                    address:venue.address,
                    city:venue.city,
                    state:venue.state,
                    lat:venue.lat,
                    lng:venue.lng
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
                        if(address) venue.address = address;
                        if(address) venue.city = city;
                        if(address) venue.state = state;
                        if(lat) venue.lat = lat;
                        if(lng) venue.lng = lng;
                        await venue.validate();
                        await venue.save();
                        let safeVenue = {
                            id:venue.id,
                            groupId:venue.groupId,
                            address:venue.address,
                            city:venue.city,
                            state:venue.state,
                            lat:venue.lat,
                            lng:venue.lng
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
                    res.status(400);
                    return res.json({message:"User does nto have the valid member level"});
                }
            }else{
                res.status(400);
                return res.json({message:"User is not a member of this group"});
            }
        }
    }else{
        res.status(404);
        res.json({"message": "Venue couldn't be found"})
    }
})

module.exports = router;
