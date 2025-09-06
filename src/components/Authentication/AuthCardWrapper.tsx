import React from 'react';
import PropTypes from 'prop-types';
import MainCard from "../../utils/ui-components/MainCard";
import {Box} from "@mui/material";

AuthCardWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.object
};

function AuthCardWrapper({maxWidth, children, ...other}: any) {
    return (
        <MainCard
            sx={{
                maxWidth: maxWidth || {xs: 400, lg: 475},
                margin: {xs: 2.5, md: 3},
                '&>*': {
                    flexGrow: 1,
                    flexBasis: '50%'
                }
            }}
            content={false}
            {...other}>
            <Box sx={{p: {xs: 2, sm: 3, xl: 5}}}>{children}</Box>
        </MainCard>
    );
}

export default AuthCardWrapper;