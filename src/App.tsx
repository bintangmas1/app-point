// App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import AllCustomers from "./components/AllCustomers/Index";
import CustomerDetail from "./components/CustomersDetail/Index";
import LogsIndex from "./components/Logs/Index";
import Profile from "./components/Profil/Index";
import Workers from "./components/Worker/Index";
import WorkerDetail from "./components/WorkersDetail/Index";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: "/worker",
    element: (
      <ProtectedRoute>
        <Workers />
      </ProtectedRoute>
    )
  },
  {
    path: "/worker/add",
    element: (
      <ProtectedRoute>
        <Workers />
      </ProtectedRoute>
    )
  },
  {
    path: "/worker/detail/:id",
    element: (
      <ProtectedRoute>
        <WorkerDetail />
      </ProtectedRoute>
    )
  },
  {
    path: "/customer",
    element: (
      <ProtectedRoute>
        <AllCustomers />
      </ProtectedRoute>
    )
  },
  {
    path: "/customer/detail/:id",
    element: (
      <ProtectedRoute>
        <CustomerDetail />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/logs",
    element: (
      <ProtectedRoute>
        <LogsIndex />
      </ProtectedRoute>
    )
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;