import {useController} from 'react-hook-form';
import {TextField} from "@mui/material";
import {FORM_PASSWORD} from "../../../utils/constants.ts";

export const Password = () => {
  const {field} = useController({
    name: FORM_PASSWORD,
    rules: {
      required: {value: true, message: ''}
    }
  })
  return (
    <TextField
      id='password'
      type='password'
      placeholder={'Enter password'}
      label={FORM_PASSWORD}
      onBlur={field.onBlur}
      onChange={field.onChange}
      value={field.value}
    />
  );
};