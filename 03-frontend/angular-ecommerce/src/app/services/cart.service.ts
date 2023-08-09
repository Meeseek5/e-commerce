import { Injectable, IterableDiffers } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // subclass of Observable
  // 用來發送 event
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {
    
    // 檢查是否有相同的商品已經在購物車內
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // 檢查 cart item data
    // console.log(`${theCartItem.id}, ${theCartItem.name}, ${theCartItem.quantity}, ${theCartItem.unitPrice}`)

    if(this.cartItems.length > 0) {
   
      // 用 item id 找在 cart 中的 item
      /*
      for(let tempCartItem of this.cartItems) {
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
      */

      // 用 Array.find(...) 取代一般 for loop
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)

      // 檢查是否找到 item
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    
    // 商品是否存在購物車中
    if(alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    
    // 計算總金額與總數量
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue +=  currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // 將更新後的 value 發送給訂閱者
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('以下為購物車內的商品')
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitprice: ${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue}, totalQuantity: ${totalQuantityValue}`)
    console.log('----------')
  }

  decrementQuantity(theCartItem: CartItem) {
    
    theCartItem.quantity--;

    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {

    // 在 cartItems 中找尋 item's index
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    // 若找到將之從 cartItems 移除
    if(itemIndex != -1) {
      this.cartItems.splice(itemIndex, 1); // splice(要移除的 index(started), 移除數量)

      this.computeCartTotals();
    }
  }
}
