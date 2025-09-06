import { Badge, Box, Grid, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUpload, fetchUpload } from "../../assets/api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { convertBytesToKB } from "../../utils/ui-components/FormsUI/fileUpload/file-upload.component";
import { openFileViewer } from "../../utils/ui-components/FileViewer";
import { _setBlobToFile } from "../../utils/utils";
import { closeConfirmDialog, openConfirmDialog } from "../../utils/ui-components/pop-ups/ConfirmDialog";
import { openSnackBar } from "../../utils/ui-components/CustomSnackBar";

interface Props {
  file: any;
  refetch: () => void;
  userId: number;
  access: string;
}

export default function UploadedFileShow(props: Readonly<Props>) {
  const fileData = useQuery({
    queryKey: ["uploads", props.file.staticPath],
    queryFn: async () => {
      const response = await fetchUpload(props.file.staticPath);
      return await _setBlobToFile(response.data, "uploaded_file");
    },
    enabled: true,
  });

  const mutation = useMutation({
    mutationFn: (id: number) => deleteUpload(id),
    onSuccess: () => {
      openSnackBar("File deleted successfully", "success", 3000);
      closeConfirmDialog();
      props.refetch();
    },
  });

  const removeFile = (file: any) => {
    openConfirmDialog(
      "Delete",
      `Are you sure you want to delete the file ${file.staticPath}?`,
      {
        id: file.id,
      },
      (data) => {
        mutation.mutate(data.id);
      }
    );
  };

  return (
    <Grid item>
      {!fileData.isPending && (
        <>
          <Grid container alignItems="flex-end">
            <Box width={60}>
              {props.access[0] === "1" && (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  badgeContent={props.userId !== 0 && <CancelIcon color="error" onClick={() => removeFile(props.file)} />}
                  sx={{
                    cursor: "pointer",
                    color: "var(--primary-color)",
                    display: "flex",
                  }}
                />
              )}
              <InsertDriveFileIcon sx={{ width: 60, height: 60 }} color="secondary" />
            </Box>

            <IconButton onClick={() => openFileViewer(fileData?.data)}>
              <VisibilityIcon fontSize="small" color="secondary" />
            </IconButton>
          </Grid>
          <Stack direction={"column"} spacing={1} sx={{ maxWidth: "150px", overflow: "hidden" }}>
            {/* <Tooltip title={props.file.staticPath}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap", // Prevents text from wrapping
                  overflow: "hidden", // Hides the text overflow
                  textOverflow: "ellipsis", // Adds ellipsis when the text overflows
                }}
              >
                {props.file.staticPath}
              </Typography>
            </Tooltip> */}
            <Typography variant="subtitle2" color="primary">
              {props.file.name} ( {convertBytesToKB(props.file.size)} kb )
            </Typography>
          </Stack>
        </>
      )}
      {fileData.isPending && (
        <Grid container direction="column" gap={2}>
          <Skeleton animation="wave" variant="rectangular" width="70px" height="70px" />
          <Skeleton animation="wave" variant="rectangular" width="150px" height="20px" />
          <Skeleton animation="wave" variant="rectangular" width="100px" height="10px" />
        </Grid>
      )}
    </Grid>
  );
}
