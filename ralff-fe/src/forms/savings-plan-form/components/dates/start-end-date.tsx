import {StartDate, StartDateWithDisabled} from "./start-date.tsx";
import {EndDate, EndDateWithDisabled} from "./end-date.tsx";
import {Box} from "@mui/material";
import {DisabledMode} from "../../types/types";

export interface StartEndDateProps {
  mode?: DisabledMode;
}

export const StartEndDate = ({mode = 'normal'}: StartEndDateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        justifyContent: 'space-between',
        width: '100%'
      }}>
      {mode === "normal" ? <StartDate/> : <StartDateWithDisabled/>}
      {mode === 'normal' ? <EndDate/> : <EndDateWithDisabled/>}
    </Box>
  );
};