import React from 'react';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useFormState} from 'react-hook-form';
import {SavingsDto} from '../../../model/savings-dto';
import {GridItem, GridItem1} from './styles';

export interface RowElementProps {
  readonly index: number,
  readonly data: SavingsDto,
  readonly remove: (index?: number | number[]) => void
}

const RowElement = ({index, data, remove}: RowElementProps) => {
  const {register, setValue} = useFormContext();
  const {errors} = useFormState({name: `savings.${index}.amount`})

  register(`savings.${index}.amount` as const, {
    valueAsNumber: true,
    required: {value: true, message: 'Required'},
    min: {value: 10, message: '>10'},
    max: {value: 1000, message: '<1000'}
  })

  const getStatus = (): 'success' | 'error' | undefined => {
    if (Array.isArray(errors?.savings)) {
      return errors?.savings[index]?.amount ? 'error' : 'success';
    }
    return 'success';
  }

  const getText = (): string | undefined => {
    if (Array.isArray(errors?.savings)) {
      return errors?.savings[index]?.amount?.message ?? ''
    }
    return undefined;
  }

  return (
    <>
      <GridItem>{data.paymentDate?.getFullYear() ?? '-'}</GridItem>
      <GridItem>{data.paymentDate?.getMonth() ?? '-'}</GridItem>
      <GridItem1>
        <TextField
          id={`monthly-saving-${index}`}
          inputAriaLabel={`monthly-saving-${index}`}
          size={TextField.sizes.SMALL}
          type={TextField.types.NUMBER}
          value={data?.amount?.toString()}
          onChange={value => setValue(`savings.${index}.amount`, value ? +value : undefined, {shouldValidate: true})}
          validation={{
            status: getStatus(),
            text: getText()
          }}
        />
      </GridItem1>
      <GridItem>
        <button id={`del-monthly-saving-${index}`} type={'button'} onClick={() => remove(index)}>X</button>
      </GridItem>
    </>
  );
};

export default RowElement;