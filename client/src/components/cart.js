import profilepic from "../images/profilepic.jpg";
import CartItem from "./cartitem";
import { AiOutlineCloseCircle } from "react-icons/ai"
import { BiLogOut } from "react-icons/bi"
import Axios from "axios";
import { TiShoppingCart } from "react-icons/ti";
import toast from "react-hot-toast";

export default function Cart({name,username,setshowCart,cookies,cart,total,setCart}){
      //logout function 
    function logout() {
        cookies.remove("username");
        cookies.remove("name");

        toast.error("logged out");

        //reloading the page to reflect changes
        window.location.reload(false);
    }

    //handling payment when clicked on checkout button
    const handlePayment = async (total, username) => {

      try{
        //checking if cart has items
        if (cart.length === 0) {
        return toast.error("Cart is empty");
        }

        //getting razorpay key from server
        const { data: { key } } = await Axios.get("https://brewtopia.up.railway.app/getKey");

        console.log(key);
        //posting server with amount 
        const { data: { order } } = await Axios.post("https://brewtopia.up.railway.app/checkout", {
        amount: total
        })

        console.log(order);

        //options for razorpay window [...all copied from razorpay setup sdk]
        var options = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Brewtopia",
        description: "Test Transaction",
        image: "https://avatars.githubusercontent.com/u/98728916?v=4",
        order_id: order.id,
        callback_url: `https://brewtopia.up.railway.app/paymentverification?username=${username}`,
        prefill: {
            name: { username },
            email: { username },
            contact: "9000090000"
        },
        notes: {
            address: "Razorpay Corporate Office"
        },
        theme: {
            color: "#ecd3bd"
        }
        }

        //here opens the razorpay window ... window has Razorpay method
        //because we put script tag of razorpay in index.html
        var razor = new window.Razorpay(options);
        razor.open();
      }catch(err){
        console.log(err);
      };

    }
    return(
        <div className="cartBack">
        <div className="backDrop" onClick={() => setshowCart(false)}></div>
        <div className="cart">
          <h2>Your Cart</h2>
          <AiOutlineCloseCircle onClick={() => setshowCart(false)} style={{
            position: "absolute",
            right: "24px",
            top: "20px",
            fontSize: "26px",
            cursor: "pointer"
          }}></AiOutlineCloseCircle>
          <div className="cart-items">

            {/* checking if cart has any objects */}
            {cart.length > 0
              ? cart.map((item, index = cart.indexof(item)) => {

                // giving props to cartitem and giving states also so we can change them there
                return (
                  <CartItem
                    key={index}
                    item={item}
                    cart={cart}
                    setCart={setCart}
                    total={total}
                  ></CartItem>
                );
              })
              : "Added items will be shown here"}
          </div>
          {/* showing cart total  */}
          <div className="cart-total">
            <p>Total : {total}</p>
            <button type="button" onClick={() => handlePayment(total, username)}>
              <TiShoppingCart color="white" style={{ fontSize: "1.2rem" }}></TiShoppingCart>
              Checkout
            </button>
          </div>

          {/* showing user profile with logout button */}
          <div className="user">
            <img src={profilepic} alt="profile picture" />
            <div className="username">
              <h3>{name}</h3>
              <p>@{username}</p>
            </div>
            <button type="button" onClick={() => logout()}>
              <BiLogOut></BiLogOut>
            </button>
          </div>
        </div>


      </div>
    )
}