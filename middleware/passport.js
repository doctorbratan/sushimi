const keys = require('../config/keys');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');
const Client = require('../models/Client');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}

const data_user = "id  login access type name place"

module.exports = passport => {

    passport.use( 'client-access',
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await Client.findById(payload.userID).select("_id phone name city street place access salle favorites");

                if (user && user.access) {
                    done(null, user)
                } else {
                    done(null, false)
                }

            } catch (err) {
                console.log(err)
            }
        })
    ),

    passport.use( 'shared-access',
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userID).select(data_user);

                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }

            } catch (err) {
                console.log(err)
            }
        })
    ),



    passport.use( 'seller-access',
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userID).select(data_user)

                if (user && user.type === "seller" && user.access || user && user.type === "admin") {
                    done(null, user)
                } else {
                    done(null, false)
                }

            } catch (err) {
                console.log(err)
            }
        })
    ),


    passport.use( 'admin-access',
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userID).select(data_user)

                if (user && user.type === "admin") {
                    done(null, user)
                } else {
                    done(null, false)
                }

            } catch (err) {
                console.log(err)
            }
        })
    )

}