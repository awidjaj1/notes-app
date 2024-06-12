import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
};

// define a "slice" of application state for authentication
export const authSlice = createSlice({
    // defines prefix of action types
    name: "auth",
    initialState,
    // define your case reducer functions
    reducers: {
        // '/key' is prepended to action type
        setMode: (state) => {
            state.mode = state.mode === "light"? "dark": "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user){
                state.user.friends = action.payload.friends;
            } else{
                console.error("user friends non-existant");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                // update the post provided by the action payload
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        }
    }
});

// export action creators/blueprints
export const {
    setMode, 
    setLogin, 
    setLogout, 
    setFriends, 
    setPosts, 
    setPost} = authSlice.actions;
// export the reducer function which uses all the reducers we defined in the slice
export default authSlice.reducer;