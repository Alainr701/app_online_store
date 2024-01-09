const express = require('express');

const authRouter = express.Router();
const User = require('../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

authRouter.get('/user', (req, res) => {
    res.json({ user: 'admin' });
});
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        let user = new User({
            name,
            email,
            password
        })
        user.password = await bcrypt.hash(password, 8);

        user = await user.save();
        res.json(user)

    } catch (err) {
        res.status(500).send({ error: err.message });
    }

})

authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password' });
        }
        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc });// add token to response
      

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

module.exports = authRouter