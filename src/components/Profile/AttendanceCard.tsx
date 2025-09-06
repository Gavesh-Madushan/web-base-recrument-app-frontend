import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import { statusMap } from "../../utils/constants";
import MainCard from "../../utils/ui-components/MainCard";
import EmptyResult from "../../utils/ui-components/EmptyResult";

const statusMap = {
  APPROVE: { label: "Approved", color: "success" },
  REJECT: { label: "Reject", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
} as const;

const EmployeeProfileAttendanceList = ({ search }: { search: string }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [attendance, setAttendance] = useState(mockAttendanceData || []);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchApiUserList(search);
  }, [search]);

  const fetchApiUserList = (searchValue: string) => {
    setIsLoading(false);
  };

  return (
    <Grid container spacing={2}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" width="100%">
          <CircularProgress />
        </Box>
      ) : attendance.length > 0 ? (
        attendance.map((entry) => (
          <Grid item xs={12} key={entry.id}>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight="bold">
                    {dayjs(entry.date).format("DD MMM YYYY")}
                  </Typography>
                  <IconButton
                    onClick={() =>
                      setExpanded(expanded === entry.id ? null : entry.id)
                    }
                  >
                    {expanded === entry.id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                <Collapse
                  in={expanded === entry.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container spacing={1} mt={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        First Check-in
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(entry.firstCheckIn).format("hh:mm:ss a")}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Last Check-out
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(entry.lastCheckOut).format("hh:mm:ss a")}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Work Hours
                      </Typography>
                      <Typography variant="body1">
                        {entry.workHours} hrs
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        OT Hours
                      </Typography>
                      <Typography variant="body1">
                        {entry.otHours} hrs
                      </Typography>
                    </Grid>
                    <Grid item xs={12} mt={1}>
                      <Typography variant="body2" color="textSecondary">
                        Project Status
                      </Typography>
                      <Chip
                        label={statusMap[entry.status].label}
                        color={statusMap[entry.status].color}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <EmptyResult />
      )}
    </Grid>
  );
};

export default EmployeeProfileAttendanceList;

const mockAttendanceData = [
  {
    id: 1,
    date: dayjs("2025-01-30"),
    firstCheckIn: dayjs("2025-01-30T08:00:00"),
    lastCheckOut: dayjs("2025-01-30T16:30:00"),
    workHours: 8.5,
    otHours: 1,
    status: "APPROVE",
  },
  {
    id: 2,
    date: dayjs("2025-01-31"),
    firstCheckIn: dayjs("2025-01-31T08:15:00"),
    lastCheckOut: dayjs("2025-01-31T16:45:00"),
    workHours: 8.5,
    otHours: 0.5,
    status: "PENDING",
  },
];
