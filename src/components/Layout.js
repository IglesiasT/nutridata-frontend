import * as React from 'react';
import { useState, useEffect } from 'react';
// Router
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
// Material UI components
import { 
  AppBar, 
  Toolbar, 
  Drawer, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Collapse,
  ListItemButton,
  Tooltip
} from '@mui/material';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Experimental_CssVarsProvider as CssVarsProvider, useColorScheme } from '@mui/material/styles';
// Pages
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import UserProfilePage from './user-profile/UserProfilePage';
// Auth
import { useAuth } from '../context/AuthContext';
import Login from './Login';
// Theme
import { useThemeContext } from "../theme/ThemeContextProvider";
// Assets
import logo from '../assets/images/nutridata-logo.webp';

const NAVIGATION_ITEMS = [
  {
    title: 'Main Items',
    type: 'header'
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    type: 'item'
  },
  {
    title: 'Patients',
    icon: <PeopleIcon />,
    path: '/patients',
    type: 'item'
  },
  {
    type: 'divider'
  },
  {
    title: 'Analytics',
    type: 'header'
  },
  {
    title: 'Reports',
    icon: <BarChartIcon />,
    type: 'expandable',
    children: [
      {
        title: 'Sales',
        icon: <DescriptionIcon />,
        path: '/reports/sales',
        type: 'item'
      },
      {
        title: 'Traffic',
        icon: <DescriptionIcon />,
        path: '/reports/traffic',
        type: 'item'
      }
    ]
  }
];

// Theme toggle component
const ThemeToggle = () => {
  const { mode, toggleColorMode } = useThemeContext();
  
  return (
    <Tooltip title={mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
      <IconButton
        color="inherit"
        onClick={toggleColorMode}
        sx={{ ml: 1 }}
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

// Navigation item component
const NavItem = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = location.pathname === item.path;

  if (item.type === 'header') {
    return (
      <Typography
        variant="overline"
        sx={{
          px: 3,
          mt: 2,
          mb: 1,
          display: 'block',
          color: 'text.secondary',
          fontWeight: 'bold'
        }}
      >
        {item.title}
      </Typography>
    );
  }

  if (item.type === 'divider') {
    return <Divider sx={{ my: 2 }} />;
  }

  if (item.type === 'expandable') {
    return (
      <>
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child, index) => (
              <ListItemButton 
                key={index}
                sx={{ pl: 4 }}
                selected={location.pathname === child.path}
                onClick={() => navigate(child.path)}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.title} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemButton
      selected={isActive}
      onClick={() => navigate(item.path)}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.title} />
    </ListItemButton>
  );
};

// Sidebar component
const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent />
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};

const SidebarContent = () => {
  const { mode } = useColorScheme();
  
  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2
        }}
      >
        <img src={logo} alt="NutriData Logo" style={{ height: 40 }} />
        <Typography variant="h6" sx={{ ml: 1 }}>
          NutriData
        </Typography>
      </Box>
      <Divider />
      <List>
        {NAVIGATION_ITEMS.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </List>
    </Box>
  );
};

const UserProfileMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout, user } = useAuth(); // Access user and logout function from AuthContext
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ThemeToggle />
        <IconButton
          onClick={handleMenu}
          color="inherit"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          sx={{ ml: 1 }}
        >
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
        <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body1">{user?.username || 'Usuario'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.email || 'usuario@ejemplo.com'}
          </Typography>
        </Box>
      </Box>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mi Perfil" />
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>
    </>
  );
};

// Private route component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main layout
function Layout() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, theme } = useThemeContext();
  const { isAuthenticated, loading } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  // If not authenticated, show the login page
  if (!isAuthenticated) {
    return (
      <CssVarsProvider theme={theme} defaultMode={mode}>
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Box>
      </CssVarsProvider>
    );
  }

  // If authenticated, show the main layout
  return (
    <CssVarsProvider theme={theme} defaultMode={mode}>
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          color="inherit"
          elevation={1}
          sx={{ 
            width: { sm: `calc(100% - ${drawerWidth}px)` }, 
            ml: { sm: `${drawerWidth}px` }
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <UserProfileMenu />
          </Toolbar>
        </AppBar>
        
        <Sidebar 
          drawerWidth={drawerWidth} 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle}
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            bgcolor: 'background.default',
            color: 'text.primary'
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/settings" element={<div>Página de configuración</div>} />
          </Routes>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default Layout;
