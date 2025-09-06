import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useField, useFormikContext } from "formik";
import { FormHelperText, useTheme } from "@mui/material";

type RadioGroupWrapperProps = {
  radioGroup: { label: string; value: string | number }[];
  disabled: boolean;
  name: string;
  label: string;
  customHandleChange?: (e: string | number) => void;
};

const RadioGroupWrapper: React.FC<RadioGroupWrapperProps> = ({
  name,
  label,
  disabled,
  radioGroup,
  customHandleChange,
  ...otherProps
}) => {
  const theme = useTheme();
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    setFieldValue(name, evt.target.value);
    customHandleChange && customHandleChange(evt.target.value);
  };

  const configRadioGroup = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const configFormControl: any = {};
  if (meta && meta.touched && meta.error) {
    configFormControl.error = true;
    configFormControl.children = meta.error;
  }

  return (
    <FormControl disabled={disabled}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row {...configRadioGroup}>
        {radioGroup.map((radio, index) => (
          <FormControlLabel
            key={index}
            value={radio.value}
            control={
              <Radio
                sx={{
                  color: theme.palette.primary.main,
                  "&.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            }
            label={radio.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText {...configFormControl}></FormHelperText>
    </FormControl>
  );
};

export default RadioGroupWrapper;
