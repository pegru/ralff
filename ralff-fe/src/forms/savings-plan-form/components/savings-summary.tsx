import {useWatch} from 'react-hook-form';
import {Box, Typography} from "@mui/material";
import {SavingsDto} from "../types/savings-dto.ts";
import {FORM_SAVINGS} from "../../../utils/constants.ts";

export const SavingsSummary = () => {
  const savings: SavingsDto[] = useWatch({name: FORM_SAVINGS}) as SavingsDto[]
  let total = 0;
  if (savings) {
    total = savings.reduce((partialSum, a) => {
      return partialSum + (a.amount ? +a.amount : 0)
    }, 0);
  }

  return (
    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'end', width: '100%'}}>
      <Typography>
        Total Savings
      </Typography>
      <Typography>
        {total} €
      </Typography>
    </Box>
  );
};