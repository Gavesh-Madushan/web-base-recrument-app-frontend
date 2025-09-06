// import { useTheme } from "@emotion/react";
// import { Box, IconButton, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { ProjectService } from "../../../assets/_services/project-service";
// import EditIcon from "@mui/icons-material/Edit";
// import CloseIcon from "@mui/icons-material/Close";
// import { Form, Formik } from "formik";
// import * as Yup from "yup";
// import { approveAtatndaceRecord } from "../../../assets/api";
// import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
// import dayjs from "dayjs";
// import DateTimePicker from "../../../utils/ui-components/FormsUI/DatePicker";

// function AttandaceRecordList(props: { employee }) {
//   const { employee } = props;
//   const [open, setOpen] = useState(false);
//   const theme: any = useTheme();
//   const [edit, setEdit] = useState<null | number>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [attendance, setAttendace] = useState<
//     {
//       id: number;
//       userId: number;
//       projectId: number | null;
//       projectName: string | null;
//       type: "WORK" | "BREAK";
//       createdAt: string | null;
//       endedAt: string | null;
//       comment: string;
//       approve: boolean;
//       reject: boolean;
//     }[]
//   >([]);

//   useEffect(() => {
//     if (open) {
//       const values = {
//         userID: employee.id,
//         approvalState: "PENDING" as const,
//         divisionId: undefined,
//         joinProjectAssignment: true,
//         createdFrom: undefined,
//         createdTo: undefined,
//       };
//       ProjectService.getPendingAttendaceList(values, 0, 50).then((response) => {
//         if (response.isSuccess) {
//           setAttendace(
//             response.data.data.map((item) => ({
//               id: item.id,
//               userId: item.userId,
//               projectId: item.projectAssignmentId,
//               projectName: item.projectAssignment?.project.name || "",
//               type: item.type,
//               createdAt: item.createdAt,
//               endedAt: item.endedAt || "",
//               comment: item.comment || "",
//               approve: false,
//               reject: false,
//             }))
//           );
//         } else {
//           setAttendace([]);
//         }
//       });
//     }
//   }, [open]);

//   return (
//     <Formik
//       initialValues={{ data: attendance }}
//       enableReinitialize
//       validationSchema={Yup.object().shape({
//         attandance: Yup.array().of(
//           Yup.object().shape({
//             comment: Yup.string()
//               .notRequired()
//               .trim("Cannot start or end with a space")
//               .strict()
//               .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
//             approve: Yup.boolean(),
//             reject: Yup.boolean(),
//           })
//         ),
//       })}
//       onSubmit={(values) => {
//         setIsLoading(true);
//         const data = values.data
//           .filter((item) => item.approve === true || item.reject === true)
//           .map((item) => ({
//             id: item.id,
//             approvalState: item.approve ? "APPROVED" : ("REJECTED" as "APPROVED" | "REJECTED"),
//             comment: item.comment === "" ? null : item.comment,
//           }));

//         approveAtatndaceRecord(data)
//           .then((response) => {
//             if (response.status === 204) {
//               openSuccessDialog("Success", "Attendance repords summited successfully");
//               setIsLoading(false);
//             } else {
//               setIsLoading(false);
//             }
//           })
//           .finally(() => {
//             setIsLoading(false);
//           });
//       }}
//     >
//       {({ values }) => (
//         <Form>
//           <Box
//             sx={{
//               py: 1,
//               pl: 1,
//               borderLeft: `1px solid ${theme.palette.secondary.main}`,
//             }}
//           >
//             <Table size="small">
//               <TableBody>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       width: "50px",
//                       backgroundColor: theme.palette.secondary.light,
//                     }}
//                   />
//                   <TableCell>
//                     <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
//                       Check-In
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
//                       Check-Out
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
//                       Project
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//                 {values.data.length > 0 &&
//                   values.data.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell
//                         sx={{
//                           backgroundColor: theme.palette.secondary.light,
//                         }}
//                       >
//                         {edit === item.id ? (
//                           <Tooltip title="close">
//                             <IconButton
//                               sx={{ p: 0 }}
//                               onClick={() => {
//                                 setEdit(null);
//                               }}
//                             >
//                               <CloseIcon sx={{ p: 0 }} color="warning" />
//                             </IconButton>
//                           </Tooltip>
//                         ) : (
//                           <Tooltip title="Edit attendace record">
//                             <IconButton
//                               sx={{ p: 0 }}
//                               onClick={() => {
//                                 setEdit(item.id);
//                               }}
//                             >
//                               <EditIcon sx={{ p: 0 }} />
//                             </IconButton>
//                           </Tooltip>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {edit === item.id ? (
//                           <DateTimePicker name={`attendance[${index}].createdAt`} label="Check-in" placeholder="From Date" maxDate={dayjs()} />
//                         ) : (
//                           <Typography variant="caption" fontWeight={"bold"}>
//                             {dayjs(item.createdAt).format("D MMM - hh:mm:ss a")}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {edit === item.id ? (
//                           <DateTimePicker name={`attendance[${index}].endedAt`} label="Check-out" placeholder="From Date" maxDate={dayjs()} />
//                         ) : (
//                           <Typography variant="caption" fontWeight={"bold"}>
//                             {dayjs(item.endedAt).format("D MMM - hh:mm:ss a")}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="caption" fontWeight={"bold"}>
//                           {item.projectName}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </Box>
//         </Form>
//       )}
//     </Formik>
//   );
// }

// export default AttandaceRecordList;
