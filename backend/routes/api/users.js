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
    check('firstName')
      .notEmpty({checkFalsy:true})
      .withMessage('First Name is required'),
    check('lastName')
      .notEmpty({checkFalsy:true})
      .withMessage('last Name is required'),
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

// Sign up
router.post('/', validateSignup,async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    try {

      let searchForInstance = await User.findOne({
        where:{
          email
        }
      });

      console.log(searchForInstance)

      if(!searchForInstance){
        searchForInstance = await User.findOne({
          where:{
            username
          }
        });
      }else{
        searchForInstance = await User.findOne({
          where:{
            username
          }
        });
        if(searchForInstance){
          res.status(500);
        return res.json({
          "message": "User already exists",
          "errors": {
            "email": "User with that email already exists",
            "username":"User with that username already exists"
          }
        })
        }else{
          res.status(500);
        return res.json({
          "message": "User already exists",
          "errors": {
            "email": "User with that email already exists"
          }
        })
        }

      }

      console.log(searchForInstance)

      if(searchForInstance){
        res.status(500);
        return res.json({
          "message": "User already exists",
          "errors": {
            "username": "User with that username already exists"
          }
        })
      }
      const user = await User.create({ firstName, lastName, email, username, hashedPassword }, {validate:true});
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
    } catch (error) {
      res.status(400);
      res.json({message:"Bad Request", errors: error})
    }
});


module.exports = router;
