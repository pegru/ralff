import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {TITLE, URL_HOME} from "../../utils/constants.ts";
import {RocketLaunch} from "@mui/icons-material"
import {useNavigate} from "react-router-dom";

export const PageHeader = () => {
  const navigate = useNavigate();
  return (
    <AppBar position='static'>
      <Toolbar disableGutters>
        <IconButton onClick={() => navigate(URL_HOME)}>{<RocketLaunch sx={{color: '#ffffff'}}/>}</IconButton>
        <Typography variant='h4'>{TITLE}</Typography>
      </Toolbar>
    </AppBar>
  );
};