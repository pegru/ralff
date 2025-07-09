import {useController} from 'react-hook-form';
import {GridItem, GridItem1} from './styles';
import {SavingsDto} from "../../types/savings-dto.ts";
import {IconButton, TextField} from "@mui/material";
import {
  FORM_AMOUNT,
  FORM_END_DATE,
  FORM_MONTHLY_SAVINGS,
  FORM_SAVINGS,
  FORM_START_DATE,
  FORM_TITLE
} from "../../../../utils/constants.ts";
import useDisabled from "../../hooks/use-disabled.tsx";
import {Clear} from "@mui/icons-material";

export const RowElementWithDisabled = ({index, data, remove, disabled}: RowElementProps) => {
  const isDisabled = useDisabled({
    dependencies: [FORM_TITLE, FORM_START_DATE, FORM_END_DATE, FORM_MONTHLY_SAVINGS],
    fieldName: `savings.${index}.amount`
  });
  return <RowElement index={index} data={data} remove={remove} disabled={disabled || isDisabled}/>;
}

export interface RowElementProps {
  readonly index: number,
  readonly data: SavingsDto,
  readonly remove: (index?: number | number[]) => void,
  readonly disabled?: boolean | undefined;
}

export const RowElement = ({index, data, remove, disabled}: RowElementProps) => {
  const {field, fieldState: {error}} = useController({
    name: `${FORM_SAVINGS}.${index}.${FORM_AMOUNT}`, rules: {
      // @ts-ignore
      valueAsNumber: true,
      required: {value: true, message: 'Required'},
      min: {value: 10, message: '>10'},
      max: {value: 1000, message: '<1000'}
    }
  });

  return (
    <>
      <GridItem>{data.paymentDate?.getFullYear() ?? '-'}</GridItem>
      <GridItem>{data.paymentDate?.getMonth() ?? '-'}</GridItem>
      <GridItem1>
        <TextField
          id="outlined-number"
          required
          type="number"
          slotProps={{
            inputLabel: {
              shrink: false,
            },
          }}
          value={field.value}
          placeholder={'Enter monthly savings'}
          error={!!error}
          helperText={error?.message}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={disabled}
        />
      </GridItem1>
      <GridItem>
        <IconButton
          aria-label={`X-${index}`}
          disabled={disabled}
          onClick={() => remove(index)}
          id={`del-monthly-saving-${index}`}>
          <Clear/>
        </IconButton>
      </GridItem>
    </>
  );
};