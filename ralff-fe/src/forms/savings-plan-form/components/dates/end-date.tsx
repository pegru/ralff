import {useController} from 'react-hook-form';
import {validateDate} from '../../../../utils/date-utils.ts';
import useDisabled from '../../hooks/use-disabled.tsx';
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {FORM_END_DATE, FORM_START_DATE, FORM_TITLE} from "../../../../utils/constants.ts";
import {SavingsFormDto} from "../../types/savings-form-dto.ts";

export const EndDateWithDisabled = () => {
  const disabled = useDisabled({dependencies: [FORM_TITLE, FORM_START_DATE], fieldName: FORM_END_DATE});
  return <EndDate disabled={disabled}/>
}

export interface EndDateProps {
  disabled?: boolean;
}

export const EndDate = ({disabled = false}: EndDateProps) => {
  const {field, fieldState: {error}} = useController({
    name: FORM_END_DATE, rules: {
      validate: {
        valid: validateDate,
        afterStart: (value, formValues) => {
          const {startDate, endDate} = formValues as SavingsFormDto;
          if (startDate && endDate && startDate >= endDate) {
            return "Date must be after start"
          }
          return true;
        }
      },
    }
  });
  return (
    <DatePicker
      label='End date'
      value={field.value}
      onChange={(v) => {
        field.onChange(v);
        field.onBlur();
      }}
      onClose={field.onBlur}
      disabled={disabled}
      slotProps={{
        textField: {
          InputLabelProps: {
            required: true,
            shrink: true
          },
          error: !!error,
          helperText: error?.message ?? ''
        }
      }}
      sx={{width: '50%'}}
    />
  );
};