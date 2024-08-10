import React from 'react';
import {FieldArrayWithId} from 'react-hook-form';
import {SavingsFormDto} from '../../../model/savings-form-dto';
import {Divider, Grid, GridItem, GridItem1} from './styles';
import RowElement from './row-element';

export interface SavingsTableCustomProps {
  readonly fields: FieldArrayWithId<SavingsFormDto, 'savings', 'id'>[],
  readonly remove: (index?: number | number[]) => void
}

const SavingsTable = ({fields, remove}: SavingsTableCustomProps) => {
  return (
    <div style={{width: '100%'}}>
      <Grid>
        <GridItem>Year</GridItem>
        <GridItem>Month</GridItem>
        <GridItem1>Savings</GridItem1>
      </Grid>
      <Divider/>
      <Grid>
        {fields.map((field, index) =>
          <RowElement key={field.id} index={index} data={field} remove={remove}/>
        )}
      </Grid>
    </div>
  );
};

export default SavingsTable;