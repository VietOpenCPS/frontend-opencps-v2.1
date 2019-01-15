import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withRoot from './withRoot';
import { withStyles } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import Button from '@material-ui/core/Button';

import { ToastContainer, toast } from 'react-toastify';

const themeDisplay = window.themeDisplay;
axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
const styles = theme => ({
  root: {
    textAlign: 'right',
    paddingTop: theme.spacing.unit * 0,
  },
  orangeAvatar: {
    marginTop: 8,
    color: '#fff',
    backgroundColor: deepOrange[500],
    width: 32,
    height: 32,
    fontSize: 14,
    fontWeight: '800',
  },
  btnNameAvata: {
    marginTop: 9,
    fontSize: 13,
    borderRadius: 28,
    marginLeft: -32,
    padding: '3px 12px',
    minHeight: 0,
    paddingLeft: 38,
    '-webkit-box-shadow': '0 4px 4px -4px rgba(0,0,0,.1), 0 0px 0px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0, 0.12)',
    boxShadow: '0 4px 4px -4px rgba(0,0,0,.1), 0 0px 0px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0, 0.12)'
  }
});

const pStyle = {
  top: '60px',
  right: '8%',
};

const chipStyle = {
  marginTop: '5px',
  marginLeft: '5px',
  backgroundColor: 'transparent'
};

const exitToAppStyle = {
  width: '15px',
  marginRight: '10px',
  color: '#C62828'
};

const userInfoStyle = {
  width: '15px',
  marginRight: '10px'
};

