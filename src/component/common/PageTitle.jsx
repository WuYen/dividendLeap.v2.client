import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Divider, Link, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function PageTitle({ titleText, isLoggedIn = false }) {
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
          <Typography
            variant='h6'
            component='div'
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)', // 確保標題始終居中
              lineHeight: '48px', // 確保文字垂直居中
              fontSize: '1.25rem',
            }}
          >
            {titleText}
          </Typography>
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

      {isLoggedIn && <DrawerPanel drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />}
    </>
  );
}

function DrawerPanel(props) {
  const { drawerOpen, toggleDrawer } = props;
  return (
    <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
      <div role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250, padding: '8px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '48px', // Drawer 標題行高度設為 48px
          }}
        >
          <Typography
            variant='h6'
            sx={{
              lineHeight: '48px', // 確保文字垂直居中
              fontSize: '1.25rem',
            }}
          >
            用戶名稱
          </Typography>
          <IconButton
            edge='end'
            size='small'
            sx={{
              width: '48px',
              height: '48px',
              padding: 0,
              paddingRight: '8px',
            }}
            onClick={toggleDrawer(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Divider sx={{ margin: '0' }} />
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Link href='/my/setting' underline='none' sx={{ color: 'inherit' }}>
                設定推播關鍵字
              </Link>
            }
          />
        </ListItem>
        {/* <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemText
            primary={
              <Link href='/my' underline='none' sx={{ color: 'inherit' }}>
                MY PAGE
              </Link>
            }
          />
        </ListItem> */}
      </div>
    </Drawer>
  );
}
