if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const User = require('./models/user')
const refreshTokens = {};
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const loginRouter = require('./routes/login')
const gatePassRouter = require('./routes/gatePass')
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const SECRET = 'SECRET'
const passportOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
    const expirationDate = new Date(jwtPayload.exp * 1000)
    if(expirationDate < new Date()) {
        return done(null, false)
    }
    done(null, jwtPayload);
}))

passport.serializeUser(function (user, done) {
    done(null, user)
  });

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/api', loginRouter)
app.use('/api/gatepass', gatePassRouter)

app.get('/', (req, res) => {
    console.log('/ running')
    res.sendFile(__dirname + '/public/home.html')
})



const port = process.env.PORT || 5500
app.listen(port, () => {
    console.log('Connected to port ' + port)
})
