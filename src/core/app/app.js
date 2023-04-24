import "./app.style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./app.layout";
import Site from "../site/site";
import AdminLayout from "../admin/admin.layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "admin",
        element: <AdminLayout />
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
