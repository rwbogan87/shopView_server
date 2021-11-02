const router = require("express").Router();
const { UserModel } = require("../models")
const { UniqueConstraintError } = require("sequelize/lib/errors")

router.post('/signup', async (req, res) => {
    let { email, password } = req.body.user;
    try {
        const User = await UserModel.create({
            email,
            password
        })
        res.status(201).json({
            message: `${email} successfully registered`,
            user: User
        });
    }
    catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: `Error: ${email} already in use`
            })
        }
        else {
            res.status(500).json({
                message: `Error registering user: ${email}`,
                err: error
            })
        }
    }
})

//! rwb
router.post('/login', async (req, res) => {
    let { email, password } = req.body.user

    try {
        const userSuccess = await UserModel.findOne({
            where: {
                email: email
            }
        })
        if (userSuccess) {
            res.status(200).json({
                message: `${email} successfully logged in`,
                user: userSuccess
            })
        } else {
            res.status(401).json({
                message: "Error with provided email and password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: `Error logging in user: ${email}`,
            err: error
        })
    }
})

module.exports = router