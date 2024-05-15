const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

router.get('/groups', async (req,res)=>{

    const {user} = req;

    if(user){
      const authUser = await User.findByPk(user.id);

      if(authUser !== null){

        let Groups = await Group.findAll({
            where:{
                organizerId:authUser.id
            }
        })

        const memberGroups = await authUser.getGroups();

        for(let g of memberGroups){
            if(!Groups.includes(g)){
                Groups.push(g)
            }
        }

        Groups.concat(memberGroups);

        res.json(Groups);
      }else{
        res.status(400);
        res.json({message:'User does not exist'})
      }
    } else{
      res.json({message:'Not currently logged in'})
    }
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
