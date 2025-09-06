import { Box, Button, CircularProgress, Grid, IconButton, styled, Tooltip, Typography, useTheme } from "@mui/material";
import MainCard from "../../utils/ui-components/MainCard";
import { gridSpacing } from "../../store/constants";
import { DateCalendar, DatePicker, DayCalendarSkeleton, LocalizationProvider, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { closeCustomConfirmDialog, openCustomConfirmDialog } from "../../utils/ui-components/pop-ups/CustomConfirmDialog";
import { applyGlobalValidations } from "../../utils/utils";
// import { Form, Formik, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteCalendarEvent, listCalendarEvents, updateCalendarEvent } from "../../assets/api";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import ViewEditDialog from "../../utils/ui-components/ViewEditDialog";
import { Form, Formik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { closeConfirmDialog, openConfirmDialog } from "../../utils/ui-components/pop-ups/ConfirmDialog";

const CalendarManagement = () => {
  const theme = useTheme();
  // const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[][]>([]);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState<Dayjs>(dayjs());
  const currentMonths = Array.from({ length: 12 }, (_, i) => dayjs(year).month(i));
  const [months, setMonths] = useState<Array<Dayjs | null>>(currentMonths);
  // const [value, setValue] = useState<Array<Dayjs | null>>(currentMonths);
  const [initialItem, setInitialItem] = useState<{
    day: number;
    month: number;
    year: number;
    name: string;
    emoji: string;
  }>({
    day: 0,
    month: 0,
    year: 0,
    name: "",
    emoji: "",
  });

  const getCalanderEvents = useQuery({
    queryKey: ["calendarEvents", undefined, undefined, year.year(), 0, 365],
    queryFn: () =>
      listCalendarEvents({
        year: year.year(),
        page: 0,
        pageSize: 365,
      }),
    enabled: true,
    select: (res) => res.data,
  });

  useEffect(() => {
    const events: number[][] = [];

    getCalanderEvents.data?.data.forEach((event) => {
      if (!events[event.month]) {
        events[event.month] = [];
      }
      events[event.month].push(event.day);
    });

    setHighlightedDays(events);
  }, [getCalanderEvents.data]);

  // const handleMonthChange = (date: Dayjs) => {
  //   if (requestAbortController.current) {
  //     // make sure that you are aborting useless requests
  //     // because it is possible to switch between months pretty quickly
  //     requestAbortController.current.abort();
  //   }

  //   setIsLoading(true);
  //   setHighlightedDays([]);
  //   fetchHighlightedDays(date);
  // };

  const updateHoliday = useMutation({
    mutationFn: updateCalendarEvent,
  });

  const dialog = useMemo(
    () =>
      ViewEditDialog(ApplyCalanderEvent)({
        open: open,
        setOpen: setOpen,
        dialogTitle: "Holiday",
        initialItem: initialItem,
        fetchData: () => {
          getCalanderEvents.refetch();
        },
        theme: theme,
        maxWidth: "sm",
      }),
    [open]
  );

  const adjustHoliday = (date: Dayjs) => {
    // setValue(months.map((m) => (m.isSame(date, "month") ? date : m)));
    const event = getCalanderEvents.data?.data.find((e) => e.day === date.date() && e.month === date.month() && e.year === date.year());
    if (event) {
      setInitialItem(event);
      setOpen(true);
    } else {
      openCustomConfirmDialog({
        title: "Make a Holiday",
        message: `Are you sure do you want to make ${dayjs(date).format("DD-MM-YYYY")} as a holiday?`,
        data: { date },
        onSubmit: (data, values: any, setSubmitting) => {
          updateHoliday.mutate(
            {
              day: data.date.date(),
              month: data.date.month(),
              year: data.date.year(),
              name: values.title,
              emoji: "HD",
            },
            {
              onSuccess: () => {
                closeCustomConfirmDialog();
                openSuccessDialog("Success", `Holiday updated successfully.`);
                setSubmitting(false);
                getCalanderEvents.refetch();
              },
              onError: () => {
                setSubmitting(false);
              },
            }
          );
        },
        close: true,
        confirmBtnDisable: false,
        initialFormState: {
          title: "",
        },
        handleExited: () => {
          // setValue(null);
        },
        formValidation: applyGlobalValidations(
          Yup.object().shape({
            title: Yup.string().required("Please enter the title for the Holiday"),
          })
        ),
        Component: () => {
          return (
            <Box>
              <Grid container spacing={gridSpacing} justifyContent="center">
                <Grid item md={6} xs={12}>
                  <TextFieldWrapper required type="text" name="title" label="Title of Holiday" />
                </Grid>
              </Grid>
            </Box>
          );
        },
      });
    }
  };

  return (
    <MainCard title="Calender Management">
      <Grid container>
        <Grid item xs={12} display={"flex"} alignItems={"center"} justifyContent={"center"} marginBottom={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              openTo="year"
              value={year}
              onChange={(newValue) => {
                setMonths(Array.from({ length: 12 }, (_, i) => dayjs(newValue).month(i)));
                setYear(newValue);
                // setValue(Array.from({ length: 12 }, (_, i) => dayjs(newValue).month(i)));
              }}
              label="Pick a Year"
              format="YYYY"
              sx={{
                "& .MuiYearCalendar-root": {
                  // this targets the year picker view
                  padding: 2,
                },
                "& .MuiPickersYear-yearButton": {
                  fontSize: "1.5rem", // increase font size
                  padding: "12px",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" spacing={gridSpacing}>
        {months?.map((month, index) => (
          <Grid item key={month?.month()}>
            <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={month}
                  // value={value[index]}
                  view="day"
                  views={["day"]}
                  // onChange={(newValue) => adjustHoliday(newValue)}
                  loading={isLoading}
                  renderLoading={() => <DayCalendarSkeleton />}
                  slots={{
                    day: (dayProps) => <ServerDay {...(dayProps as PickersDayProps<Dayjs>)} adjustHoliday={adjustHoliday} />,
                  }}
                  slotProps={{
                    day: {
                      highlightedDays: highlightedDays[index] || [],
                    } as any,
                  }}
                  sx={{
                    "& .MuiPickersCalendarHeader-label": {
                      fontSize: "1.0rem", // Month and Year (April 2025)
                      fontWeight: "bold",
                      color: theme.palette.secondary.main,
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      // fontSize: "1.5rem", // Arrows
                      display: "none",
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
        ))}
      </Grid>
      {dialog}
    </MainCard>
  );
};

export default CalendarManagement;

const CustomPickersDay = styled(PickersDay)<{
  day: Dayjs;
  istoday?: string;
  isselected?: string;
}>(({ theme, istoday, isselected }) => ({
  backgroundColor: "transparent !important",
  color: `${theme.palette.text.primary} !important`,
  ...(istoday == "true" && {
    color: `${theme.palette.primary.main} !important`,
    fontWeight: "bold",
    border: `2px solid ${theme.palette.primary.light}`,
  }),
  ...(isselected == "true" && {
    color: theme.palette.warning.main,
    backgroundColor: `${theme.palette.warning.light} !important`,
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.warning.dark}`,
  }),
}));

function ServerDay(
  props: PickersDayProps<Dayjs> & {
    highlightedDays?: number[];
    adjustHoliday?: any;
  }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, adjustHoliday, ...other } = props;

  const isToday = dayjs(day).isSame(dayjs(), "day");

  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    // <>
    <CustomPickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      istoday={isToday.toString()}
      isselected={isSelected.toString()}
      onDaySelect={function (day: unknown): void {
        adjustHoliday(day);
      }}
    />
    //   <Badge
    //     key={props.day.toString()}
    //     overlap="circular"
    //     badgeContent={isSelected ? "🌚" : undefined}
    //   >
    //     <PickersDay
    //       {...other}
    //       outsideCurrentMonth={outsideCurrentMonth}
    //       day={day}
    //     />
    //   </Badge>
    // </>
  );
}

function ApplyCalanderEvent({
  initialItem,
  fetchData,
  setOpen,
}: {
  initialItem: {
    day: number;
    month: number;
    year: number;
    name: string;
    emoji: string;
  };
  initialData: { leaveTypes: { value: string; label: string }[] };
  fetchData: () => void;
  setOpen: (boolean) => void;
}) {
  const theme: any = useTheme();
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  // const createNewLeave = (values: LeaveInterface, setSubmitting: (isSubmitting: boolean) => void) => {};

  const updateEvent = useMutation({
    mutationFn: updateCalendarEvent,
  });

  const deleteCalanderEvent = useMutation({
    mutationFn: deleteCalendarEvent,
  });

  const deleteEvent = (data) => {
    openConfirmDialog("Delete", `Are you sure you want to delete this calander event?`, { input: data }, (data) => {
      setIsLoadingDelete(true);
      closeConfirmDialog();
      deleteCalanderEvent.mutate(
        {
          day: data.input.day,
          month: data.input.month,
          year: data.input.year,
        },
        {
          onSuccess: () => {
            openSuccessDialog("Success", `Holiday deleted successfully`);
            setIsLoadingDelete(false);
            setOpen(false);
            fetchData();
          },
          onError: () => {
            // setSubmitting(false);
            setIsLoadingDelete(false);
          },
        }
      );
    });
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <Formik
          validateOnMount={true}
          enableReinitialize
          initialValues={initialItem}
          validationSchema={applyGlobalValidations(
            Yup.object().shape({
              name: Yup.string().required("Please enter the title for the Holiday"),
            })
          )}
          onSubmit={(values) => {
            setIsLoading(true);
            updateEvent.mutate(
              {
                day: values.day,
                month: values.month,
                year: values.year,
                name: values.name,
                emoji: "HD",
              },
              {
                onSuccess: () => {
                  openSuccessDialog("Success", `Holiday updated successfully`);
                  setIsLoading(false);
                  setOpen(false);
                  fetchData();
                },
                onError: () => {
                  // setSubmitting(false);
                  setIsLoading(false);
                },
              }
            );
          }}
        >
          {({ dirty, isSubmitting, isValid }) => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xl={12} xs={12} md={12}>
                  <Typography variant="h4" color={theme.palette.text.secondary}>
                    Date : {initialItem?.day} {dayjs(initialItem?.month).format("MMM")} {initialItem?.year}
                  </Typography>
                </Grid>
                <Grid item xl={12} xs={12} md={12}>
                  <Typography variant="h4" color={theme.palette.text.secondary}>
                    Title,
                  </Typography>
                </Grid>

                {!edit && (
                  <Grid item xl={12} xs={12} md={12}>
                    <Typography>{initialItem?.name}</Typography>
                  </Grid>
                )}

                {edit && (
                  <Grid item xl={12} xs={12} md={12}>
                    <TextFieldWrapper label="Title" name="name" type="text" />
                  </Grid>
                )}

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid
                    item
                    xs={12}
                    // gap={1}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      py: 2,
                    }}
                  >
                    <Tooltip title="Delete Holiday">
                      <IconButton color="error" onClick={() => deleteEvent(initialItem)} disabled={isLoadingDelete}>
                        {isLoadingDelete ? <CircularProgress size={"20px"} sx={{ mr: 1, color: "gray" }} /> : <DeleteIcon />}
                      </IconButton>
                    </Tooltip>
                    {!edit && (
                      <Tooltip title="Update Holiday">
                        <Button color="warning" onClick={() => setEdit(true)}>
                          <EditIcon />
                        </Button>
                      </Tooltip>
                    )}

                    {edit && (
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        sx={{ ...theme.typography.button }}
                        size="medium"
                        disabled={!dirty || isSubmitting || !isValid}
                        startIcon={
                          isLoading && (
                            <CircularProgress
                              size={"20px"}
                              sx={{
                                mr: 1,
                                color: "gray",
                              }}
                            />
                          )
                        }
                      >
                        Update Holiday
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}
