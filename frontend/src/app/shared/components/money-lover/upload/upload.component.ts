import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { exchangeToByte, mapMIMEType } from '@shared/utils/utils';
import { FileExtension, InvalidFile, UploadTypeMIME } from 'app/consts';

@Component({
    selector: 'upload-files',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.scss']
})

export class UploadComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

    @Input() allowMultiple: boolean = false;
    @Input() 
    set allowTypes(types: FileExtension[]){
        this.mimeTypes = mapMIMEType(types);
    }
    @Input() minSize: string;
    @Input() maxSize: string;
    @Output() onLoaded: EventEmitter<FileList> = new EventEmitter<FileList>();
    @Output() onInvalid: EventEmitter<{err: InvalidFile, fileName: string}> = new EventEmitter<{err: InvalidFile, fileName: string}>();

    mimeTypes: UploadTypeMIME[] = [];
    /**
     * files that are ready to send requests
     */
    files: FileList = null;
    /**
     * show list files for previewing, passed from parent
     */
    isPreviewing: boolean = false;
    fileName: string = ""

    selectFile(evt: Event){
        const files = (<HTMLInputElement>evt.target).files;
        const errors = this.validateFiles(files);
        if(!errors){
            let name = "";
            for (let index = 0; index < files.length; index++) {
                name += files.item(index).name;
            }
            this.isPreviewing = true;
            this.fileName = name;
            this.files = files;
            this.onLoaded.emit(files)
        }
        else {
            this.onInvalid.emit(errors);
        }
    }

    validateFiles(files: FileList): {err: InvalidFile, fileName: string}{
        let output:{err: InvalidFile, fileName: string} = null;
        let length = files.length;
        for (let index = 0; index < length; index++) {
            // validate types
            if(!this.mimeTypes.find(type => files.item(index).type == type)){
                output = {err: "invalid-type", fileName: files.item(index).name};
                break;
            }
            // validate size
            if(this.minSize){
                if(exchangeToByte(this.minSize) > files.item(index).size){
                    output = {err: "greater-than-min", fileName: files.item(index).name}
                    break;
                }
            }
            if(this.maxSize){
                if(exchangeToByte(this.maxSize) < files.item(index).size){
                    output = {err: "smaller-than-max", fileName: files.item(index).name}
                    break;
                }
            }
        }
        return output;
    }

    clear(){
        this.isPreviewing = false;
        this.fileName = '';
        this.files = null;
    }
}