import {Route} from 'react-router-dom';
import App from '../App'
import DesignedLfPage from "../forms/designed-lf/designed-lf-page";
import SpfV1Page from "../forms/savings-plan-form/v1/spf-v1-page";
import SpfV2Page from "../forms/savings-plan-form/v2/spf-v2-page";
import HtmlLfPage from "../forms/html-lf/html-lf-page";

export const useAppRoutes = () => {
  const routes = (
    <Route>
      <Route path="/" element={<App/>}/>
      <Route path="/loginForm/html" element={<HtmlLfPage/>}/>
      <Route path="/loginForm/designed" element={<DesignedLfPage/>}/>
      <Route path="/savingsForm/v1" element={<SpfV1Page/>}/>
      <Route path="/savingsForm/v2" element={<SpfV2Page/>}/>
    </Route>
  );

  return {routes};
}