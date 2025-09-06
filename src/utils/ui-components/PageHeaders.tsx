import PropTypes from "prop-types";
import { Breadcrumbs, Chip, Grid, Icon, Typography, useTheme } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";

function PageHeaders({ HeaderIcon, headerTitle, breadCrumb = true }: { HeaderIcon: any; headerTitle: string; breadCrumb?: boolean }) {
  const theme: any = useTheme();
  const navigate = useNavigate();
  const customization = useSelector((state: any) => state.customization);
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography sx={{ ...theme.typography.pageHeader }}>
          <Icon>{HeaderIcon}</Icon>
          {headerTitle}
        </Typography>
        {breadCrumb && (
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ paddingTop: 2 }}>
            {!isMobile &&
              customization?.breadcrumbs?.length > 0 &&
              customization?.breadcrumbs?.map((item: any, index: number) => (
                <Chip
                  key={index}
                  onClick={() => {
                    navigate(item.path, { state: item?.state });
                  }}
                  label={item.name === "Home" ? "" : item.name}
                  icon={item.name === "Home" ? <HomeIcon color="primary" /> : <></>}
                  sx={{
                    backgroundColor: "transparent !important",
                    color: item.bold ? theme.palette.secondary.main : theme.palette.primary.main,
                  }}
                />
              ))}
          </Breadcrumbs>
        )}
      </Grid>
    </Grid>
  );
}

PageHeaders.propTypes = {
  HeaderIcon: PropTypes.node.isRequired,
  headerTitle: PropTypes.string.isRequired,
};

export default PageHeaders;
