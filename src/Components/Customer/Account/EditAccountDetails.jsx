import React, { Fragment, PureComponent } from 'react';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import classnames from 'classnames';
import validateUserProfile from '../../../Validations/userProfile';
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';
import $ from 'jquery';

class EditAccountDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            action_btn_label: false,
            first_name: "",
            last_name: "",
            displayname: "",
            email: "",
            current_password: "",
            new_password: "",
            confirm_new_password: "",

            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:''
        }
        document.title = "Account Details -Prestige Labs";
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView(); // Scroll to Top
        document.getElementById("pageTitle").innerHTML = "Account Details";

        AJAX_REQUEST("POST","user/details",{}).then(results => {
            const response = results.response;
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading:false,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    displayname: response.data.displayname,
                    email: response.data.email,
                });	
            }           
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this),timedata);
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ action_btn_label: true })

        const val_return = validateUserProfile(this.state);
        this.setState(val_return);

        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true});

            AJAX_REQUEST("POST","user/updateInfo",this.state).then(results => {
                const response = results.response;
                if(parseInt(response.code)===1000) {
                    this.setState({
                        server_message: response.message,
                        isFormValid:true,
                        isLoading:false,
                        success_alert_wrapper_show: true,
                        action_btn_label: false
                    });
                    this.timeOut(5000);
                    document.querySelector("body").scrollIntoView(); // Scroll to Top
                }else{
                    this.setState({
                        server_message: response.message,
                        isFormValid:false,
                        isLoading:false,
                        success_alert_wrapper_show: false,
                        action_btn_label: false
                    });
                    document.querySelector("body").scrollIntoView(); // Scroll to Top
                }         
            });
        }else{
            document.querySelector("body").scrollIntoView();
            this.setState({action_btn_label: false });
        }
    }

    render() { 
        const { errors, server_message, success_alert_wrapper_show } = this.state;
        const full_state = this.state;
        const errors_data = server_message;
        return (
            <Fragment>
                {
                    (this.state.loading)?
                    <div className="loading"></div>
                    :
                    <form onSubmit={this.onSubmit} method="post" className="edit_account_form action_form" encType="multipart/form-data">
                    <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                    <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/> 
                        <div className="form-group pull-left name_field">
                            <label className={classnames(null, { 'pl_error_label': errors.first_name })} htmlFor="first_name">First Name <span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="text" className={classnames("cus_field", { 'pl_error_input': errors.first_name })} name="first_name" id="first_name" value={full_state.first_name} />
                        </div>
                        <div className="form-group pull-right name_field">
                            <label className={classnames(null, { 'pl_error_label': errors.last_name })} htmlFor="last_name">Last Name <span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="text" className={classnames("cus_field", { 'pl_error_input': errors.last_name })} name="last_name" id="last_name" value={full_state.last_name} />
                        </div>
                        <div className="clearfix"></div>
                        <div className="form-group">
                            <label className={classnames(null, { 'pl_error_label': errors.displayname })} htmlFor="displayname">Display name <span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="text" className={classnames("cus_field", { 'pl_error_input': errors.displayname })} name="displayname" id="displayname" value={full_state.displayname} />
                            <small><em>This will be how your name will be displayed in the account section and in reviews</em></small>
                        </div>
                        <div className="form-group">
                            <label className={classnames(null, { 'pl_error_label': errors.email })} htmlFor="email">Email address <span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="email" className={classnames("cus_field", { 'pl_error_input': errors.email })} name="email" id="email" value={full_state.email} />
                        </div>
                        <div className="form-group">
                            <h3 className="montserrat page-title"> Password Change</h3>
                        </div>
                        <div className="form-group">
                            <label className={classnames(null, { 'pl_error_label': errors.current_password })} htmlFor="current_password">Current Password (leave blank to leave unchanged) <span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="password" className={classnames("cus_field", { 'pl_error_input': errors.current_password })} name="current_password" id="current_password" />
                        </div>
                        <div className="form-group">
                            <label className={classnames(null, { 'pl_error_label': errors.new_password })} htmlFor="new_password">New Password (leave blank to leave unchanged) <span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="password" className={classnames("cus_field", { 'pl_error_input': errors.new_password })} name="new_password" id="new_password" />
                        </div>
                        <div className="form-group">
                            <label className={classnames(null, { 'pl_error_label': errors.confirm_new_password })} htmlFor="confirm_new_password">Confirm New Password<span className="required">*</span></label>
                            <input onChange={this.changeHandler} type="password" className={classnames("cus_field", { 'pl_error_input': errors.confirm_new_password })} name="confirm_new_password" id="confirm_new_password" />
                        </div>
                        <div className="">	
                            <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" name="login" value="Login"> {this.state.action_btn_label?"Saving...":"Save Changes"} </button>
                        </div>
                    </form>
                }
            </Fragment>            
        );
    }
}
 
export default EditAccountDetails;