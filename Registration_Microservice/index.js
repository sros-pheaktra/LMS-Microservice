const express = require('express')
const bcrypt = require('bcryptjs')
const dotenv =  require('dotenv')

const connectDB = require('./DBConnect')
const User = require('./schema')
dotenv.config()

const app = express()
const port = 3001
app.use(express.json())

connectDB()

app.post('/userregister', async (req, res) => {
    try {
        const {username, email, password, role, phone} = req.body

        const existingUser = await User.findOne({ email, username })
        if(existingUser){
            return res.status(409).json({
                status: 'Failture',
                message: 'User already exists'
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
            phone: phone,
        })

        await user.save()

        res.status(201).json({
            status: 'Success',
            message: 'User registered successfully'
        })

    }
    catch (error) {
        console.error(error)


        res.status(500).json({
            status: 'Failture',
            message: 'Registed failed'
        })
    }
})

app.listen(port, () => {
    console.log('Server is running at port ', port)
})