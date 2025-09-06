import * as Yup from "yup";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";

// mui
import { Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import Spinner from "../../utils/ui-components/Spinner";
import MainCard from "../../utils/ui-components/MainCard";
import EmptyResult from "../../utils/ui-components/EmptyResult";

// mui icons
import FileUpload from "../../utils/ui-components/FormsUI/fileUpload/file-upload.component";
import { FILE_SIZE, FILE_SUPPORTED_FORMATS } from "../../store/constants";
import RadioGroupWrapper from "../../utils/ui-components/FormsUI/RadioGroup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUpload, listUploads } from "../../assets/api";
import { useParams } from "react-router-dom";
import { openSnackBar } from "../../utils/ui-components/CustomSnackBar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UploadedFileShow from "./UploadedFileShow";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import { useSelector } from "react-redux";
import { getState } from "../../redux/actions/actions";
import StyleIcon from "@mui/icons-material/Style";

// const statusMap = {
//   ongoing: { label: "Ongoing", color: "success" },
//   closed: { label: "Closed", color: "error" },
//   pending: { label: "Pending", color: "warning" },
// } as const;

const ATTACHMENT_TYPES: { label: string; value: string | number }[] = [
  {
    value: "CV",
    label: "CV",
  },
  {
    value: "LETTER",
    label: "Letter",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

function EmployeeAttachmentList({ userId, access }: { userId?: number; access: string }) {
  const theme: any = useTheme();
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);

  const formikRef: any = useRef(null);
  const [category, setCategory] = useState<"PHOTO" | "CV" | "LETTER" | "OTHER">("CV");
  const { id } = useParams();
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [search, setSearch] = useState("");
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [jobs, setJobs] = useState<
  //   {
  //     id: number;
  //     fileName: string;
  //   }[]
  // >([]);
  // const [count, setCount] = useState(0);
  const [upload, setUpload] = useState(false);
  // const [fileType, setFileType] = React.useState("CV");

  // const handleChangeFileType = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFileType((event.target as HTMLInputElement).value);
  // };

  // useEffect(() => {
  //   // setJobs(data);
  //   // setCount(data.length);
  // }, []);

  // const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const listAttachments = useQuery({
    queryKey: ["uploads", id, category],
    queryFn: () =>
      listUploads({
        userId: Number(id) ? Number(id) : "@me",
        category: category,
      }),
    select: (res) => res.data,
    enabled: true,
  });

  const mutation = useMutation({
    mutationFn: ({ file, attachmentType, name }: { file: File; attachmentType: "PHOTO" | "CV" | "LETTER" | "OTHER"; name: string }) =>
      createUpload(file, Number(id), attachmentType, name, setUploadProgress), // Function to create a new post
    onSuccess: () => {
      openSnackBar("Uploaded successfully", "success", 3000);
      formikRef.current?.resetForm();
      listAttachments.refetch();
    },
  });

  return (
    <Grid container spacing={1}>
      {user?.roleId === 5 && (
        <Grid item xs={12}>
          <PageHeaders HeaderIcon={<StyleIcon />} headerTitle={"Attachments"} breadCrumb={false} />
        </Grid>
      )}
      {
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              userName: "",
              type: "CV",
              attachment: [],
            }}
            validationSchema={Yup.object().shape({
              userName: Yup.string().notRequired(),
              type: Yup.string().required("Please make a selection of File Type."),
              attachment: Yup.mixed()
                .nullable()
                .required("Please Upload the File.")
                .test("FILE_SIZE", "The size of uploaded files exceeds the maximum limit of 2MB.", (value: any) => {
                  return value?.reduce((accumulator: any, curValue: any) => {
                    return accumulator + curValue.size;
                  }, 0);
                })
                .test("FILE_SIZE", "The size of uploaded files exceeds the maximum limit of 2MB.", (value: any) => {
                  return (
                    value?.reduce((accumulator: any, curValue: any) => {
                      return accumulator + curValue.size;
                    }, 0) <= FILE_SIZE
                  );
                })
                .test(
                  "FILE_FORMAT",
                  "Only .pdf, .png, .jpeg and .jpg files are allowed.",
                  (value: any) => value?.filter((obj: any) => FILE_SUPPORTED_FORMATS.includes(`${obj?.type},`)).length
                ),
            })}
            onSubmit={(values: any) => {
              mutation.mutate({
                file: values.attachment[0],
                attachmentType: values.type,
                name: values.attachment[0].name.slice(0, 100).trim(),
              });
            }}
          >
            {({ values }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  {Number(userId) && access[0] === "1" ? (
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ ...theme.typography.button }}
                        type="button"
                        onClick={() => setUpload(!upload)}
                      >
                        {upload ? "Cancel" : "Add Attachment"}
                      </Button>
                    </Grid>
                  ) : (
                    <></>
                  )}
                  <Grid item xs={12}>
                    <RadioGroupWrapper
                      name="type"
                      label="Attachment File Type"
                      radioGroup={ATTACHMENT_TYPES}
                      disabled={false}
                      customHandleChange={(value: any) => {
                        setCategory(value);
                      }}
                    />
                  </Grid>
                  {upload && (
                    <Grid item xs={12}>
                      <FileUpload
                        disabled={false}
                        accept=".jpg,.png,.jpeg,.pdf"
                        label="Attachment File Upload"
                        maxFileSizeInBytes={FILE_SIZE}
                        name="attachment"
                        progress={uploadProgress}
                        limit={2}
                      />
                      <Grid container justifyContent={"center"}>
                        <Grid item md={4} xs={12}>
                          {values.attachment[0] instanceof File && (
                            <Button
                              fullWidth
                              color="secondary"
                              variant="outlined"
                              startIcon={<FileUploadIcon />}
                              sx={{ ...theme.typography.button }}
                              type="submit"
                            >
                              Upload
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      }
      <Grid item lg={12} md={7} sm={12} xs={12}>
        <MainCard>
          <Grid container spacing={2}>
            {listAttachments.data?.data?.map((file, index) => (
              <UploadedFileShow file={file} access={access} key={index} refetch={listAttachments.refetch} userId={Number(userId) || 0} />
            ))}
          </Grid>
          {!listAttachments.data?.data?.length && !listAttachments.isPending ? (
            <EmptyResult />
          ) : listAttachments.isPending ? (
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
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default EmployeeAttachmentList;
