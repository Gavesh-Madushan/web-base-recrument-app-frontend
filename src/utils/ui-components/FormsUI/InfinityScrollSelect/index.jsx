import React, { useState, useEffect } from "react";
import {useField, useFormikContext} from 'formik';
import { MenuItem, CircularProgress, TextField } from "@mui/material";

const InfiniteScrollSelect = ({name, customHandleChange, fetchData, ...otherProps}) => {
    const {setFieldValue} = useFormikContext();
    const [field, meta] = useField(name);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Whether there are more items to load
  const [page, setPage] = useState(1); // Page number for data fetching

  const handleChange = evt => {
    const {value} = evt.target;
    setFieldValue(name, value);
    customHandleChange(evt);
};

const configSelect = {
    ...field,
    ...otherProps,
    variant: 'outlined',
    fullWidth: true,
    select: true,
    margin: "dense",
    onChange: handleChange
};

if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
}

  // Simulate an API call
  const fetchOptions = async (page) => {
    setLoading(true);
    try {
      const newOptions = await fetchData(page - 1); 
      setOptions((prevOptions) => [...prevOptions, ...newOptions]);
      setHasMore(newOptions.length > 0);
  
    } catch (error) {
      console.error("Error fetching options:", error); // Handle any errors from fetchData
    } finally {
      setLoading(false); // Stop loading, regardless of success or failure
    }
  };

  useEffect(() => {
    fetchOptions(page);
  }, [page]);

  const handleScroll = (event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
      <TextField
          {...configSelect}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                onScroll: handleScroll,
              },
            },
          }}
      >
        {options.length > 0 ? options.map((item, pos) => {
            return (
                <MenuItem key={pos} value={item.value}>
                    {item.label}
                </MenuItem>
            )
        }):
            <MenuItem disabled>
                No Data
            </MenuItem>
        }
        
        {/* Show loading spinner if still fetching data */}
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        )}

        {/* Show message if no more data */}
        {!hasMore && options.length > 0 && <MenuItem disabled>No more items</MenuItem>}
    </TextField>
  );
};

export default InfiniteScrollSelect;
