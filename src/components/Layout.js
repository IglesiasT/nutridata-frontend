import * as React from 'react';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';

// Components
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import UserProfilePage from './pages/UserProfilePage';

import theme from '../theme/theme';
import logo from '../assets/images/nutridata-logo.webp';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'patients',
    title: 'Patients',
    icon: <PeopleIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
];


const mockSession = {
  user: {
    name: "Usuario",
    email: "usuario@ejemplo.com",
    image: null  // Add a URL to an image here
  }
};

const authentication = {
  signIn: () => {
    // Implement a real sign-in method here
    console.log("Iniciando sesión...");
  },
  signOut: () => {
    // Same for sign-out
    console.log("Cerrando sesión...");
    // Then redirect to the home page
    window.location.href = '/';
  }
};

export default function Layout() {
  return (
    <Router>
      <AppProvider
        navigation={NAVIGATION}
        theme={theme}
        branding={{
          logo: <img src={logo} alt="NutriData logo" />,
          title: 'NutriData',
          homeUrl: '/',
        }}
        session={mockSession}
        authentication={authentication}
      >
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailsPage />} />
            <Route path="/profile" element={UserProfilePage} />
          </Routes>
        </DashboardLayout>
      </AppProvider>
    </Router>
  );
}
