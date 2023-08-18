import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    // 從 browser storage 讀取 email(JSON)
    const theEamil = JSON.parse(this.storage.getItem('userEmail'));

    // 從 service 取得資料
    this.orderHistoryService.getOrderHistory(theEamil).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    );
    
  }

}
