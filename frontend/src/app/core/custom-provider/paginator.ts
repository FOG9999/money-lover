import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatior extends MatPaginatorIntl {
    itemsPerPageLabel = 'Số bản ghi/trang:';
    nextPageLabel     = 'Tiếp';
    previousPageLabel = 'Trước';
    
}