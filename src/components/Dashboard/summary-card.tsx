import React from "react";
import PropTypes from "prop-types";
import { Avatar, Card, CardContent, Icon, Stack, Typography, useTheme } from "@mui/material";
// import MovingIcon from "@mui/icons-material/Moving";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SkeletonSummaryCard from "../../utils/ui-components/cards/skeleton/summry-card";

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  OptionIcon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function SummaryCard({ title, isLoading, sx, value, OptionIcon, color, selected, onClick }): React.JSX.Element {
  const theme: any = useTheme();
  // const TrendIcon = trend === "up" ? MovingIcon : TrendingDownIcon;
  // const trendColor = trend === "up" ? theme.palette.success.main : theme.palette.error.main;

  return (
    <>
      {isLoading ? (
        <SkeletonSummaryCard />
      ) : (
        <Card
          sx={{
            ...sx,
            // cursor: "pointer",
            border: `1px solid ${selected && theme.palette[color].main}`,
            boxShadow: "0 2px 5px 0 rgb(32 40 45 / 8%)",
          }}
          onClick={onClick}
        >
          <CardContent>
            <Stack spacing={3}>
              <Stack
                direction="row"
                sx={{
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    {title}
                  </Typography>
                  <Typography variant="h2">{value}</Typography>
                </Stack>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    backgroundColor: theme.palette[color][200],
                    color: theme.palette[color].main,
                    height: "56px",
                    width: "56px",
                    borderRadius: "20px",
                  }}
                >
                  <Icon>{OptionIcon}</Icon>
                </Avatar>
              </Stack>
              {/* {diff ? (
                <Stack
                  sx={{ alignItems: "center" }}
                  direction="row"
                  spacing={2}
                >
                  <Stack
                    sx={{ alignItems: "center" }}
                    direction="row"
                    spacing={0.5}
                  >
                    <TrendIcon sx={{ color: trendColor }} fontSize="medium" />
                    <Typography color={trendColor} variant="body2">
                      {diff}%
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="caption">
                    {`${trend} from yesterday`.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )}
                  </Typography>
                </Stack>
              ) : null} */}
            </Stack>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default SummaryCard;
