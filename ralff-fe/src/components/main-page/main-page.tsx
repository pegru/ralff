import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import {PageHeader} from "./page-header.tsx";
import {Outlet} from "react-router-dom";
import {theme} from "../../utils/theme.ts";
import {CustomScrollRestoration} from "../custom-scroll-restoration.tsx";

export const MainPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container sx={{bgcolor: '#ffffff', height: '100vh'}} maxWidth={false} disableGutters>
        <PageHeader/>
        <Container maxWidth={false} sx={{paddingTop: '24px'}}>
          <Outlet/>
          <CustomScrollRestoration/>
        </Container>
      </Container>
    </ThemeProvider>
  );
};
