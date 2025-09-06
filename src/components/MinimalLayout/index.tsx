// import React from "react";
import {Outlet} from 'react-router-dom';
import AuthFooter from "../Footer/AuthFooter";
import {styled, useTheme} from "@mui/material/styles";
import {Box} from "@mui/material";
// import Customization from "../Customization";

// ==============================|| MINIMAL LAYOUT ||============================== //

const Layout = styled(Box)(({theme}: any) => ({
    ...theme.typography.minimalLayoutContent,
}));
const MinimalLayout = () => {
    const theme = useTheme();
    return (
        <Box>
            <Layout theme={theme}>
                <Outlet/>
                {/* <Customization/> */}
            </Layout>
            <AuthFooter/>
        </Box>
    );
};

export default MinimalLayout;
