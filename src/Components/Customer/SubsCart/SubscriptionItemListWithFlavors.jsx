import React, { Fragment, PureComponent } from "react";
import SubscriptionAddToCartButton from "./SubscriptionAddToCartButton";
import { CURRENCY_FORMAT } from "../../../Constants/AppConstants";
import Parser from 'html-react-parser';
import ReactImageFallback from "react-image-fallback";

class SubscriptionItemListWithFlavors extends PureComponent {

    constructor(props) {
        super(props);
        this.state = { }
    }

    componentDidMount() {
        document.getElementById("scrollTop").scrollIntoView() // Scroll to Top
        let product = this.props.product;
        this.firstMonthVariation(product.hasOwnProperty("flavors")? product.flavors[0].id : null);
    }
    
    firstMonthVariation = (flavorId) => {
        const product = this.props.product;
        const concateVariationId = product.hasOwnProperty("first_month")? (product.first_month+"_"+flavorId) : null;
        const variation = product.hasOwnProperty("variations")? product.variations[concateVariationId] : null;
        
        let firstRegularPriceDisplay = false;
        let regular_price = 0;
        let sale_price = 0;
        if(parseFloat(variation.sale_price) > 0) {
            firstRegularPriceDisplay = true;
            regular_price = variation.regular_price;
            sale_price = variation.sale_price;
        } else {
            regular_price = variation.regular_price;
            sale_price = variation.regular_price;
        }

        this.setState({
            firstMonthVariationId: variation.hasOwnProperty("variation_id")? variation.variation_id : null,
            firstRegularPrice: CURRENCY_FORMAT(regular_price),
            firstSalePrice: CURRENCY_FORMAT(sale_price),
            firstRegularPriceDisplay: firstRegularPriceDisplay,
            // AddToSubscription State for Subscription
            itemCount: product.item_count,
            subsProductId: product.product_id,
            subsProductName: product.title,
            subsImage: product.thumb_image,
            subsFirstVariationId: variation.variation_id,
            subsFirstVariationName: variation.variation_name,
            subsFirstQuantity: variation.quantity,
            subsSubscriptionMsg:"Every 1 Month(s)",
            subsDiscountPrice: ((sale_price -(sale_price*product.subscription_save_percentage)/100)),
            inStock: variation.quantity,

        });
    }
    changeFirstMonthFlovour = (e) =>{
        this.firstMonthVariation(e.target.value);
    }

    render() { 
        
        const product = this.props.product;
        
        return ( 
            <Fragment>
                <tr className="popup_hide current" id="product_details_5">
                    <td colSpan="6">

                        <table className="cart_showpopUp" id="popup" border="0">
                            <colgroup>
                                <col width="30%" />
                                <col width="20%" />
                                <col width="20%" />
                                <col width="15%" />
                                <col width="15%" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th>Flavors</th>
                                    <th>Months</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                                <tr className="variant items">
                                    <td>
                                        <div>
                                            <ReactImageFallback
                                                src={product.hasOwnProperty('list_image')?product.list_image:null}
                                                fallbackImage={require('../../../Assets/images/preloader.gif')}
                                                initialImage={require('../../../Assets/images/preloader.gif')}
                                                alt=''
                                                className="cart_add_product_img" />
                                        </div>           
                                        {product.hasOwnProperty('short_description')?Parser(product.short_description):null}
                                    </td>
                                    <td>
                                        <select onChange={this.changeFirstMonthFlovour} name="flovour" className="variant-changer">
                                            {
                                                (product.flavors.length <= 0 ) ? null :
                                                product.flavors.map(function(flavor, key) {
                                                    return (
                                                        <option key={key} value={flavor.hasOwnProperty('id')?flavor.id:null}>{flavor.hasOwnProperty('value')?flavor.value:null}</option>
                                                    )
                                                }.bind(this))
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            {product.hasOwnProperty('title')?product.title:null} <br/>
                                            <label className="form-check-label" htmlFor="purchase_type_28739">Subscribe &amp; {product.hasOwnProperty('subscription_save_percentage')?product.subscription_save_percentage:null} % ( {CURRENCY_FORMAT(this.state.subsDiscountPrice)})</label>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div>
                                            {
                                                (this.state.firstRegularPriceDisplay)?
                                                <span className="compared_price">
                                                    {this.state.firstRegularPrice}
                                                </span>
                                                : ""
                                            } 
                                        </div>
                                        <div>
                                        <span className="price">
                                            {this.state.firstSalePrice}
                                        </span>
                                        </div>
                                    </td>
                                    <td className="submit-col">
                                        <SubscriptionAddToCartButton subsState={this.state} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </Fragment>
         );
    }
}
 
export default SubscriptionItemListWithFlavors;