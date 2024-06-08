import { Box } from "@mui/material";
import { styled } from "@mui/system";

// style the Box with custom css properties
const FlexBetween = styled(Box)({
    display: "flex",
    // distribute items in the flex box evenly across
    justifyContent: "space-between",
    // center vertically
    alignItems: "center"
})

export default FlexBetween;