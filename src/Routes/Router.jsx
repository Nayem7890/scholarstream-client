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
import AdminRoute from "./AdminRoute";
import ModeratorRoute from "./ModeratorRoute";
import Profile from "../pages/Dashboard/Profile";
import MyApplications from "../pages/Dashboard/MyApplications";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import AddScholarship from "../pages/Dashboard/AddScholarship";
import ManageScholarships from "../pages/Dashboard/ManageScholarships";
import Analytics from "../pages/Dashboard/Analytics";
import ManageApplications from "../pages/Dashboard/ManageApplications";
import AllReviews from "../pages/Dashboard/AllReviews";
import MyReviews from "../pages/Dashboard/MyReviews";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <NotFound />,
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
      // ADMIN
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        )
      },
      {
        path: "add-scholarship",
        element: (
          <AdminRoute>
            <AddScholarship></AddScholarship>
          </AdminRoute>
        )
      },
      {
        path: "manage-scholarships",
        element: (
          <AdminRoute>
            <ManageScholarships></ManageScholarships>
          </AdminRoute>
        )
      },
      {
        path: "analytics",
        element: (
          <AdminRoute>
            <Analytics></Analytics>
          </AdminRoute>
        )
      },

      // MODERATOR
      {
        path: "manage-applications",
        element: (
          <ModeratorRoute>
            <ManageApplications></ManageApplications>
          </ModeratorRoute>
        )
      },
      {
        path: "all-reviews",
        element: (
          <ModeratorRoute>
            <AllReviews></AllReviews>
          </ModeratorRoute>
        )
      },

      // STUDENT
      {
        path: "my-applications",
        element: <MyApplications></MyApplications>
      },
      {
        path: "my-reviews",
        element: <MyReviews></MyReviews>
      }
    ]
  },
  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />
  }
]);