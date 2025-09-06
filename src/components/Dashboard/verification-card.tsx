import PropTypes from "prop-types";
import SkeletonVerificationCard from "../../utils/ui-components/cards/skeleton/verification-card";
import MainCard from "../../utils/ui-components/MainCard";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Grid, Stack, Typography, useTheme } from "@mui/material";

const CardWrapper = styled(MainCard)(({ theme, color }: any) => ({
  boxShadow: `${theme.palette[color][200]} 0px 3px 6px, ${theme.palette[color][200]} 0px 3px 6px`,
  border: `1px solid ${theme.palette[color][200]}`,
  minHeight:"100%",
  color: theme.palette[color].main,
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 110,
    height: 110,
    background: theme.palette[color][200],
    borderRadius: "50%",
    top: -45,
    right: -35,
    opacity: 0.8,
    [theme.breakpoints.down("sm")]: {
      top: -85,
      right: -100,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 110,
    height: 110,
    background: theme.palette[color][200],
    borderRadius: "50%",
    top: -85,
    right: -5,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -135,
      right: -50,
    },
  },
}));

VerificationCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  color: PropTypes.string.isRequired,
};

function VerificationCard({ isLoading, title, items, count, color }: any) {
  const theme: any = useTheme();
  return (
    <>
      {isLoading ? (
        <SkeletonVerificationCard />
      ) : (
        <CardWrapper color={color} border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item sm={2}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette[color].main,
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={"bold"}
                        color={theme.palette.primary.light}
                      >
                        {count < 1000
                          ? count
                          : count < 1000000
                          ? count / 1000 + "K"
                          : count / 1000000 + "M" || 0}
                      </Typography>
                    </Avatar>
                  </Grid>
                  <Grid item sm={9}>
                    <Typography
                      sx={{
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        mr: 0.5,
                        mt: 1.75,
                        mb: 0.75,
                      }}
                    >
                      {title}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="center"
                  spacing={1}
                  columnSpacing={5}
                >
                  {items?.map((item: any, index: number) => {
                    return (
                      <Grid item xs={items.length > 4 ? 5.5 : 11} key={index}>
                        <Grid container justifyContent="center">
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: 550,
                                opacity: 0.5,
                              }}
                            >
                              {item.label}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Stack alignItems={"flex-end"}>
                              <Typography
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 550,
                                  opacity: 0.5,
                                }}
                              >
                                {item.value || 0}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid> */}
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
}

export default VerificationCard;
