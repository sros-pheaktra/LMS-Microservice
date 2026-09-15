require('dotenv').config()

const express = require('express')
const httpProxy = require('http-proxy')

const { authenticate, authorize } = require('./middleware/auth')

const app = express()
const port = 4000

const proxy = httpProxy.createProxyServer()


// ===============================
// Registration Microservice
// ===============================
app.use('/register', (req, res) => {
    console.log("API Gateway - Register")

    proxy.web(req, res, {
        target: 'http://localhost:3001'
    })
})


// ===============================
// Authentication Microservice
// ===============================
app.use('/auth', (req, res) => {
    console.log("API Gateway - Auth")

    proxy.web(req, res, {
        target: 'http://localhost:3002'
    })
})


// ===============================
// Admin Microservice
// ADMIN ONLY
// ===============================
app.use(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    (req, res) => {
        console.log("API Gateway - Admin")

        proxy.web(req, res, {
            target: 'http://localhost:3003'
        })
    }
)


// ===============================
// User Microservice
// USER ONLY
// ===============================
app.use(
    '/user',
    authenticate,
    authorize('USER'),
    (req, res) => {
        console.log("API Gateway - User")
        req.headers['x-user-id'] = req.user.userId
        proxy.web(req, res, {
            target: 'http://localhost:3004'
        })
    }
)


// ===============================
// Start Gateway
// ===============================
app.listen(port, () => {
    console.log(`API Gateway is running: http://localhost:${port}`)
})