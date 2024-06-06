import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        // get id from the uri params
        const {id} = req.params; 
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err){
        //set status to 404: server cannot find requested resource
        res.status(404).json({message: err.message});
    }
};

export const getUserFriends = async (req, res) => {
    try {
        // get id from the uri params
        const {id} = req.params; 
        const user = await User.findById(id);

        // store all the promises as one promise and await
        const friends = await Promise.all(
            user.friends.map((id) => user.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                // destructure and return only what client needs
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    } catch(err){
        //set status to 404: server cannot find requested resource
        res.status(404).json({message: err.message});
    }   
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        // get id from the uri params
        const {id, friendId} = req.params; 
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            // if friendId already in user's friends list, remove it
            user.friends = user.friends.filter((id) => id !== friendId);
            // also remove user's id from friend's friends list
            friend.friends = friend.friends.filter((f_id) => f_id !== id);
        } else {
            // add respective id to respective friends lists
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => user.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                // destructure and return only what client needs
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );

        // send new friends list
        res.status(200).json(formattedFriends);
    } catch(err){
        //set status to 404: server cannot find requested resource
        res.status(404).json({message: err.message});
    }
};