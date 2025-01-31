import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.server.js';

export const authUser = async (req, res, next) => {
    try {
        let token;
// setting token from cookie or headers
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        console.log("Token received:", token);
// logging out if cookie doesnot exist
        if (!token) {
            return res.status(401).json({ error: "Unauthorized user - No token provided" });
        }
        // checking if the token exist in logout/collection of redis
        const isBlackListed = await redisClient.get(token);
        if(isBlackListed) {
            res.cookies('token',"");
            return res.status(401).json({ error: "Unauthorized user - user has been logout" });
        }

        //varifying the jwt token
        try {
            const decoded = jwt.verify(token, process.env.JWT_PASS);

            if (!decoded ) {
                return res.status(401).json({ error: "Unauthorized user - Invalid token payload" });
            }
            // add decoded data into the user inside the req object
            console.log('decoded: ',decoded)
            req.user = decoded;
            next();
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Token has expired" });
            } else if (jwtError.name === 'JsonWebTokenError' || jwtError.name === 'NotBeforeError'){
                return res.status(401).json({ error: "Invalid Token" });
            }
            return res.status(401).json({ error: "Unauthorized user - Invalid token" });
        }
    } catch (error) {
        console.error("Authentication Middleware Error:", error);
        return res.status(401).json({ error: "Unauthorized user" }); // Generic error message
    }
};