const { Router, request } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 8 characters')
      .isLength({ min: 8 })
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      })
    }
 
    const { email, password } = req.body

    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(400).json({ message: 'Email is used already' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword})

    await user.save()

    res.status(201).json({ message: 'User added'})

  } catch (error) {
    res.status(500).json({ message: 'Something wrong, try again' })
  }
})

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Wrong email or password'
      })
    }
  
    const { email, password } = req.body
    
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'User not found'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password, please try again'})
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h'}
    )

    res.json({ token, userId: user.id })

  } catch (error) {
    res.status(500).json({ message: 'Something wrong, try again' })
  }
})

module.exports = router
