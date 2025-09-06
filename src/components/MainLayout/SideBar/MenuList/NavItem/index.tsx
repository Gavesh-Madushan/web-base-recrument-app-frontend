import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  Zoom,
} from "@mui/material";

// project imports
import { MENU_OPEN, SET_MENU } from "../../../../../redux/actions/actions";

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: any) => {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state: any) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const drawerOpened = useSelector((state: any) => state.customization.opened);

  const itemIcon = item?.icon ? (
    item?.icon
  ) : (
    <FiberManualRecordIcon
      sx={{
        width:
          customization.isOpen.findIndex((id: any) => id === item?.id) > -1
            ? 8
            : 6,
        height:
          customization.isOpen.findIndex((id: any) => id === item?.id) > -1
            ? 8
            : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps: any = {
    component: forwardRef((props, ref: any) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = (id: any) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
  };

  // active menu item on page load
  useEffect(() => {
    if (document.location.pathname.includes(item.id)) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: "flex-start",
        backgroundColor: level > 1 ? "transparent !important" : "inherit",
        py: level > 1 ? 1 : 1.25,
        // pl: `${level * 24}px`
      }}
      selected={
        customization.isOpen.findIndex((id: any) => id === item.id) > -1
      }
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ my: "auto", minWidth: !item?.icon ? 18 : 36 }}>
        {drawerOpened ? (
          itemIcon
        ) : (
          <Tooltip
            slots={{
              transition: Zoom,
            }}
            arrow
            placement="right"
            title={item.title}
          >
            {itemIcon}
          </Tooltip>
        )}
      </ListItemIcon>
      {(matchUpMd ? (drawerOpened ? true : false) : true) && (
        <ListItemText
          primary={
            <Typography
              variant={
                customization.isOpen.findIndex((id: any) => id === item.id) > -1
                  ? "h5"
                  : "body1"
              }
              color="inherit"
            >
              {item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography
                variant="caption"
                sx={{ ...theme.typography.subMenuCaption }}
                display="block"
                gutterBottom
              >
                {item.caption}
              </Typography>
            )
          }
        />
      )}
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
