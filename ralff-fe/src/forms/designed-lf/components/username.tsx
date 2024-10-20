import {useController} from 'react-hook-form';
import {FormControl, TextField} from "@mui/material";
import {FORM_USERNAME} from "../../../utils/constants.ts";


export const Username = () => {
  const {field} = useController({
    name: FORM_USERNAME,
    rules: {
      required: {value: true, message: ''}
    }
  })
  return (
    <FormControl>
      <TextField
        id='username'
        label={FORM_USERNAME}
        variant='outlined'
        placeholder='Enter username'
        onBlur={field.onBlur}
        onChange={field.onChange}
        value={field.value}
      />
    </FormControl>

  );
};