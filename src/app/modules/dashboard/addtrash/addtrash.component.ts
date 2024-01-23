import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as mapboxgl from 'mapbox-gl';
import { debounceTime, switchMap, of, catchError } from 'rxjs';
import { AddTrashRequest, TrashAttachmentEntity, TrashCommonEntity, TrashEntity } from 'src/app/core/interfaces/trash';
import { UserDetails } from 'src/app/core/interfaces/user';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { TrashService } from 'src/app/core/services/trash/trash.service';
import { MAX_FILE_SIZE } from 'src/app/core/utilities/constants';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dateFormat';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-addtrash',
  templateUrl: './addtrash.component.html',
  styleUrls: ['./addtrash.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})

export class AddtrashComponent implements OnInit {

  map!: mapboxgl.Map;
  allTrash!: any;
  popup!: mapboxgl.Popup;
  marker!: mapboxgl.Marker;

  addTrashForm!: FormGroup;
  selectedCategory!: string;
  selectedDate!: Date;

  geoCoder!: MapboxGeocoder;

  searchControl = new FormControl();
  geoCoderSuggestions: any[] = [];
  searchCoOrds: any;
  @ViewChild('fileUploader') fileUploader!: ElementRef;

  uploadedFiles!: File[];

  validFileExt: Array<string> = [
    ".jpg",
    ".jpeg",
    ".png"
  ];
  filename: string = ""
  filesize: number = 0;
  isFileUploaded: boolean = false;


  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddtrashComponent>,
    private mapboxService: MapboxService,
    private trashService: TrashService) {

  }
  ngOnInit(): void {
    this.addTrashForm = this.fb.group({
      Title: ['', Validators.required],
      ReportedDate: [null, Validators.required],
      CategoryId: [0, Validators.required],
      Longitude: [''],
      Latitude: [''],
    });
    this.setupAutocomplete();
  }

  onGeoCoderSelection(event: any) {
    console.log(event.option.value);
    const data = event.option.value;
    this.searchCoOrds = data?.center as mapboxgl.LngLat;
    console.log(this.searchCoOrds);

  }

  setupAutocomplete() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((searchValue) => (searchValue ? this.mapboxService.searchGeoCoder(searchValue) : of([]))),
        catchError(() => of([]))
      )
      .subscribe((data: any) => {
        this.geoCoderSuggestions = data.features;
        console.log(this.geoCoderSuggestions);
      });
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.place_name : value;
  }



  closePopup() {
    this.dialogRef.close();
  }



  onFileSelected(event: any) {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files;
      this.filename = this.uploadedFiles[0].name;
      this.filesize = Number((this.uploadedFiles[0].size / (1024 * 1024)).toFixed(2));
      if (this.filename.indexOf(".") != -1) {
        let fileExt = this.filename.substring(
          this.filename.lastIndexOf("."),
          this.filename.length
        );

        if (this.validFileExt.indexOf(fileExt.toLowerCase()) === -1) {
          alert("invalid format!!");
        } else if (this.filesize > MAX_FILE_SIZE) {
          alert("exceeded file size limit (10MB)!!");
        }
        else {
          this.isFileUploaded = true;
        }
      }
    }
  }

  deleteFile() {
    this.fileUploader.nativeElement.value = null;
    this.uploadedFiles = [];
    this.filename = "";
    this.filesize = 0;
    this.isFileUploaded = false;
    console.log(this.uploadedFiles)
  }

  updateFormValues() {
    let convertedDate = new Date(this.addTrashForm.get("ReportedDate")?.value).toISOString();
    this.addTrashForm.patchValue({ CategoryId: Number(this.addTrashForm.get("CategoryId")?.value), ReportedDate: convertedDate, Longitude: this.searchCoOrds[0], Latitude: this.searchCoOrds[1] })
  }

  saveTrash() {
    let userDetails!: UserDetails;
    if (sessionStorage.getItem("userDetails")) {
      userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
    }

    if (this.addTrashForm.valid && this.searchCoOrds) {
      this.updateFormValues();
      let commonEntity: TrashCommonEntity = { UserId: userDetails?.userID };
      let trashEntity: TrashEntity = { ...this.addTrashForm.value };
      let attachmentEntity: TrashAttachmentEntity;

      let addTrashRequest: AddTrashRequest = { CommonEntity: commonEntity, TrashList: [trashEntity], AttachmentEntity: [] };

      console.log(addTrashRequest);

      if (this.isFileUploaded) {
        this.trashService.saveAttachment(this.uploadedFiles[0]).subscribe((res) => {
          console.log(res);
        })
      }


      this.trashService.addTrash(addTrashRequest).subscribe(
        {
          next: (response: any) => {
            console.log(response);
            if (response.commonEntity.transactionStatus === "Y" && response.trashDetailsEntity.length > 0) {
              alert("New Trash saved successfully.");
              this.dialogRef.close();
            }
          }
        });


    }


  }
}