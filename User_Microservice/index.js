const express = require('express')
const dotenv = require('dotenv')

const connectDB = require('./DBConnect')
const User = require('./schema')

dotenv.config()

const app = express()
const port = 3004

app.use(express.json())

connectDB()


app.get('/viewprofile', async (req, res) => {
    try{
        const userId = req.headers['x-user-id']
        console.log("User ID:", req.headers['x-user-id'])

        const user = await User.findById(userId).select('-password')

        res.status(200).json({
            status: "Success",
            user: user
        })
        
    }
    catch (error) {
        console.error(error)

        res.status(500).json({
            status: 'Failure',
            message: 'Failed to retrieve users'
        })
    }
    
})
app.put('/updateprofile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id']
        const { username, email, phone } = req.body

        const user = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                phone
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User not found'
            })
        }

        res.status(200).json({
            status: 'Success',
            message: 'Profile updated successfully',
            user: user
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            status: 'Failure',
            message: 'Failed to update profile'
        })
    }
})


app.listen(port, () => {
    console.log('User server is running at port 3004')
})