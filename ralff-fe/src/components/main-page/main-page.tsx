import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import {PageHeader} from "./page-header.tsx";
import {Outlet} from "react-router-dom";
import {theme} from "../../utils/theme.ts";

export const MainPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container sx={{bgcolor: '#ffffff', height: '100vh', overflowY: 'auto'}} maxWidth={false} disableGutters>
        <PageHeader/>
        <Container maxWidth={false} sx={{paddingTop: '24px', height: '100vh'}}>
          <Outlet/>
        </Container>
      </Container>
    </ThemeProvider>
  );
};
