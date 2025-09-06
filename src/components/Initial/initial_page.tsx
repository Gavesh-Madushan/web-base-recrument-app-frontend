import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from "react-redux";
import {useTheme} from '@mui/material/styles';
import {Grid, useMediaQuery} from "@mui/material";
import {loginRequest} from "../../redux/actions/actions";
import Loader from "../../utils/ui-components/Loader";
import {useSearchParams} from "react-router-dom";

function InitialPage(props: any) {

    const [searchParams] = useSearchParams();

    const {
        loginRequest, // remember, Redux Form injects this into our props
    } = props;

    const theme = useTheme();

    useEffect(() => {
        const token = searchParams.get("Token");
        loginRequest(token);
    }, []);

    return (
        <Grid className="container">
            <Loader/>
        </Grid>
    );
}

const mapStateToProps = (state: any) => ({
    login: state.auth,
})

export default connect(mapStateToProps, {loginRequest})(InitialPage)
