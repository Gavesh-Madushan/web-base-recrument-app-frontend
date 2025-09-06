import React from "react";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useField, useFormikContext } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FormHelperText } from "@mui/material";

const CheckboxWrapper = ({
  name,
  legend,
  customHandleChange,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { checked } = evt.target;
    setFieldValue(name, checked);
    customHandleChange(evt);
  };

  const configCheckbox = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const configFormControl = {};
  if (meta && meta.touched && meta.error) {
    configFormControl.error = true;
    configFormControl.children = meta.error;
  }

  return (
    <FormControl>
      <FormGroup>
        <Stack direction="row">
          <FormControlLabel
            control={<Checkbox {...configCheckbox} checked={field.value} />}
            label=""
          />
          <Box mt={1.5}>{legend}</Box>
        </Stack>
      </FormGroup>
      <FormHelperText {...configFormControl}></FormHelperText>
    </FormControl>
  );
};

export default CheckboxWrapper;
