const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const connectDB = require('./DBConnect')
const User = require('./schema')

dotenv.config() 

const app = express()
const port = 3002

app.use(express.json())


connectDB()

//Log in api
app.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Email and password are required'
            })
        }

        const user = await User.findOne({ email })

        if(!user){
            return res.status(401).json({
                status: 'Failture',
                message: 'Invalid email or password'
            })
        }


        //check password
        const passwordMatch = await bcrypt.compare(
            password, user.password
        )

        if(!passwordMatch){
            return res.status(401).json({
                status: 'Failture',
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )
        res.status(200).json({
            status: 'Success',
            message: 'Login Successful',
            token: token
        })

    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'Failture',
            message: 'Login failed'
        })
    }
})

app.listen(port, () => { 
    console.log('Server is running at port', port)
})