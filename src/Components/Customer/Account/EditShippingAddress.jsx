import React, { Component, Fragment } from 'react';
import history from '../../../history';
import { AJAX_REQUEST } from "../../../Constants/AppConstants";
import classnames from 'classnames';
import AlertWrapper from '../../Common/AlertWrapper';
import AlertWrapperSuccess from '../../Common/AlertWrapperSuccess';
import validateShippingAddress from '../../../Validations/validateShippingAddress';
import $ from "jquery";

class EditShippingAddress extends Component {
    constructor(props){
        super(props);
        this.state={
            loading                 :true,
            action_btn_label        :false,
            countryList             :[],
            stateList               :[],
            shipping_first_name      :'',
            shipping_last_name       :'',
            shipping_company         :'',
            shipping_address_1       :'',
            shipping_address_2       :'',
            shipping_postcode        :'',
            shipping_country         :'',
            shipping_state           :'',
            success_alert_wrapper_show: false,
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:'',
        }
        document.title = "Edit Shipping Address -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView() // Scroll to Top
        document.getElementById("pageTitle").innerHTML = `Edit Shipping Address` ;     
        this.getShippingAddress();
        this.getCountryList();  

        // $("#successMsg").hide();
        // $("#errorMsg").hide();
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getCountryList = () => {
        AJAX_REQUEST("POST", "user/getCountry", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({ countryList: results.response.data });		
            }           
        });
    }

    getStateList = (countryId) => {
        let data = {country_id: countryId};
        AJAX_REQUEST("POST", "user/getState", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({ stateList: results.response.data });		
            } else {
                this.setState({stateList: []})
            }            
        });
    }

    onChangeCountry = (e) => {
        let countryId = e.target.value;
        if(countryId != ""){
            this.setState({ [e.target.name]: countryId })
        }else{
            this.setState({ [e.target.name]: countryId, shipping_state:''  })
        }
        this.getStateList(countryId);
    }
    
    getShippingAddress = () => {
        AJAX_REQUEST("POST", "customer/shippingDetails", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    loading: false,
                    shipping_first_name         :results.response.data.shipping_first_name,
                    shipping_last_name          :results.response.data.shipping_last_name,
                    shipping_company            :results.response.data.shipping_company,
                    shipping_address_1          :results.response.data.shipping_address_1,
                    shipping_address_2          :results.response.data.shipping_address_2,
                    shipping_city               :results.response.data.shipping_city,
                    shipping_postcode           :results.response.data.shipping_postcode,
                    shipping_country            :results.response.data.shipping_country_id,
                    shipping_state              :results.response.data.shipping_state,
                });	
                this.getStateList(this.state.shipping_country);	
            } else {
                this.setState({
                    loading: false,
                    error_meg:results.response.message,
                })
            }            
        });
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
            history.push(`/my-account/edit-addresses`);
        }.bind(this),timedata);
    }
        
    onSubmitHandler = (e) => {
        e.preventDefault();
        const val_return = validateShippingAddress(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true,action_btn_label: true,server_message:''});
            const data = {
                    shipping_first_name         :this.state.shipping_first_name,
                    shipping_last_name          :this.state.shipping_last_name,
                    shipping_company            :this.state.shipping_company,
                    shipping_address_1          :this.state.shipping_address_1,
                    shipping_address_2          :this.state.shipping_address_2,
                    shipping_city               :this.state.shipping_city,
                    shipping_postcode           :this.state.shipping_postcode,
                    shipping_country            :this.state.shipping_country,                
                    shipping_state              :this.state.shipping_state,
                }
            AJAX_REQUEST("POST","customer/updateShippingAddress", data).then(results => {
                if(parseInt(results.response.code)===1000) {
                    this.setState({
                        server_message: results.response.message,
                        isFormValid:true,
                        isLoading:false,
                        action_btn_label: false,
                        success_alert_wrapper_show: true
                    });
                    document.querySelector("body").scrollIntoView(); // Scroll to top
                    this.timeOut(5000);
                }else{
                    this.setState({
                        server_message: results.response.message,
                        isFormValid:false,
                        isLoading:false,
                        action_btn_label: false,
                        success_alert_wrapper_show: false
                    });
                    document.querySelector("body").scrollIntoView(); // Scroll to top
                    this.timeOut(5000);
                }          
            });
        }else{
            document.querySelector("body").scrollIntoView();
            this.setState({action_btn_label: false });
        }
    }

    render() { 
        const { server_message, success_alert_wrapper_show, errors, isLoading } = this.state;
        const errors_data = server_message;
        return ( 
            <Fragment>

                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/>

                {
                    (this.state.loading)? 
                    <div className="loading"></div>
                    :
                    <Fragment>
                        <form onSubmit={this.onSubmitHandler} method="post" className="edit_account_form action_form" encType="multipart/form-data">
                            <div className="form-group pull-left name_field">
                                <label>First Name <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_first_name })} name="shipping_first_name" id="" onChange={this.changeHandler} value={this.state.shipping_first_name} />
                            </div>
                            <div className="form-group pull-right name_field">
                                <label>Last Name <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_last_name })} name="shipping_last_name" id="" onChange={this.changeHandler} value={this.state.shipping_last_name} />
                            </div>
                            <div className="clearfix"></div>
                            <div className="form-group">
                                <label>Company Name (optional)</label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_company })} name="shipping_company" id="" onChange={this.changeHandler} defaultValue={this.state.shipping_company} />
                            </div>
                            <div className="form-group">
                                <label>Country <span className="required">*</span></label>
                                <select onChange={this.onChangeCountry} value={this.state.shipping_country} name="shipping_country" className={classnames("cus_field", { 'pl_error_input': errors.shipping_country })}>
                                    <option value="">Select a Country…</option>
                                    { 
                                        (this.state.countryList.length <= 0 )? null : 
                                        this.state.countryList.map(function(country, key){
                                            return (
                                                <option key={key} value={country.id}>{country.name}</option>
                                            )                     
                                        }.bind(this))
                                    } 
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Street Address <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_address_1 })} name="shipping_address_1" id="" onChange={this.changeHandler} value={this.state.shipping_address_1}/>
                            </div>
                            <div className="form-group">
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_address_2 })} name="shipping_address_2" id="" onChange={this.changeHandler} value={this.state.shipping_address_2} placeholder="Apartment, suite, unit etc. (optional)"/>
                            </div>
                            <div className="form-group">
                                <label>Town / City <span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_city })} name="shipping_city" id="" onChange={this.changeHandler} value={this.state.shipping_city} />
                            </div>
                            <div className="form-group">
                                <label>State  <span className="required">*</span></label>
                                <select onChange={this.changeHandler} value={this.state.shipping_state} name="shipping_state" className={classnames("cus_field", { 'pl_error_input': errors.shipping_state })}>
                                    <option value="">Select a state...</option>
                                    { 
                                        (this.state.stateList.length <= 0 ) ? null :
                                        this.state.stateList.map(function(state, key){
                                            return (
                                                <option key={key} value={state.code}>{state.name}</option>
                                            )                     
                                        }.bind(this))
                                    } 
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ZIP<span className="required">*</span></label>
                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.shipping_postcode })} name="shipping_postcode" id="" onChange={this.changeHandler} value={this.state.shipping_postcode} />
                            </div>
                            <p>Update the shipping used for all of my active subscriptions (optional)</p>
                            <div className="">	
                                <button type="submit" className="roboto_condensed cus_button" name="login" value="Login">{this.state.action_btn_label?"Saving...":"Save Changes"}</button>
                            </div>
                        </form>
                    </Fragment>
                }                
            </Fragment> 
        );
    }
}
 
export default EditShippingAddress;