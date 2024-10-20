import {useNavigate} from 'react-router-dom';
import {Box, Button} from "@mui/material";
import {URL_HOME} from "../utils/constants.ts";

interface SubmitFooterProps {
  disabled: boolean
}

export const SubmitFooter = ({disabled = true}: SubmitFooterProps) => {
  const navigate = useNavigate();
  return (
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
      <Button variant='outlined' onClick={() => navigate(URL_HOME)}>
        Cancel
      </Button>
      <Button variant='contained' disabled={disabled} type='submit'>
        Submit
      </Button>
    </Box>
  );
};