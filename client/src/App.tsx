import { redirect, Route,Navigate } from "react-router-dom";
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import UncaughtError from "./components/UncaughtError";
//import Homepage from "./pages/Homepage";
//import Page404 from "./pages/Page404";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ImportPage from "./pages/ImportPage";
import Dashboard from "./pages/Dashboard";
import Layout from "./layouts/layout";

function App() {
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route errorElement={<UncaughtError />} path="/" element={<Layout/>}>
         <Route index element={<LoginPage/>}/>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/signup" element={<SignupPage />} />
         <Route path="/import" element={<ImportPage />} />
         <Route path="/dashboard"
         loader={
          async()=>{
            const auth = JSON.parse(localStorage.getItem('authUser') || '{}');
            if(!auth){
              throw redirect(`/login`);
            }
            return null;
          }
         }
        element={<Dashboard />} />
         <Route path="*" element={<Navigate to="/login" />} />
         </Route>
      </>
    )
  );

  return (
      <RouterProvider router={router} />
  );
}

export default App;

