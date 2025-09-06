import { useEffect, useState } from "react";
import { Avatar, Box, Checkbox, Grid, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import Spinner from "../../../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { StaffService } from "../../../../assets/_services/staff-service";

function TeamMembers({
  empType,
  setFieldValue,
  team,
  division,
}: {
  empType: {
    value: "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "ALL";
    label: string;
    count: number;
  };
  setFieldValue: (fieldName: string, values: any[]) => void;
  team: {
    id: number;
    empImage: string;
    name_with_initials: string;
    emp_no: string;
    designation_type: string;
  }[];
  division: number | string;
}) {
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<
    {
      id: number;
      emp_no: string;
      designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
      class: string;
      nic: string;
      name_with_initials: string;
      name: string;
      mobile: string;
      status: string;
    }[]
  >([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchApiUserList(empType);
  }, [page, rowsPerPage, division]);

  const fetchApiUserList = (
    empType: {
      value: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "ALL";
      label: string;
      count: number;
    }
    // searchValue: string
  ) => {
    setIsLoading(true);
    const values = {
      activeState: "ACTIVE" as const,
      designation: empType.value === "ALL" ? undefined : empType.value,
      searchTerm: undefined,
      divisionId: division === "" ? undefined : Number(division),
      joinDivision: true,
    };
    StaffService.getEmployeeList(values, page, rowsPerPage).then((response) => {
      if (response.isSuccess) {
        setUsers(
          response.data.data.map((emp) => ({
            id: emp.id,
            emp_no: emp.employeeNumber,
            designation: emp.designation,
            nic: emp.nic,
            name: emp.name,
            name_with_initials: emp?.nameInitials,
            mobile: emp?.mobile,
            status: emp?.activeState,
            class: emp?.class,
          }))
        );
        setCount(response?.data?.totalCount || count);
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
      <Grid item xs={12}>
        <Box sx={{ minHeight: 400, width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={60} />
                <TableCell>Emp No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={team.some((member) => member.id === user.id)}
                        onClick={() => {
                          if (!team.some((member) => member.id === user.id)) {
                            setFieldValue("team", [
                              ...team,
                              {
                                id: user.id,
                                empImage: "",
                                name_with_initials: user.name_with_initials,
                                emp_no: user.emp_no,
                                designation_type: user.designation,
                                class: user.class,
                              },
                            ]);
                          } else {
                            setFieldValue(
                              "team",
                              team.filter((teamMember) => teamMember.id !== user.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems={"center"} direction={"row"} spacing={2}>
                        <Avatar
                          src={``}
                          // sx={{ width: 32, height: 32 }}
                        />
                        <Typography>{user?.emp_no}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.name_with_initials}</TableCell>
                    <TableCell>{user.class}</TableCell>
                  </TableRow>
                );
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
