const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Member, Attendee, Image} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Op} = require('sequelize');
const e = require('express');

const router = express.Router();

router.delete('/:imageId', requireAuth,async (req,res) => {
    const img = await Image.findOne({
        where:{
            id:parseInt(req.params.imageId)
        }
    });
    if(img){
        const event = await Event.findByPk(img.eventId);
        const group = await Group.findByPk(event.groupId);
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
            await img.destroy();
            res.json({message:"Successfully deleted"});
        }else{
            res.status(403);
            res.json({message:"Neccessary role not assigned. Must be Organizer or Co-host of the group"});
        }

    }else{
        res.status(404);
        res.json({message:"Event Image couldn't be found"});
    }
})

module.exports = router;
