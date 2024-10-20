import {PropsWithChildren} from "react";
import {Box, Typography} from "@mui/material";

export interface FormContainerProps {
  title: string;
}

export const FormContainer = ({children, title}: PropsWithChildren<FormContainerProps>) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      border: '1px solid',
      borderColor: '#a4a4a4',
      borderRadius: 2,
      padding: '24px'
    }}>
      <Typography variant='h3'>{title}</Typography>
      {children}
    </Box>
  );
};
