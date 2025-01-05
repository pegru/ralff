import {useFormContext} from 'react-hook-form';
import {Button} from "@mui/material";
import {FORM_END_DATE, FORM_MONTHLY_SAVINGS, FORM_SAVINGS, FORM_START_DATE, FORM_TITLE} from "../../../utils/constants.ts";
import {SavingsFormDto} from "../types/savings-form-dto.ts";
import {SavingsDto} from "../types/savings-dto.ts";
import useDisabled from "../hooks/use-disabled.tsx";

export const GenerateWithDisabled = () => {
  const disabled = useDisabled({dependencies: [FORM_TITLE, FORM_START_DATE, FORM_END_DATE, FORM_MONTHLY_SAVINGS]});
  return <Generate disabled={disabled}/>
}

export interface GenerateProps {
  disabled?: boolean;
}

export const Generate = ({disabled}: GenerateProps) => {
  const {trigger, getValues, setValue} = useFormContext();

  const onClick = async () => {
    const result = await trigger([FORM_TITLE, FORM_START_DATE, FORM_END_DATE, FORM_MONTHLY_SAVINGS])
    // console.log(getValues())
    if (!result) {
      return;
    }
    // console.log('Generating')

    // generate savings entries
    const savingsFormDto: SavingsFormDto = getValues() as SavingsFormDto;
    if (!savingsFormDto.startDate || !savingsFormDto.endDate) {
      return;
    }

    const startDate = new Date(savingsFormDto.startDate);
    const endDate = new Date(savingsFormDto.endDate);
    const savings: SavingsDto[] = [];

    const iterator = new Date(startDate);
    while (iterator.getTime() < endDate.getTime()) {
      iterator.setMonth(iterator.getMonth() + 1);
      savings.push({
        paymentDate: new Date(iterator),
        amount: savingsFormDto.monthlySavings
      });
    }

    setValue(FORM_SAVINGS, savings);
  }

  return (
    <Button disabled={disabled} variant='contained' sx={{alignSelf: 'end'}} onClick={onClick}>
      {'Generate'}
    </Button>
  );
};