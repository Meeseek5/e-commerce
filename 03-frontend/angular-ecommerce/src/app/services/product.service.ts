import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = 'http://localhost:8080/api/products';
  
  private categoryUrl = 'http://localhost:8080/api/product-category';

  
  constructor(private httpClient: HttpClient) { }
  

  // 取得單一 product
  // 用在單一商品介紹
  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {
    
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    +  `&page=${thePage}&size=${thePageSize}`;

    return  this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    
    // 根據 category id 產生 URL
    // 路徑中的 search 是 spring data rest 規範 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    
    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
     // 根據使用者輸入關鍵字產生 URL
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts> {
    // 根據使用者輸入 keyword, page, size 產生 URL                     
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    +  `&page=${thePage}&size=${thePageSize}`;

    return  this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // 發出請求取得 products
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  
  // 發出請求取得 product category
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
      );
  }
}
  
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
