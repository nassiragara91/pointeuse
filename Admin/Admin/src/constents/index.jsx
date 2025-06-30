import {
    Home,
    Users,
    Package,
    PackagePlus,
    ShoppingBag,
  } from "lucide-react";
  
  // This file just exports the sidebar navigation links
  export const navbarLinks = [
    {
      title: "Dashboard",
      links: [
        {
          label: "Dashboard",
          icon: Home,
          path: "/",
        },
      ],
    },
    {
      title: "Customers",
      links: [
        {
          label: "Customers",
          icon: Users,
          path: "/customers",
        },
      ],
    },
    {
      title: "Products",
      links: [
        {
          label: "Products",
          icon: Package,
          path: "/products",
        },
        {
          label: "New product",
          icon: PackagePlus,
          path: "/new-product",
        },
        {
          label: "Inventory",
          icon: ShoppingBag,
          path: "/inventory",
        },
      ],
    },
  ];
  