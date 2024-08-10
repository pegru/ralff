import {useAppRoutes} from './useAppRoutes'
import {createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';


const Routes = () => {
  const {routes} = useAppRoutes();

  return (
    <RouterProvider router={createBrowserRouter(createRoutesFromElements(routes), {
      basename: '/'
    })}/>
  )
};

export default Routes;