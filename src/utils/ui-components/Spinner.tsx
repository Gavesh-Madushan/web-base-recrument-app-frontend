import React from "react";
import CircularProgress, { circularProgressClasses, CircularProgressProps } from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { isBrowser, isTablet, isMobile } from "react-device-detect";

function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: theme.palette.grey[200],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[800],
          }),
        })}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={(theme) => ({
          animationDuration: "1600ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          ...theme.applyStyles("dark", {
            color: "#308fe8",
          }),
        })}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

const Spinner = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {isBrowser && <CircularProgress size={80} />}
      {isTablet && <CircularProgress size={60} />}
      {isMobile && <FacebookCircularProgress />}
    </Box>
  );
};

export default Spinner;
