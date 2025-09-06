import { gridSpacing } from "../../../../store/constants";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";
import { formatMobile } from "../../../../utils/utils";
import { useDispatch } from "react-redux";

// mui
import { Box, Chip, Divider, Grid, Skeleton, Stack, Typography, useTheme } from "@mui/material";

// custom components
import PageHeaders from "../../../../utils/ui-components/PageHeaders";
import MainCard from "../../../../utils/ui-components/MainCard";
// import ProjectStatusChart from "./ProjectStatusChart";
import ClientJobList from "./ClientAllJob";

// mui icons
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import PersonIcon from "@mui/icons-material/Person";
import PortraitIcon from "@mui/icons-material/Portrait";
import { ProjectService } from "../../../../assets/_services/project-service";

function CreateView(props: { access: string }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const [clientId, setclientId] = useState<number>(Number(id));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<{
    id: number;
    businessName: string;
    businessPhone?: string;
    businessAddress?: string;
    businessEmail?: string;
    personName?: string;
    personPhone?: string;
    description?: string;
  }>({
    id: 0,
    businessName: "",
    businessPhone: "",
    businessAddress: "",
    businessEmail: "",
    personName: "",
    personPhone: "",
    description: "",
  });

  useEffect(() => {
    if (props.access[1] === "0") {
      navigate("/dashboard");
    }
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Customer",
          path: "/project/client",
          bold: false,
          state: state,
        },
        {
          name: `${clients?.businessName || ""}`,
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, [clients]);

  useEffect(() => {
    fetchApiUserById();
  }, []);

  const fetchApiUserById = () => {
    setIsLoading(true);
    setclientId(Number(id));
    const values = {
      id: clientId,
    };

    ProjectService.getClientDetailsBy(values)
      .then((response) => {
        if (response.isSuccess) {
          const data = response.data as {
            data: {
              id: number;
              businessName: string;
              businessPhone?: string;
              businessAddress?: string;
              businessEmail?: string;
              personName?: string;
              personPhone?: string;
              description?: string;
            };
          };

          setClients({
            id: data.data.id,
            businessName: data.data.businessName,
            businessPhone: data.data.businessPhone,
            businessAddress: data.data.businessAddress,
            businessEmail: data.data.businessEmail,
            personName: data.data.personName,
            personPhone: data.data.personPhone,
            description: data.data.description,
          });
        } else {
          setClients({
            id: 0,
            businessName: "",
            businessPhone: "",
            businessAddress: "",
            businessEmail: "",
            personName: "",
            personPhone: "",
            description: "",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<PortraitIcon />} headerTitle={"Customer Management"} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}>
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack alignItems={"flex-end"}>
                    <Box>
                      <Chip color={"success"} label={"Active"} size="small" />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography color={theme.palette.text.secondary} variant="h3">
                    {isLoading ? <Skeleton width={200} /> : clients.businessName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2, mt: 1 }}>
                  <Stack direction={"row"} spacing={1}>
                    <CallIcon fontSize="small" />
                    <Typography>{isLoading ? <Skeleton width={200} /> : formatMobile(clients.businessPhone)}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    <AttachEmailIcon fontSize="small" />
                    <Typography>{isLoading ? <Skeleton width={200} /> : clients.businessEmail}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    <HomeIcon fontSize="small" />
                    <Typography>{isLoading ? <Skeleton width={200} /> : clients.businessAddress}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Divider textAlign="right">
                    <Typography variant="caption" fontWeight={"bold"}>
                      Contact Person Details
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    <PersonIcon fontSize="small" />
                    <Typography>{isLoading ? <Skeleton width={200} /> : clients.personName}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    <CallIcon fontSize="small" />
                    <Typography>{isLoading ? <Skeleton width={200} /> : formatMobile(clients.personPhone)}</Typography>
                  </Stack>
                </Grid>
                {/* <Grid item xs={12} sx={{ mt: 2 }}>
                  <ProjectStatusChart />
                </Grid> */}
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ClientJobList clientId={clientId} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CreateView;
