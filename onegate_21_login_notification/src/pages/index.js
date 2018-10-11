import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
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

const themeDisplay = window.themeDisplay;

const styles = theme => ({
  root: {
    textAlign: 'right',
    paddingTop: theme.spacing.unit * 0,
  },
});

const pStyle = {
  top: '60px',
  right: '8%'
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

class Index extends React.Component {
  
  state = {
    open: false,
    anchorEl: null,
    isSignedIn: false,
    userNameLogin: '',
    forgottenURL: '/forgotten-password',
    drawer: false,
    avatarURL: '',
    notificationCount: 0,
    isShowUserMenu: false,
    toggle_exclusive: 0
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  componentDidMount() {
    let vm = this
    if (themeDisplay !== null && themeDisplay !== undefined) {
      let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      let forgottenURLStr = ''
      if (redirectURL !== '') {
        forgottenURLStr = redirectURL + '/forgotten-password'
      } else {
        forgottenURLStr = themeDisplay.getURLHome() + '/forgotten-password'
      }
      vm.setState({
        isSignedIn: themeDisplay.isSignedIn(),
        userNameLogin: themeDisplay.getUserName(),
        forgottenURL: forgottenURLStr
      })
      if (themeDisplay.isSignedIn()) {
        let param = {
          responseType: 'blob'
        }
        axios.get('/o/rest/v2/users/' + themeDisplay.getUserId() + '/photo', param).then(function (response) {
          let avatarURLStr = window.URL.createObjectURL(response.data)
          vm.setState({ avatarURL: avatarURLStr })
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  };

  goToDangKyPage = () => {
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

  doUserInfo = () => {
    if (themeDisplay !== null && themeDisplay !== undefined) {
      // eslint-disable-next-line
      let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      window.location.href = redirectURL + '/profile'
    } else {
      window.location.href = '/profile'
    }
  };
  
  doExitApp = () => {
    window.location.href = '/c/portal/logout'
  };

  render() {
    const { classes } = this.props;
    const { open, isSignedIn, userNameLogin, avatarURL, notificationCount, forgottenURL } = this.state;

    return (
      <div>
        { !isSignedIn ? 
          <div className="login-wrapper">
            <div className="login-input">
              <div className="ico ico-user">
                <input type="text" placeholder="Tài khoản đăng nhập" name="_npmreactlogin_login" />
              </div>
              <div className="ico ico-pass">
                <input type="password" placeholder="Mật khẩu" name="_npmreactlogin_password" />
              </div>
            </div>
            <div className="login-input">
              <div className="forgetten-password-input">
                <a href={forgottenURL} className="text-hover-blue">Quên mật khẩu?</a>
              </div> 
              <div className="action-btn-login-input">
                <button onClick={this.goToDangKyPage} type="button" className="btn-register">Đăng ký</button>
                <button type="submit" className="btn-login">Đăng nhập</button>
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
          <Chip
              onClick={this.handleToggle}
              avatar={<Avatar src={avatarURL} />}
              label={userNameLogin}
              className={classes.chip}
              style={chipStyle}
              onDelete={this.handleToggle}
              deleteIcon={<ExpandMoreIcon />}
            />

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

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
