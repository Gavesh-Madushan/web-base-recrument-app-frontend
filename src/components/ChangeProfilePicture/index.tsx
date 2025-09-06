import PropTypes from "prop-types";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { CircularProgress, Grid } from "@mui/material";
import React, { useState } from "react";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import ButtonWrapper from "../../utils/ui-components/FormsUI/Button";
import { IMAGE_SIZE, IMAGE_SUPPORTED_FORMATS } from "../../store/constants";
import ItemImageUpload from "../../utils/ui-components/FormsUI/ItemImageUpload/item-image-upload.component";
import { UploadService } from "../../assets/_services/upload-service";

export interface UpdatePasswordValues {
  empImg: File;
}

ChangeProfilePicture.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

function ChangeProfilePicture({ setOpen }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const FORM_VALIDATION = Yup.object().shape({
    empImg: Yup.mixed()
      .nullable()
      .required("Profie picture required")
      .test("FILE_SIZE", "Uploaded file is too big.", (value: any) => {
        return !(value instanceof File) || (value && value?.size <= IMAGE_SIZE);
      })
      .test("FILE_FORMAT", "Uploaded file has unsupported format.", (value: any) => {
        return !(value instanceof File) || (value && IMAGE_SUPPORTED_FORMATS.includes(`${value?.type},`));
      }),
  });

  const updateProfileImage = async (itemData: UpdatePasswordValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    try {
      const response = await UploadService.replaceMyProfilePicture(itemData.empImg);
      if (response) {
        openSuccessDialog("Success", `Profile image updated successfully`);
        setOpen(false);
        setIsLoading(false);
      }
      return null;
    } catch (error) {
      console.error("Error uploading image", error);
      setSubmitting(false);
      setIsLoading(false);
      return null;
    }
  };

  return (
    <Formik
      initialValues={{
        empImg: {},
      }}
      enableReinitialize
      validationSchema={FORM_VALIDATION}
      onSubmit={(values: any, { setSubmitting }) => {
        updateProfileImage(values, setSubmitting);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ItemImageUpload accept=".jpg,.png,.jpeg" label="Upload Profile Image" maxFileSizeInBytes={IMAGE_SIZE} name="empImg" />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                py: 2,
              }}
            >
              <ButtonWrapper color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                {isLoading && (
                  <CircularProgress
                    size={"20px"}
                    sx={{
                      mr: 1,
                      color: "gray",
                    }}
                  />
                )}
                Save
              </ButtonWrapper>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default ChangeProfilePicture;
