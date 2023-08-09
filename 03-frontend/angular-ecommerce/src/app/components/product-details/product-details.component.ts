import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // 1
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

    // 2
    // this.handleProductDetails();
  }

  handleProductDetails() {
    // 取得 product id
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  addToCart() {

    console.log(`詳細產品頁-加入購物車: ${this.product.name}, ${this.product.unitPrice}`)

    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

}
