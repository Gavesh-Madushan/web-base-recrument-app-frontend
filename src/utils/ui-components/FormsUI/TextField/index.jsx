import React from "react";
import { useField } from "formik";
import { TextField } from "@mui/material";

const TextFieldWrapper = ({ name, ...otherProps }) => {
  const [field, mata] = useField(name);

  const configTextfield = {
    ...field,
    variant: "outlined",
    ...otherProps,
    fullWidth: true,
  };

  if (mata && mata.touched && mata.error) {
    configTextfield.error = true;
    configTextfield.helperText = mata.error;
  }

  return (
    <TextField
      {...configTextfield}
      margin="dense"
    />
  );
};

export default TextFieldWrapper;
