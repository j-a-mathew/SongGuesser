import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';

interface inputType{
    name: string;
    placeholder: string;
}

// General Input component using TextField to be re-used

export const Input = forwardRef((props:inputType, ref) => {
    return (
        <TextField
            variant="outlined"
            required
            margin="normal"
            inputRef={ref}
            fullWidth
            type="text"
            {...props}
        ></TextField>
    ); 
});