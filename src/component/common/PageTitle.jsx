import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Divider, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link as RouterLink } from 'react-router-dom';

export default function PageTitle({ titleText, isLoggedIn = false, userInfo = null }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position='static'
        color='transparent'
        elevation={0}
        sx={{ maxWidth: '490px', margin: '0px auto 10px', height: '48px' }} // AppBar 高度為 48px
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: '48px !important', // 使用 !important 強制覆蓋
            height: '48px !important', // 使用 !important 強制覆蓋
            paddingLeft: 0,
            paddingRight: 0,
            position: 'relative', // 使用相對定位
          }}
        >
          <div
            style={{
              textAlign: 'center',
              lineHeight: '48px', // 确保文字垂直居中
              fontSize: '1.25rem',
              margin: '0 auto',
              width: '100%',
              position: 'absolute',
              left: '0',
              right: '0',
              fontWeight: 500,
            }}
          >
            {titleText}
          </div>
          <Box sx={{ flexGrow: 1 }} /> {/* 使用 Box 佔據左邊空間 */}
          {isLoggedIn && (
            <IconButton
              edge='end'
              sx={{
                color: 'rgba(0, 0, 0, 0.54)',
                padding: 0,
                width: '48px',
                height: '48px', // 強制 IconButton 高度與 Toolbar 匹配
                position: 'absolute',
                right: 8, // 將 IconButton 固定在右側
              }}
              onClick={toggleDrawer(true)}
            >
              <AccountCircleIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
      </AppBar>

      {isLoggedIn && <DrawerPanel drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} userInfo={userInfo} />}
    </>
  );
}

function DrawerPanel(props) {
  const { drawerOpen, toggleDrawer, userInfo } = props;
  return (
    <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
      <div role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250, padding: '8px' }}>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>{userInfo.id.toUpperCase()}</Typography>} />
          <IconButton
            edge='end'
            size='small'
            sx={{
              padding: 0,
            }}
            onClick={toggleDrawer(false)}
          >
            <CloseIcon />
          </IconButton>
        </ListItem>
        <Divider sx={{ margin: '0' }} />
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <RouterLink to='/my/setting' style={{ textDecoration: 'none', color: 'inherit' }}>
                設定推播關鍵字
              </RouterLink>
            }
          />
        </ListItem>
      </div>
    </Drawer>
  );
}
