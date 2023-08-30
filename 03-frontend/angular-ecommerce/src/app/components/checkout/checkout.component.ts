import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { Address } from 'src/app/common/address';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { UtilFormService } from 'src/app/services/util-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  
  storage: Storage =  sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private utilFormService: UtilFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    // 讀取 session storage 的 user's email
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        name: new FormControl('',
                            [Validators.required,
                             Validators.minLength(2),
                             CustomValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,
                            [Validators.required, 
                             Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,4}$'),
                             CustomValidators.notOnlyWhitespace]),
        shippingAddress: new FormControl('',
                            [Validators.required, 
                             Validators.pattern('(?<city>\\D+[縣市])(?<district>\\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)'),
                             CustomValidators.notOnlyWhitespace]),
        billingAddress: new FormControl('',
                            [Validators.required, 
                             Validators.pattern('(?<city>\\D+[縣市])(?<district>\\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)'),
                             CustomValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
                                         CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // pupulate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    this.utilFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("取得月份: " + JSON.stringify(data))
        this.creditCardMonths = data;
      }
    );
      
    // pupulate credit card years
    this.utilFormService.getCreditCarYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
  }

  /* getter -> 讓 form 取值檢查 */
  // customer data
  get name() { return this.checkoutFormGroup.get('customer.name'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddress() { return this.checkoutFormGroup.get('customer.shippingAddress'); }
  get billingAddress() { return this.checkoutFormGroup.get('customer.billingAddress'); }

  // credit card data
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  copyShippingAddressToBillingAddress(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    const shippingAddressValue = this.checkoutFormGroup.get('customer').value.shippingAddress;

    // 檢查 checkbox 狀態，並複製 shipping address 到 billing address
    if(isChecked) {
      this.checkoutFormGroup.controls['customer'].patchValue({billingAddress: shippingAddressValue});

      // 另一種設定方式
      // this.checkoutFormGroup.get('customer').get('billingAddress').setValue(shippingAddressValue);
    } else {
      this.checkoutFormGroup.controls['customer'].patchValue({billingAddress: ''});
    }
  }

  onSubmit() {
    console.log('Handling the submit button')
    
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //  建立 Order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // 取得 cartItems
    const cartItems = this.cartService.cartItems

    // 利用 cartItems 建立 orderItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem))

    // 建立 Purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = new Customer();
    purchase.customer.name = this.checkoutFormGroup.get('customer.name').value;
    purchase.customer.email = this.checkoutFormGroup.get('customer.email').value;

    // populate purchase - shipping, billing address
    const formShippingAddress = this.checkoutFormGroup.get('customer.shippingAddress').value;
    const formBillingAddress = this.checkoutFormGroup.get('customer.billingAddress').value;
    const addressRegex = /(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)/;
    const match1 = addressRegex.exec(formShippingAddress);
    const match2 = addressRegex.exec(formBillingAddress);

    purchase.shippingAddress = new Address();
    purchase.billingAddress = new Address();

    if (match1 && match1.groups) {
      purchase.shippingAddress.city = match1.groups.city;
      purchase.shippingAddress.district = match1.groups.district;
      purchase.shippingAddress.others = match1.groups.others;
    } else {
      console.log("No match found.");
    }

    if (match2 && match2.groups) {
      purchase.billingAddress.city = match2.groups.city;
      purchase.billingAddress.district = match2.groups.district;
      purchase.billingAddress.others = match2.groups.others;
    } else {
      console.log("No match found.");
    }

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // purchase JSON
    console.log(JSON.stringify(purchase))

    // call REST API
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`已收到訂單！\n訂單編號為: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();          
        },
        error: err => {
          alert(`錯誤發生: ${err.message}`);
        }
      }
    );

    // console.log(this.checkoutFormGroup.get('customer').value)
    // console.log(this.checkoutFormGroup.controls['customer'].value)
    
    // console.log('1. email = ' + this.checkoutFormGroup.get('customer').value.email)
    // console.log('2. email = ' + this.checkoutFormGroup.get('customer').get('email').value)
    // console.log('3. email = ' + this.checkoutFormGroup.get('customer.email').value)

    // console.log(this.checkoutFormGroup.get('creditCard').value)
  }

  resetCart() {
    // reset cart 
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form
    this.checkoutFormGroup.reset();

    // back to the products page
    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // 若選擇的年份和當前年份相同，則將當下月份作為起始月
    // 否則將 1 月作為起始月
    let startMonth: number;

    if(currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.utilFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }
}
