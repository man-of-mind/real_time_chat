import React from 'react';
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import Contact from '../Components/Contact';
import Hoc from '../hoc/hoc';
import axios from 'axios';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class Sidepanel extends React.Component {

    state = { 
        loginForm: true,
        chats: []
    }

    componentDidMount() {
        if (this.props.token !== null && this.props.username !== null) {
            this.getUserChats(this.props.token, this.props.username);
        }
    }

    componentWillReceiveProps (newProps) {
        if (newProps.token !== null && newProps.username !== null) {
            this.getUserChats(newProps.token, newProps.username);
        }
    }

    getUserChats = (token, username) => {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization : `Token ${token}`
        };
        axios.get(`http://127.0.0.1:8000/chat/?username=${username}`)
        .then(res => {
            console.log(res.data);
            this.setState({
                chats: res.data
            })
        }) 
    }

    changeForm = () => {
        this.setState({ loginForm: !this.state.loginForm });
    }

    authenticate = (e) => {
        e.preventDefault();
        if (this.state.loginForm) {
            this.props.login(
                e.target.username.value, 
                e.target.password.value
            );
        } else {
            this.props.signup(
                e.target.username.value, 
                e.target.email.value, 
                e.target.password.value, 
                e.target.password2.value
            );
        }
    }

    render() {
        const activeChat = this.state.chats.map(c => {
            return (
                <Contact 
                    key = {c.id}
                    name="Dammy"
                    status="online"
                    picUrl = "http://emilcarlsson.se/assets/louislitt.png"
                    chatURL = {`/${c.id}`}
                />
             )
        })
        return (
            <div>
            <div id="sidepanel">
            <div id="profile">
                <div className="wrap">
                <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                <p>Mike Ross</p>
                <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                <div id="status-options">
                    <ul>
                    <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                    <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                    <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                    <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                    </ul>
                </div>
                <div id="expanded">
                    {
                        this.props.loading ?

                        <Spin indicator={antIcon} /> :

                        this.props.isAuthenticated ? 

                        <button onClick={() => this.props.logout()} className="authBtn"><span>Logout</span></button>

                        :

                        <div>
                            <form method="POST" onSubmit={this.authenticate}>

                                {
                                    this.state.loginForm ?

                                    <div>
                                        <input name="username" type="text" placeholder="username" />
                                        <input name="password" type="password" placeholder="password" />
                                    </div>

                                    :

                                    <div>
                                        <input name="username" type="text" placeholder="username" />
                                        <input name="email" type="email" placeholder="email" />
                                        <input name="password" type="password" placeholder="password" />
                                        <input name="password2" type="password" placeholder="password confirm" />
                                    </div>
                                }

                                <button type="submit">Authenticate</button>

                            </form>

                            <button onClick={this.changeForm}>Switch</button>
                        </div>
                    }
                </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>
                    {activeChat}
                    {/*<Contact 
                        name="Dammy"
                        status="online"
                        picUrl = "http://emilcarlsson.se/assets/louislitt.png"
                        chatURL = "/dammy/"
                    />
                    <Contact 
                        name="Bethel"
                        status="busy"
                        picUrl = "http://emilcarlsson.se/assets/harveyspecter.png"
                        chatURL = "/bethel/"
                    /> */}
                </ul>
            </div>
            <div id="bottom-bar">
                <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
            </div>
            </div>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
        loading: state.loading,
        token: state.token,
        username: state.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (userName, password) => dispatch(actions.authLogin(userName, password)),
        logout: () => dispatch(actions.logout()),
        signup: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel); 
