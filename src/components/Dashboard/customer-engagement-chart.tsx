import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import {useSelector} from "react-redux";
import {useTheme} from "@mui/material/styles";
import SkeletonCustomerEngagementChart from '../../utils/ui-components/cards/skeleton/customer-engagement-chart';
import MainCard from "../../utils/ui-components/MainCard";
import { Grid, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constants";

// chart data
import chartData from './chart-data/customer-engagement-line-chart';

CustomerEngagementChart.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.array,
};

function CustomerEngagementChart({isLoading, data}: any) {

    const theme = useTheme();
    const customization = useSelector((state: any) => state.customization);

    const {navType} = customization;
    const {primary} = theme.palette.text;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    useEffect(() => {
        let chartdata: any[]
        // do not load chart when loading
        if (!isLoading && data?.length > 0) {
            chartdata = Object.keys(data[0]).map((key : any) => {
                if(key !== "date"){
                    return {
                        name : key,
                        data : data?.map((item : any) => ({
                            x : item.date,
                            y : item[key]
                        }))
                    }
                }
            }).filter(Boolean);

            const newChartData = {
                ...chartData,
                // ...chartData?.options,
                yaxis: {
                    labels: {
                        style: {
                            colors: [primary]
                        }
                    }
                },
                
                grid: {
                    borderColor: grey200
                },
                legend: {
                    show:true,
                    labels: {
                        colors: [primary]
                    }
                },
                series: chartdata
            };

            // // do not load chart when loading
            // if (!isLoading) {
            ApexCharts.exec(`line-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary, grey200, grey500, isLoading, data]);

    return (
        <>
            {isLoading ? (
                <SkeletonCustomerEngagementChart/>
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="h3">Campaigns</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">The total number of impressions within the
                                                date range. Here we have the overview of date range impression
                                                data.</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartData} />
                            {/* <Chart {...chartData(theme.palette.mode)} /> */}
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
}

export default CustomerEngagementChart;