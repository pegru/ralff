import {useController} from 'react-hook-form';
import useDisabled from "../hooks/use-disabled.tsx";
import {SavingsFormDto} from "../types/savings-form-dto.ts";
import {FORM_TITLE} from "../../../utils/constants.ts";
import {TextField} from "@mui/material";


export const TitleWithDisabled = () => {
  const disabled = useDisabled<SavingsFormDto>({dependencies: [], fieldName: FORM_TITLE});
  return <Title disabled={disabled}/>
}

export interface TitleProps {
  disabled?: boolean;
}

export const Title = ({disabled = false}: TitleProps) => {
  const {field, fieldState: {error}} = useController({
    name: FORM_TITLE, rules: {
      required: {value: true, message: 'Enter Title'},
      maxLength: {value: 10, message: 'Input too long'}
    }
  })
  return (
    <TextField
      required
      label='Title'
      disabled={disabled}
      placeholder={'Enter Title'}
      error={!!error}
      helperText={error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      slotProps={{
        inputLabel: {
          shrink: true
        }
      }}
    />
  );
};