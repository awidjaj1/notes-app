import jwt from 'jsonwebtoken';

// middleware to authorize a user
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        // status code 403: refuse to authorize the client
        if(!token) return res.status(403).send("Access Denied");
        if(token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        // if verify works (i.e. token was not tampered with), it returns the payload
        // else it throws an error
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // set the user in the req object, which can be used by following middleware
        req.user = verified;
        next();
    } catch(err){
        res.status(500).json({error: err.message});
    }
}