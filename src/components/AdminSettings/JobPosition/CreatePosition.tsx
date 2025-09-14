import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid } from "@mui/material";
import { JobPositionValues } from ".";
import { useCreateJobPosition, useListJobCategories } from "../../../kubb";
import { applyGlobalValidations } from "../../../utils/utils";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import { gridSpacing } from "../../../store/constants";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";

function CreateJobPosition({
  initialItem,
  setOpen,
  fetchData,
}: {
  readonly initialItem: JobPositionValues;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly fetchData: () => void;
}) {
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string().required("Please enter the name"),
    categoryId: Yup.number().required("Please select a category"),
  });

  const createJobPositionMutation = useCreateJobPosition();

  const listCategory = useListJobCategories({
    page: 0,
    pageSize: 50,
  });

  return (
    <Formik
      initialValues={{
        ...initialItem,
      }}
      validationSchema={applyGlobalValidations(FORM_VALIDATION)}
      onSubmit={async (values: JobPositionValues, { setSubmitting }) => {
        try {
          const createResponse = await createJobPositionMutation.mutateAsync({
            data: {
              name: values.name ?? "",
              categoryId: values.categoryId,
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
              <SelectWrapper
                required
                name="categoryId"
                label="Category"
                options={(listCategory.data?.data || []).map((item) => ({ value: item.id, label: item.name }))}
                customHandleChange={() => {}}
              />
            </Grid>
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
                  {createJobPositionMutation.isPending && (
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
                  {createJobPositionMutation.isPending && (
                    <CircularProgress
                      size={"20px"}
                      sx={{
                        mr: 1,
                        color: "gray",
                      }}
                    />
                  )}
                  {values?.id ? "Save" : "Create"} Job Position
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default CreateJobPosition;
