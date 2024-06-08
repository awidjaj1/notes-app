import { useState } from "react";
import { 
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
 } from "@mui/material";
 import {
    Search,
    Message,
    DarkMode,
    lightMode,
    Notifications,
    Help,
    Menu,
    Close
 } from "@mui/icons-material";
 import { useDispatch, useSelector } from "react-redux";
 import { setMode, setLogout } from "state";
 import { useNavigate } from "react-router-dom";
 import FlexBetween from "components/FlexBetween";


const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    // to dispatch updates to the persist storage (which we setup in index.js)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    // keep track of if screen is less than 1000px
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    // use theme defined by App.js
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = `${user.firstName} ${user.lastName}`;


    return <div>navbar</div>;
};

export default Navbar;