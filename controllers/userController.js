const router = require("express").Router();
const { UserModel } = require("../models")
const { UniqueConstraintError } = require("sequelize/lib/errors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post('/signup', async (req, res) => {
    let { email, password } = req.body.user;
    try {
        const User = await UserModel.create({
            email,
            password: bcrypt.hashSync(password, 13)
        })

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

        res.status(201).json({
            message: `${email} successfully registered`,
            user: User,
            sessionToken: token
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

router.post('/login', async (req, res) => {
    let { email, password } = req.body.user

    try {
        const userSuccess = await UserModel.findOne({
            where: {
                email: email
            }
        })
        if (userSuccess) {
            let passwordCompare = await bcrypt.compare(password, userSuccess.password)

            if (passwordCompare) {
                let token = jwt.sign({ id: userSuccess.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
                res.status(200).json({
                    message: `${email} successfully logged in`,
                    user: userSuccess,
                    sessionToken: token
                })
            } else {
                res.status(401).json({
                    message: "Error with provided email or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Error with provided email or password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: `Error logging in user: ${email}`,
            err: error
        })
    }
})

router.put('/update/:userId', async (req, res) => {
    console.log(req.body.user)
    let { email, password } = req.body.user

    const query = {
        where: {
            id: req.params.userId
        }
    }

    const updatedUser = {
        email: email,
        password: password
    }

    try {
        const updateSuccess = await UserModel.update(updatedUser, query)
        res.status(200).json(updateSuccess);
    } catch (error) {
        res.status(500).json({
            err: error
        })
    }
})

module.exports = router