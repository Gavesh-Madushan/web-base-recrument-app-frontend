import { useEffect, useState } from "react";
import { Avatar, Box, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import Spinner from "../../../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { convert_to_proper_case } from "../../../../utils/utils";
import { ProjectService } from "../../../../assets/_services/project-service";
import { UploadService } from "../../../../assets/_services/upload-service";

function TeamMembers(projectId: { projectId: number }) {
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<
    {
      id: number;
      emp_no: number | string;
      designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
      name_with_initials: string;
      name: string;
    }[]
  >([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchTeamMemberList();
  }, [page, rowsPerPage]);

  const fetchTeamMemberList = () => {
    setIsLoading(true);
    const values = {
      projectId: projectId.projectId,
    };
    // console.log('projectId', projectId);

    ProjectService.getTeamMembers(values, page, rowsPerPage).then((response) => {
      // console.log("response", response);

      if (response.isSuccess) {
        setUsers(
          response.data.data.map((emp) => ({
            id: emp?.id,
            emp_no: emp.user?.employeeNumber || "",
            designation: emp?.user?.designation as
              | "MANAGER"
              | "DIVISION_HEAD"
              | "HR_MANAGER"
              | "FINANCE_MANAGER"
              | "ENGINEER"
              | "TECHNICIAN"
              | "ASSISTANT_ENGINEER",
            name: emp?.user?.nameInitials || "",
            name_with_initials: emp?.user?.nameInitials || "",
          }))
        );
        setCount(response?.data?.totalCount || 0);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setCount(0);
        setUsers([]);
      }
    });
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={1}>
      <Grid item lg={12} sm={12} xs={12}>
        <Box sx={{ minHeight: 400, width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Emp No</TableCell>
                <TableCell>Employee Class</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => {
                return <UserRow key={index} user={user} />;
              })}
            </TableBody>
          </Table>
          {!users?.length && !isLoading ? (
            <EmptyResult />
          ) : isLoading ? (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                minHeight: "40vh",
              }}
            >
              <Spinner />
            </Box>
          ) : null}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default TeamMembers;

function UserRow(props: { user: any }) {
  const { user } = props;
  const [profilePictureSrc, setProfilePictureSrc] = useState("");
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    if (user?.profilePicturePath) {
      setIsLoadingImage(true);
      UploadService.getFile(user?.profilePicturePath).then((src: any) => {
        setProfilePictureSrc(URL.createObjectURL(src));
        setIsLoadingImage(false);
      });
    }
  }, [user?.profilePicturePath]);

  return (
    <TableRow>
      <TableCell>
        <Stack alignItems={"center"} direction={"row"} spacing={2}>
          <Box width={40} height={40}>
            {user?.profilePicturePath && isLoadingImage ? (
              <Skeleton variant="circular" width="100%" height="100%" />
            ) : (
              <Avatar src={profilePictureSrc} />
            )}
          </Box>
          <Typography>{user?.name_with_initials}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{user.emp_no}</TableCell>
      <TableCell>{convert_to_proper_case(user.designation || "")}</TableCell>
    </TableRow>
  );
}
