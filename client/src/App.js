import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import VarietyList from './pages/Variety/VarietyList';
import VarietyDetails from './pages/Variety/VarietyDetails';
import VarietyForm from './pages/Variety/VarietyForm';
import TrayList from './pages/Tray/TrayList';
import TrayDetails from './pages/Tray/TrayDetails';
import TrayForm from './pages/Tray/TrayForm';
import ScheduleList from './pages/Schedule/ScheduleList';
import ScheduleDetails from './pages/Schedule/ScheduleDetails';
import ScheduleForm from './pages/Schedule/ScheduleForm';
import InventoryList from './pages/Inventory/InventoryList';
import SeedInventory from './pages/Inventory/SeedInventory';
import SupplyInventory from './pages/Inventory/SupplyInventory';
import InventoryForm from './pages/Inventory/InventoryForm';
import QualityList from './pages/Quality/QualityList';
import QualityDetails from './pages/Quality/QualityDetails';
import QualityForm from './pages/Quality/QualityForm';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import YieldAnalytics from './pages/Analytics/YieldAnalytics';
import CostAnalytics from './pages/Analytics/CostAnalytics';
import QualityAnalytics from './pages/Analytics/QualityAnalytics';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';
import AccountSettings from './pages/Settings/AccountSettings';
import NotificationSettings from './pages/Settings/NotificationSettings';
import MarketplacePage from './pages/Marketplace/MarketplacePage';
import MarketplaceListings from './pages/Marketplace/MarketplaceListings';
import MyListings from './pages/Marketplace/MyListings';
import ListingForm from './pages/Marketplace/ListingForm';
import SupplierProfile from './pages/Marketplace/SupplierProfile';
import MessagesPage from './pages/Marketplace/MessagesPage';
import OrdersPage from './pages/Marketplace/OrdersPage';
import Onboarding from './pages/Onboarding/Onboarding';
import PageNotFound from './pages/PageNotFound';

// Components
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout';
import OnboardingLayout from './components/Layout/OnboardingLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import LoadingScreen from './components/UI/LoadingScreen';
import AdminRoute from './components/Auth/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import SystemSettings from './pages/Admin/SystemSettings';

const App = () => {
  const { user, loading, checkAuth } = useAuthContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await checkAuth();
      setIsReady(true);
    };

    initializeApp();
  }, [checkAuth]);

  if (!isReady || loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Route>

        {/* Onboarding Routes */}
        <Route element={<OnboardingLayout />}>
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <AdminRoute>
              <MainLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          
          {/* Varieties Routes */}
          <Route path="/varieties" element={<VarietyList />} />
          <Route path="/varieties/new" element={<VarietyForm />} />
          <Route path="/varieties/:id" element={<VarietyDetails />} />
          <Route path="/varieties/:id/edit" element={<VarietyForm />} />
          
          {/* Trays Routes */}
          <Route path="/trays" element={<TrayList />} />
          <Route path="/trays/new" element={<TrayForm />} />
          <Route path="/trays/:id" element={<TrayDetails />} />
          <Route path="/trays/:id/edit" element={<TrayForm />} />
          
          {/* Schedules Routes */}
          <Route path="/schedules" element={<ScheduleList />} />
          <Route path="/schedules/new" element={<ScheduleForm />} />
          <Route path="/schedules/:id" element={<ScheduleDetails />} />
          <Route path="/schedules/:id/edit" element={<ScheduleForm />} />
          
          {/* Inventory Routes */}
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/seeds" element={<SeedInventory />} />
          <Route path="/inventory/seeds/new" element={<InventoryForm inventoryType="seed" />} />
          <Route path="/inventory/seeds/:id" element={<InventoryForm inventoryType="seed" />} />
          <Route path="/inventory/supplies" element={<SupplyInventory />} />
          <Route path="/inventory/supplies/new" element={<InventoryForm inventoryType="supply" />} />
          <Route path="/inventory/supplies/:id" element={<InventoryForm inventoryType="supply" />} />
          
          {/* Quality Routes */}
          <Route path="/quality" element={<QualityList />} />
          <Route path="/quality/new" element={<QualityForm />} />
          <Route path="/quality/:id" element={<QualityDetails />} />
          <Route path="/quality/:id/edit" element={<QualityForm />} />
          
          {/* Analytics Routes */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/yield" element={<YieldAnalytics />} />
          <Route path="/analytics/cost" element={<CostAnalytics />} />
          <Route path="/analytics/quality" element={<QualityAnalytics />} />
          
          {/* Profile & Settings Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          
          {/* Marketplace Routes */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/browse" element={<MarketplaceListings />} />
          <Route path="/marketplace/my-listings" element={<MyListings />} />
          <Route path="/marketplace/listings/new" element={<ListingForm />} />
          <Route path="/marketplace/listings/:id/edit" element={<ListingForm />} />
          <Route path="/marketplace/suppliers/:id" element={<SupplierProfile />} />
          <Route path="/marketplace/messages" element={<MessagesPage />} />
          <Route path="/marketplace/orders" element={<OrdersPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
