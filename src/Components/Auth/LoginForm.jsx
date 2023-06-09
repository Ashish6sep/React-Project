import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, CUSTOMER_URL, DISTRIBUTOR_URL, GET_STORAGE, PUBLIC_URL, REFER_URL } from '../../Constants/AppConstants';

import PropTypes from "prop-types";
import classnames from 'classnames';

import validateLogin from '../../Validations/Login';
import AlertWrapper from '../Common/AlertWrapper';
import history from '../../history';
import FlashMessagesList from '../FlashMessages/FlashMessagesList';

import { connect } from 'react-redux';
import { userLoginRequest } from '../../Store/actions/loginActions';
import { logout } from '../../Store/actions/loginActions';

class LoginForm extends Component {
    constructor (props){
        super(props)
        this.state = {
            api_key: API_KEY,
            user_login: '',
            password: '',
            remember:'',
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:''
        }
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    changeRememberHandler = (e) => {
        if(document.getElementById("remember").checked){
            this.setState({
                remember:'checked'
            });
        }else{
            this.setState({
                remember:''
            });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validateLogin(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true});
            this.props.userLoginRequest(this.state).then(results => {
                if(results.response.code===1000) {
                    // if(results.response.data.role === 'customer'){
                    if(Object.values(results.response.data.roles).includes('customer')){
                        let settings = null;
                        if (GET_STORAGE("settings")) {
                            settings = JSON.parse(GET_STORAGE("settings"));
                        }
                        let meal_menu_active = false;
                        if(settings && settings.meal_menu_public == "yes"){
                            meal_menu_active = true;
                        }else{
                            if(this.props){
                                if(this.props.auth){
                                    if(this.props.auth.user){
                                        if(this.props.auth.user.meal_menu_activated){
                                            meal_menu_active = true;
                                        }
                                    }
                                }
                            }
                        }
                        if(meal_menu_active){
                            if(results.response.data.site == 'refer'){
                                window.location.href = REFER_URL+'serviceLogin?token='+results.response.data.token+'&redirect=meals';
                            }else{
                                window.location.href = PUBLIC_URL+'serviceLogin?token='+results.response.data.token+'&redirect=meals';
                            }
                        }else{
                            history.push('/my-account');
                        }
                    }
                    else{
                        this.props.logout();
                        window.location.href = DISTRIBUTOR_URL+'serviceLogin?token='+results.response.data.token;
                    }
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isLoading:false,
                        isFormValid:false
                    });                    
                }            
            }
            );
        }
    }

    render() {
        const { errors, server_message } = this.state;
        const errors_data = server_message;
        return (
            <div className="login-form">
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                <FlashMessagesList />
                <form className="action_form" onSubmit={this.onSubmit} method="post">
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.user_login })} htmlFor="user_login">Username or email address <span className="required">*</span></label>
                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.user_login })} name="user_login" id="user_login" value={this.state.user_login} onChange={this.changeHandler} />			
                        
                    </div>
                    <div className="form-group">
                        <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="password">Password <span className="required">*</span></label>
                        <input className={classnames("cus_field", { 'pl_error_input': errors.password })} type="password" name="password" id="password" value={this.state.password} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login" value="Login">{this.state.isLoading?'Please Wait...':'Login'}</button>
                        
                        <div className="inline_checkbox custom-control custom-checkbox">
                            <input onChange={this.changeRememberHandler} type="checkbox" className={classnames('custom-control-input', { 'pl_error_checkbox': errors.remember })} id="remember" name="remember" />
                            <label className="custom-control-label" htmlFor="remember">Remember me</label>
                        </div>

                        {/* <div className="new_distributor_sign_up"><NavLink activeClassName='active' to="/registration"> New Affiliate? Sign up</NavLink></div> */}
                        <div className="clearfix"></div>
                    </div>
                    <div className="lost_password">
                    <NavLink activeClassName='active' to="/password-reset"> Lost your password?</NavLink>
                    </div>
                </form>
        </div>
        );
    }
}

LoginForm.propTypes = {
    userLoginRequest:PropTypes.func.isRequired,
    logout:PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}
 
export default connect(mapStateToProps, { userLoginRequest, logout })(LoginForm);