import {useFieldArray, useFormContext} from "react-hook-form";
import {SavingsFormDto} from "../../types/savings-form-dto.ts";
import {FORM_SAVINGS} from "../../../../utils/constants.ts";
import {Divider, Grid, GridItem, GridItem1} from "./styles.ts";
import {SavingsDto} from "../../types/savings-dto.ts";
import {RowElement, RowElementWithDisabled} from "./row-element.tsx";

export interface SavingsTableProps {
  mode: 'normal' | 'disabled';
}

export const SavingsTable = ({mode}: SavingsTableProps) => {
  const {control} = useFormContext<SavingsFormDto>()
  const {
    fields: savingFields,
    remove,
  } = useFieldArray({
    control,
    name: FORM_SAVINGS,
    shouldUnregister: false
  });
  return (
    <div style={{width: '100%'}}>
      <Grid>
        <GridItem>Year</GridItem>
        <GridItem>Month</GridItem>
        <GridItem1>Savings</GridItem1>
      </Grid>
      <Divider/>
      <Grid>
        {savingFields.map((field, index) => {
          if (mode === 'disabled') {
            return <RowElementWithDisabled key={field.id} index={index} data={field as SavingsDto} remove={remove}/>
          } else {
            return <RowElement key={field.id} index={index} data={field as SavingsDto} remove={remove}/>
          }
        })}
      </Grid>
    </div>
  );
};