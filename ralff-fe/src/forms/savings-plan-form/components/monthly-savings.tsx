import {useController} from 'react-hook-form';
import {TextField} from "@mui/material";
import {FORM_END_DATE, FORM_MONTHLY_SAVINGS, FORM_START_DATE, FORM_TITLE} from "../../../utils/constants.ts";
import useDisabled from "../hooks/use-disabled.tsx";

export const MonthlySavingsWithDisabled = () => {
  const disabled = useDisabled({dependencies: [FORM_TITLE, FORM_START_DATE, FORM_END_DATE], fieldName: FORM_MONTHLY_SAVINGS})
  return <MonthlySavings disabled={disabled}/>
}

export interface MonthlySavingsProps {
  disabled?: boolean;
}

export const MonthlySavings = ({disabled}: MonthlySavingsProps) => {
  const {field, fieldState: {error}} = useController({
    name: FORM_MONTHLY_SAVINGS, rules: {
      required: {value: true, message: 'Enter a number'},
      min: {value: 10, message: 'Minimum saving amount is 10€'},
      max: {value: 1000, message: 'Maximum saving amount is 1.000€'},
      validate: v => isNaN(+v) ? "Enter a number" : true
    }
  });

  return (
    <TextField
      required
      label="Monthly savings"
      type="number"
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      value={field.value}
      placeholder='Enter monthly savings'
      error={!!error}
      helperText={error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled}
    />
  );
};