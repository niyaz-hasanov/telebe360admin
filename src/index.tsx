import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import EcommerceProductsPage from "./pages/e-commerce/products";
import AdminListPage from "./pages/admins/admin_list";
import UserListPage from "./pages/users/list";
import UnverifiedPage from './pages/users/unverified_users/list'
import VerifiedPage from './pages/users/verified_users/list'
import UniversityListPage from './pages/university/list';
import CompaniesListPage from './pages/companies/companies';
import BannerListPage from './pages/banners/banners';
import TicketsListPage from './pages/tickets/tickets';
import PrivateRoutes from "./utils/PrivateRoutes";
const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(

  <Flowbite theme={{ theme }}>
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/categories"
            element={<EcommerceProductsPage />}
          />
          <Route path="/users/list" element={<UserListPage />} />
          <Route path="/users/verified/list" element={<VerifiedPage />} />
          <Route path="/users/unverified/list" element={<UnverifiedPage />} />
          <Route path="/university/list" element={<UniversityListPage />} />
          <Route path="/admins/list" element={<AdminListPage />} />
          <Route path="/companies/list" element={<CompaniesListPage />} />
          <Route path="/banners/list" element={<BannerListPage />} />
          <Route path="/tickets/list" element={<TicketsListPage />} />
          

        </Route>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  </Flowbite>

);
