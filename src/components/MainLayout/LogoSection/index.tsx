import { Link } from "react-router-dom";

// material-ui
import { Box, ButtonBase } from "@mui/material";
import site_logo_light from "../../../assets/images/site_logo_light.png";
import site_logo_dark from "../../../assets/images/site_logo_dark.png";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ theme }: any) => (
  <ButtonBase disableRipple component={Link} to="/">
    <Box
      component="img"
      alt=""
      src={theme.palette.mode === "light" ? site_logo_light : site_logo_dark}
      sx={{ height: 40 }}
    />
  </ButtonBase>
);

export default LogoSection;
