import {useAppRoutes} from "./use-app-routes.tsx";
import {createBrowserRouter, createRoutesFromElements, RouterProvider} from "react-router-dom";
import {URL_HOME} from "../utils/constants.ts";

export const Routes = () => {
  const {routes} = useAppRoutes();
  return (
    <RouterProvider router={createBrowserRouter(createRoutesFromElements(routes), {
      basename: URL_HOME
    })}/>
  )
};