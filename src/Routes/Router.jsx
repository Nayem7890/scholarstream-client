import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AllScholarships from "../pages/AllScholarships/AllScholarships";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import Checkout from "../pages/Payment/Checkout";
import DashboardLayout from "../layouts/DashboardLayout";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Dashboard/Profile";
import MyApplications from "../pages/Dashboard/MyApplications";
import ManageUsers from "../pages/Dashboard/ManageUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <div>404 Not Found</div>, // Placeholder
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>
      },
      {
        path: "register",
        element: <Register></Register>
      },
      {
        path: "all-scholarships",
        element: <AllScholarships></AllScholarships>
      },
      {
        path: "scholarship/:id",
        element: <ScholarshipDetails></ScholarshipDetails>
      },
      {
        path: "payment/:id",
        element: <PrivateRoute><Checkout></Checkout></PrivateRoute>
      },
      {
        path: "payment-success",
        element: <PaymentSuccess></PaymentSuccess>
      }
    ],
  },
  {
    path: "dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        path: "profile",
        element: <Profile></Profile>
      },
      // Admin
      {
        path: "manage-users",
        element: <ManageUsers></ManageUsers>
      },
      {
        path: "manage-scholarships",
        element: <div>Manage Scholarships</div> // Still placeholder or create later
      },
      // Student
      {
        path: "my-applications",
        element: <MyApplications></MyApplications>
      },
      {
        path: "my-reviews",
        element: <div>My Reviews</div>
      }
    ]
  }
]);