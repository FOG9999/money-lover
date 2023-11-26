import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@shared';
import { Notification } from 'app/model/notification.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'priority-dialog',
    templateUrl: 'priority-dialog.component.html',
    styleUrls: ['priority-dialog.component.scss']
})

export class PriorityDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<PriorityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Partial<Notification>,
        private notifyService: NotificationService,
        private toastService: ToastrService
    ) { 
        console.log(data)
    }

    noRepeat(){
        this.notifyService.markNoRepeat(this.data._id).subscribe(() => {
            this.toastService.success("Đánh dấu không nhắc lại thành công.");
            this.dialogRef.close();
        })
    }

}