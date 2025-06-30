import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";
import '../src/app/globals.css';

import Layout from "../src/app/layout";
import DashboardPage from "./app/dashbord/page";
import Products from "./app/products/page";
import Users from "./app/users/page"
import AddProduct from "./app/addproduct/page"
import Inventory from "./app/inventory/page";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
               
               
                {
                    path: "customers",
                    element: <Users/>,
                },
                {
                    path: "new-customer",
                    element: <h1 className="title">New Customer</h1>,
                },
                
                {
                    path: "products",
                    element: <Products/>,
                },
                {
                    path: "new-product",
                    element: <AddProduct/>,
                },
                {
                    path: "inventory",
                    element: <Inventory/>,
                },
               
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