const btnNotiStyle = {
  height: '42px',
  width: '42px'
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null,
      isSignedIn: false,
      userNameLogin: '',
      forgottenURL: '/register/#/cap-lai-mat-khau',
      drawer: false,
      avatarURL: '',
      notificationCount: 0,
      isShowUserMenu: false,
      toggle_exclusive: 0,
      userData: {}
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.goToDangNhapPress = this.goToDangNhapPress.bind(this);
  }

  handleToggle() {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose() {
    this.setState({
      open: false,
    });
  };

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  componentDidMount() {
    let vm = this
    if (themeDisplay !== null && themeDisplay !== undefined) {
      let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      let forgottenURLStr = ''
      if (redirectURL !== '') {
        forgottenURLStr = redirectURL + '/register/#/cap-lai-mat-khau'
      } else {
        forgottenURLStr = themeDisplay.getURLHome() + '/register/#/cap-lai-mat-khau'
      }
      vm.setState({
        isSignedIn: themeDisplay.isSignedIn(),
        userNameLogin: themeDisplay.getUserName(),
        forgottenURL: forgottenURLStr
      })
      if (themeDisplay.isSignedIn()) {
        let param = {
          headers: {
            'Content-Type': 'application/json'
          },
          data: {}
        }
        axios.get('/o/v1/opencps/users/' + themeDisplay.getUserId(), param).then(function (response) {
          vm.setState({ userData: response.data })
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  };

  goToDangKyPage() {
    if (themeDisplay !== null && themeDisplay !== undefined) {
      // eslint-disable-next-line
      let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      if (redirectURL !== '') {
        window.location.href = redirectURL + '/register'
      } else {
        window.location.href = themeDisplay.getURLHome() + '/register'
      }
    } else {
      window.location.href = '/register'
    }
  };

  goToDangNhap() {
    axios.post('/o/v1/opencps/login', {}, {
      headers: {
        'Authorization': 'BASIC ' + window.btoa(window.document.getElementById("_npmreactlogin_login").value + ":" + window.document.getElementById("_npmreactlogin_password").value)
      }
    }).then(function (response) {
      if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha') {
        if (response.data === 'pending') {
          window.location.href = window.themeDisplay.getURLHome() +
          "/register#/xac-thuc-tai-khoan?active_user_id=" + window.themeDisplay.getUserId() +
            "&redirectURL=" + window.themeDisplay.getURLHome()
        } else {
          window.location.href = response.data
        }
      } else if (response.data === 'ok') {
        window.location.href = window.themeDisplay.getURLHome()
      } else if (response.data === 'captcha') {
        let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        if (redirectURL !== '') {
          window.location.href = redirectURL + '/register#/login'
        } else {
          window.location.href = themeDisplay.getURLHome() + '/register#/login'
        }
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
      }
    }).catch(function (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
    })
  };

  goToDangNhapPress(e) {
    if(e.keyCode == 13){
      axios.post('/o/v1/opencps/login', {}, {
        headers: {
          'Authorization': 'BASIC ' + window.btoa(window.document.getElementById("_npmreactlogin_login").value + ":" + window.document.getElementById("_npmreactlogin_password").value)
        }
      }).then(function (response) {
        console.log(response.data)
        if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha') {
          if (response.data === 'pending') {
            window.location.href = window.themeDisplay.getURLHome() +
            "/register#/xac-thuc-tai-khoan?active_user_id=" + window.themeDisplay.getUserId() +
              "&redirectURL=" + window.themeDisplay.getURLHome()
          } else {
            window.location.href = response.data
          }
        } else if (response.data === 'ok') {
          window.location.href = window.themeDisplay.getURLHome()
        } else if (response.data === 'captcha') {
          let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
          if (redirectURL !== '') {
            window.location.href = redirectURL + '/register#/login'
          } else {
            window.location.href = themeDisplay.getURLHome() + '/register#/login'
          }
        } else {
          toast.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
        }
      }).catch(function (error) {
        toast.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
      })
    }
  };
  doUserInfo() {
    if (themeDisplay !== null && themeDisplay !== undefined) {
      // eslint-disable-next-line
      let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      window.location.href = redirectURL + '/profile'
    } else {
      window.location.href = '/profile'
    }
  };
  
  doExitApp() {
    window.location.href = '/c/portal/logout'
  };

  render() {
    const { classes } = this.props;
    const { open, isSignedIn, userNameLogin, avatarURL, notificationCount, forgottenURL, anchorEl, userData } = this.state;
    
    return (
      <div>
        { !isSignedIn ? 
          <div className="login-wrapper">
            <div className="login-input">
              <div className="ico ico-user">
                <input type="text" placeholder="Tài khoản đăng nhập" name="_npmreactlogin_login" id="_npmreactlogin_login" />
              </div>
              <div className="ico ico-pass">
                <input onKeyDown={this.goToDangNhapPress} type="password" placeholder="Mật khẩu" name="_npmreactlogin_password" id="_npmreactlogin_password" />
              </div>
            </div>
            <div className="login-input">
              <div className="forgetten-password-input">
                <a href={forgottenURL} className="text-hover-blue">Quên mật khẩu?</a>
              </div> 
              <div className="action-btn-login-input">
                <button onClick={this.goToDangKyPage} type="button" className="btn-register">Đăng ký</button>
                <button onClick={this.goToDangNhap} type="button" className="btn-login">Đăng nhập</button>
                <ToastContainer autoClose={2000} />
              </div>
            </div>
          </div>
        : 
        <Grid container>
          <Grid item>
            <IconButton style={btnNotiStyle} className={classes.margin}>
            { notificationCount > 0 ? 
              <Badge badgeContent={notificationCount} color="secondary">
                <NotificationsActiveIcon color="primary" />
              </Badge>
            :
              <NotificationsActiveIcon color="primary" />
            }
            </IconButton>
          </Grid>
          <Grid item>
            { userData.avatar === '' ? 
              <Grid container>
                <Grid item>
                <Avatar className={classes.orangeAvatar}>N</Avatar>
                </Grid>
                <Grid item>
                <Button
                  aria-haspopup="true"
                  onClick={this.handleToggle}
                  className={classes.btnNameAvata}
                >
                  {userData.userName}
                  <ExpandMoreIcon />
                </Button>
                </Grid>
              </Grid>
            :
              <Chip
                onClick={this.handleToggle}
                avatar={<Avatar src={userData.avatar} />}
                label={userData.userName}
                className={classes.chip}
                style={chipStyle}
                onDelete={this.handleToggle}
                deleteIcon={<ExpandMoreIcon />}
              />
            }
            <Menu
              id="fade-menu"
              className="user-profile-menu-react"
              anchorEl={this.anchorEl}
              open={open}
              onClose={this.handleClose}
              TransitionComponent={Grow}
              style={pStyle}
            >
              <MenuItem onClick={this.doUserInfo}> <PersonIcon style={userInfoStyle}/> Thông tin tài khoản</MenuItem>
              <MenuItem onClick={this.doExitApp}> <ExitToAppIcon style={exitToAppStyle}/> Đăng xuất</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        }
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
