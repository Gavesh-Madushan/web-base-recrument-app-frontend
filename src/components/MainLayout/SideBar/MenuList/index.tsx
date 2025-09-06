// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "../../menu-items/index";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({ role }: any) => {
  const navItems = menuItem.items.map((item: any) => {
    switch (item.type) {
      case "group":
        return item?.role?.includes(role) && <NavGroup key={item.id} item={item} role={role} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
