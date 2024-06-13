import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const {userId, description, picturePath} = req.body;
        if (userId !== req.user.id){
            throw new Error("JWT doesn't match user!");
        }
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();
        
        // get all posts
        const posts = await Post.find();
        res.status(201).json(posts);
    } catch(err){
        // set status code to 409: request conflict with current state of server 
        // i.e. error creating
        res.status(409).json({message: err.message});
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        // if (userId !== req.user.id){
        //     throw new Error("JWT doesn't match user!!");
        // }
        const posts = await Post.find({userId});
        res.status(200).json(posts);
    } catch(err){
        res.status(404).json({message: err.message});
    }   
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.body;
        if (userId !== req.user.id){
            throw new Error("JWT doesn't match user!!!");
        }
        const post = await Post.findById(id);
        // undefined if user didn't like the post, o.w. true
        const isLiked = post.likes.get(userId);

        if (isLiked){
            post.likes.delete(userId);
        } else{
            post.likes.set(userId, true);
        }

        // set {new: true} option to get the new document after the update was applied
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );
        res.status(200).json(updatedPost);
    } catch(err){
        res.status(404).json({message: err.message});
    }  
}