import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid } from "@mui/material";
import { JobCategoryValues } from ".";
import { useCreateJobCategory } from "../../../kubb";
import { applyGlobalValidations } from "../../../utils/utils";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import { gridSpacing } from "../../../store/constants";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";

function CreateJobCategory({
  initialItem,
  setOpen,
  fetchData,
}: {
  readonly initialItem: JobCategoryValues;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly fetchData: () => void;
}) {
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string().required("Please enter the name"),
  });

  const createJobCategoryMutation = useCreateJobCategory();

  return (
    <Formik
      initialValues={{
        ...initialItem,
      }}
      validationSchema={applyGlobalValidations(FORM_VALIDATION)}
      onSubmit={async (values: JobCategoryValues, { setSubmitting }) => {
        try {
          const createResponse = await createJobCategoryMutation.mutateAsync({
            data: {
              name: values.name ?? "",
            },
          });
          openSuccessDialog("Success", `driver ${createResponse.name} added successfully`);
          setOpen(false);
          fetchData();
        } catch (error) {
          console.error("Error during submission:", error);
          // You might want to show an error notification here
        } finally {
          setSubmitting(false);
        }
      }}
      enableReinitialize
    >
      {({ values, dirty, isSubmitting, isValid }) => (
        <Form>
          <Grid container columnSpacing={gridSpacing}>
            <Grid item xs={12}>
              <TextFieldWrapper required type="text" name="name" label="Category Name" />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  py: 2,
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  sx={{ mr: 1 }}
                >
                  {createJobCategoryMutation.isPending && (
                    <CircularProgress
                      size={"20px"}
                      sx={{
                        mr: 1,
                        color: "gray",
                      }}
                    />
                  )}
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  // onClick={()=>{console.log(values)}}
                  disabled={!dirty || isSubmitting || !isValid}
                >
                  {createJobCategoryMutation.isPending && (
                    <CircularProgress
                      size={"20px"}
                      sx={{
                        mr: 1,
                        color: "gray",
                      }}
                    />
                  )}
                  {values?.id ? "Save" : "Create"} Job Category
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default CreateJobCategory;
