const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group,Member, Image } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const member = require('../../db/models/member');

const {Op} = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

router.get('/groups', requireAuth,async (req,res)=>{

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
      const img = await Image.findOne({
        where:{
          groupId:g.id,
          isPreview:true
        }
      })
      let holA;
      if(img){
        holA = {...g,numMembers, previewImage:img.imageUrl};
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
        const img = await Image.findOne({
          where:{
            groupId:g.id,
            isPreview:true
          }
        })
        let holA;
        if(img){
          holA = {...g,numMembers, previewImage:img.imageUrl};
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


// Sign up
router.post('/', validateSignup,async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        fistName:user.firstName,
        lastName:user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});


module.exports = router;
