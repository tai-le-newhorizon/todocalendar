import "./app.style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./app.layout";
import Admin from "../admin/admin";
import Site from "../site/site";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "admin",
        element: <Admin />
      },
      {
        path: "/",
        element: <Site />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
