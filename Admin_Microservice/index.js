const express = require('express')
const dotenv = require('dotenv')

const connectDB = require('./DBConnect')
const User = require('./schema')

dotenv.config()

const app = express()
const port = 3003

app.use(express.json())

connectDB()


// Search User
app.get('/searchuser', async (req, res) => {
    try {
        const { username, email } = req.query

        if (!username && !email) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Username or email is required'
            })
        }

        const user = await User.findOne({
            $or: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
            ]
        }).select('-password')

        if (!user) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User not found'
            })
        }

        res.status(200).json({
            status: 'Success',
            user
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            status: 'Failure',
            message: 'Failed to search user'
        })
    }
})


// View All Users
app.get('/viewalluser', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')

        res.status(200).json({
            status: 'Success',
            users: users
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            status: 'Failure',
            message: 'Failed to retrieve users'
        })
    }
})


// Delete User
app.delete('/deluser', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Email is required'
            })
        }

        const user = await User.findOneAndDelete({ email })

        if (!user) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User not found'
            })
        }

        res.status(200).json({
            status: 'Success',
            message: 'User deleted successfully'
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            status: 'Failure',
            message: 'Failed to delete user'
        })
    }
})


app.listen(port, () => {
    console.log(`Admin server is running at port ${port}`)
})