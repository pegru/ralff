import {useController, useFormContext, useFormState} from 'react-hook-form';
import useDisabled from "../../hooks/use-disabled.tsx";
import {FORM_END_DATE, FORM_START_DATE, FORM_TITLE} from "../../../../utils/constants.ts";
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {validateDate} from "../../../../utils/date-utils.ts";
import {PickerValidDate} from "@mui/x-date-pickers";

export const StartDateWithDisabled = () => {
  const disabled = useDisabled({dependencies: FORM_TITLE, fieldName: FORM_START_DATE});
  return <StartDate disabled={disabled}/>
}

export interface StartDateProps {
  disabled?: boolean;
}

export const StartDate = ({disabled = false}: StartDateProps) => {
  const {trigger, getFieldState} = useFormContext();
  const formState = useFormState({name: FORM_END_DATE})

  // const [depsArray, setDepsArray] = useState<string[]>([]);
  // const endDate = useWatch({name: FORM_END_DATE});
  const {field, fieldState: {error}} = useController({
    name: FORM_START_DATE,
    rules: {
      validate: validateDate
    }
  });
  // useEffect(() => {
  //   // initialize once start date is set
  //   if (depsArray.length === 0 && endDate) {
  //     setDepsArray([FORM_END_DATE]);
  //   }
  // }, [depsArray.length, endDate]);

  const onChange = async (v: PickerValidDate | null) => {
    field.onChange(v);
    field.onBlur();
    if (getFieldState(FORM_END_DATE, formState).isDirty) {
      await trigger(FORM_END_DATE);
    }
  }

  return (
    <DatePicker
      label='Start date'
      value={field.value}
      onChange={onChange}
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