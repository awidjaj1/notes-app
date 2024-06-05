import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// controllers (middleware that actually send resp) for authentication

/* REGISTER USER */
export const register = async (req, res) => {
    try{
        //frontend should pass the following args in the post req body
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // TODO: add functionality of viewedProfile and impressions
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        // save the document to the db and obtain the json data stored in the db
        // which includes timestamp and id
        const savedUser = await newUser.save();
        // set status code to 201: post req succeeded, new resource created
        // set content-type to application/json and provides the savedUser obj
        // as a JSON-formatted string in the resp body (and sends())
        res.status(201).json(savedUser);
    } catch(err){
        // set status code to 500: server has encountered an error
        res.status(500).json({error: err.message})
    }
}

/* LOGGING IN */
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        // find the user document with the matching unique email
        const user = await User.findOne({email: email});
        // set status code to 401: lack valid authentication cred for the target rescource
        if (!user) return res.status(401).json({msg: "User does not exist."});
        // compare the login pass with the stored salted+hashed pass
        // note that the salt is included in plaintext in the hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({msg: "Invalid credentials. "});
        
        // send a token (contains header, payload, and sig) that claims 
        // whoever has the token is whoever is defined by user._id
        // we don't need to share the secret key as only the server will
        // need to verify the signatures
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        // don't send the password back to the user
        delete user.password;
        res.status(200).json({token, user});

    } catch(err){
        res.status(500).json({error: err.message})
    }
}