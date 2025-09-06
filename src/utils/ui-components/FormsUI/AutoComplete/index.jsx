import React from "react";
import {useField, useFormikContext} from "formik";
import {Autocomplete, TextField} from "@mui/material";

const AutoCompleteWrapper = ({freeSolo, disabled, name, options, ...otherProps}) => {
    const {setFieldValue} = useFormikContext();
    const [field, mata] = useField(name);

    const handleChange = (event, value, reason) => {
        setFieldValue(name, value);
    };

    const configAutocomplete = {
        ...field,
        ...otherProps,
        variant: "outlined",
        fullWidth: true,
    };

    if (mata && mata.touched && mata.error) {
        configAutocomplete.error = true;
        configAutocomplete.helperText = mata.error;
    }

    return (
        <Autocomplete freeSolo={freeSolo}
                      disabled={disabled}
                      value={field.value}
                      onInputChange={handleChange}
                      options={options}
                      renderInput={(params) => (
                          <TextField {...params} {...configAutocomplete} disabled={disabled} margin="dense"/>
                      )}
        />
    );
};

export default AutoCompleteWrapper;
