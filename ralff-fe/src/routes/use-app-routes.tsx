import {Route} from "react-router-dom";
import App from "../App.tsx";
import {MainPage} from "../components/main-page/main-page.tsx";
import {HtmlLfPage} from "../forms/html-lf/html-lf-page.tsx";
import {DesignedLfPage} from "../forms/designed-lf/designed-lf-page.tsx";
import {URL_DESIGNED_LF, URL_HOME, URL_HTML_LF, URL_SPF_V1, URL_SPF_V2} from "../utils/constants.ts";
import {SpfV1Page} from "../forms/savings-plan-form/v1/spf-v1-page.tsx";
import {SpfV2Page} from "../forms/savings-plan-form/v2/spf-v2-page.tsx";

export const useAppRoutes = () => {
  const routes = (
    <Route element={<MainPage/>}>
      <Route path={URL_HOME} element={<App/>}/>
      <Route path={URL_HTML_LF} element={<HtmlLfPage/>}/>
      <Route path={URL_DESIGNED_LF} element={<DesignedLfPage/>}/>
      <Route path={URL_SPF_V1} element={<SpfV1Page/>}/>
      <Route path={URL_SPF_V2} element={<SpfV2Page/>}/>
    </Route>
  );

  return {routes};
}