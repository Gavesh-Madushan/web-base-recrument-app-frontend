// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

import { Box, Container, Divider, Grid, Link, Typography } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { gridSpacing } from "../../store/constants";
import { useTheme } from "@mui/material/styles";
import site_landing_light from "../../assets/images/site_landing_light.png";
import site_landing_dark from "../../assets/images/site_landing_dark.png";

const AuthFooter = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: theme.palette.background.footer,
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
          justifyContent={{
            lg: "flex-start",
            md: "flex-start",
            sm: "center",
            xs: "center",
          }}
          alignItems={{
            lg: "center",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          sx={{ marginY: 3 }}
        >
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Link href="/" underline="none">
              <Box
                component="img"
                alt=""
                src={
                  theme.palette.mode === "light"
                    ? site_landing_light
                    : site_landing_dark
                }
                sx={{ height: 150 }}
              />
            </Link>
          </Grid>
          {/* <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Grid container direction="row" justifyContent="flex-end" alignItems="center"
                              spacing={gridSpacing}>
                            <Grid item>
                                <Link href="#" underline="hover">
                                    <Typography variant="subtitle1" color="primary">Privacy Policy</Typography>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" underline="hover">
                                    <Typography variant="subtitle1" color="primary">Terms</Typography>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid> */}
        </Grid>
        <Divider sx={{ borderColor: "background.paper" }} />
        <Grid
          container
          spacing={2}
          direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
          justifyContent={{
            lg: "flex-start",
            md: "flex-start",
            sm: "center",
            xs: "center",
          }}
          alignItems={{
            lg: "center",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          sx={{ marginY: 2 }}
        >
          <Grid
            item
            lg={6}
            md={6}
            sm={12}
            xs={12}
            textAlign={{ lg: "start", md: "start", sm: "center", xs: "center" }}
          >
            <Typography variant="h6" color="grey">
              © 2025 Copyright:{" "}
              <Link href="https://adeonatech.net" color="primary">
                Adeona Technologies PVT (LTD).
              </Link>{" "}
              All Rights Reserved.
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={gridSpacing}
            >
              <Grid item>
                <Link
                  href="https://www.facebook.com/adeonatech/"
                  target="_blank"
                  color="primary"
                >
                  <FacebookRoundedIcon />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="https://twitter.com/adeona_tech"
                  target="_blank"
                  color="primary"
                >
                  <TwitterIcon />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="https://www.instagram.com/adeonatech/"
                  target="_blank"
                  color="primary"
                >
                  <InstagramIcon />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="https://www.linkedin.com/company/adeona-technologies/"
                  target="_blank"
                  color="primary"
                >
                  <LinkedInIcon />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthFooter;
