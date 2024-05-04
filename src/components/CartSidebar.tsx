import {Sidebar} from "primereact/sidebar";
import {useContext, useState} from "react";
import "primeflex/primeflex.css";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {CartContext, CartDispatchContext} from "../contexts/CartContext.ts";

const CartSidebar = ({visible, setVisible}) => {
    const cartItems = useContext(CartContext)
    const cartDispatch = useContext(CartDispatchContext)

    return (
        <>
            <Sidebar position={"right"} visible={visible} onHide={() => setVisible(false)}>
                <div>
                    {cartItems!.length > 0 && cartItems!.map(item => <CartItem id={item.id} qty={item.amount}></CartItem>)}
                    {cartItems?.length === 0 && <span>empty cart</span>}
                </div>
            </Sidebar>
        </>
    );
};

export default CartSidebar;

const CartItem = ({id, qty}) => {
    return (
        <>
           <Card>
               <div className="flex flex-column gap-2">
                   <span>id: {id}</span>
                   <span>amount: {qty}</span>
                   <div>
                       <Button>-</Button>
                       <Button>+</Button>
                       <Button>Delete</Button>
                   </div>

               </div>
           </Card>
        </>
    );
};
