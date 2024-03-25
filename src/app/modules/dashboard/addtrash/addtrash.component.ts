import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as mapboxgl from 'mapbox-gl';
import { debounceTime, switchMap, of, catchError } from 'rxjs';
import { MasterData, TrashCatergory } from 'src/app/core/interfaces/common';
import { AddTrashRequest, TrashAttachmentEntity, TrashCommonEntity, TrashEntity } from 'src/app/core/interfaces/trash';
import { UserDetails, UserRequest } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { TrashService } from 'src/app/core/services/trash/trash.service';
import { MAX_FILE_SIZE, TRASH_CATEGORIES, getCurrentDateTimeTrasanctionID } from 'src/app/core/utilities/constants';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dateFormat';

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
  formData = new FormData();
  userDetails!: UserDetails;
  allTrash!: any;
  addTrashForm!: FormGroup;
  selectedCategory!: string;
  selectedDate!: Date;
  searchControl = new FormControl();
  geoCoderSuggestions: any[] = [];
  searchCoOrds: any;
  geoCoderCords: any;
  trashName: any;
  resfilename: any;
  @ViewChild('fileUploader') fileUploader!: ElementRef;

  uploadedFiles!: File[];

  validFileExt: Array<string> = [
    "jpg",
    "jpeg",
    "png"
  ];
  filename: string = ""
  filesizeUI: string = "";
  filesize: number = 0;
  fileExt: string = "";
  isFileUploaded: boolean = false;
  attachmentEntity!: TrashAttachmentEntity;
  selectedPlace!: string;
  selectedAddress!: string;
  selectedFormatedCoords!: string;
  trashTitle!: string;
  trashCategories: TrashCatergory[] = [];



  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddtrashComponent>,
    private mapboxService: MapboxService,
    private trashService: TrashService,
    private authService: AuthService,) {

  }
  ngOnInit(): void {
    this.addTrashForm = this.fb.group({
      Title: [''],
      ReportedDate: [new Date(), Validators.required],
      CategoryId: [2, Validators.required],
      Longitude: [''],
      Latitude: [''],
    });
    this.setupAutocomplete();

    this.authService.getMasterData().subscribe((data: MasterData) => {
      this.trashCategories = data.trashCategories;
      console.log(this.trashCategories);

    });
    this.searchCoOrds = this.mapboxService.currentMapCenter;
    this.getCurrentPlace(this.searchCoOrds);
  }

  onGeoCoderSelection(event: any) {

    const data = event.option.value;
    this.geoCoderCords = data?.center as mapboxgl.LngLat;
    this.searchCoOrds = this.geoCoderCords;


  }

  onCatergoryChange(event: any) {
    const selectedCategoryId = this.addTrashForm.get('CategoryId')?.value;
    const selectedTrashType = this.trashCategories.find((trashType: any) => trashType.id === selectedCategoryId);
    if (selectedTrashType) {
      this.trashName = selectedTrashType.name;
    }
    this.trashTitle = this.trashName + " near " + this.selectedPlace
    this.addTrashForm.get("Title")?.setValue(this.trashTitle);
  }


  getGeoCoderDraggedCords(draggedCords: any) {
    this.searchCoOrds = draggedCords;
    this.getCurrentPlace(this.searchCoOrds);

  }

  getCurrentPlace(selectedCords: any) {
    this.mapboxService.getaddressByCoordinates(this.searchCoOrds)
      .subscribe((res: any) => {

        if (res.features.length > 0 && res?.features[3]) {
          this.selectedPlace = res?.features[3].text;
          this.selectedAddress = res?.features[0].place_name;
          this.trashTitle = TRASH_CATEGORIES[this.addTrashForm.get('CategoryId')?.value] + " near " + this.selectedPlace
          this.addTrashForm.get("Title")?.setValue(this.trashTitle);

        }
      });

    this.selectedFormatedCoords = this.mapboxService.formatLatitude(this.searchCoOrds[0]) + "," + this.mapboxService.formatLongitude(this.searchCoOrds[1]);


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

      });
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.place_name : value;
  }

  closePopup() {
    this.dialogRef.close(null);
  }



  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files;
      this.filename = this.uploadedFiles[0].name;
      this.filesize = Number((this.uploadedFiles[0].size / (1024 * 1024)).toFixed(2));
      let filesizeKb = this.uploadedFiles[0].size / (1024);
      let filesizeMb = filesizeKb > 1000 ? filesizeKb / (1024) : 0;
      this.filesizeUI = filesizeMb > 0 ? filesizeMb.toFixed(2) + " MB" : filesizeKb.toFixed(2) + " KB";

      if (this.filename.indexOf(".") != -1) {
        this.fileExt = this.filename.substring(
          this.filename.lastIndexOf(".") + 1,
          this.filename.length
        );

        if (this.validFileExt.indexOf(this.fileExt.toLowerCase()) === -1) {
          alert("invalid format!!");
        } else if (this.filesize > MAX_FILE_SIZE) {
          alert("exceeded file size limit (10MB)!!");
        }
        else {

          this.isFileUploaded = true;
          this.attachmentEntity = {
            AttachmentTransactionId: getCurrentDateTimeTrasanctionID(),
            AttachmentName: this.filename,
            FileType: this.fileExt,
          };

          const formData = new FormData();
          formData.append('FileName', this.filename);
          formData.append('file', this.uploadedFiles[0]);
        }
      }
    }
  }

  deleteFile() {
    this.fileUploader.nativeElement.value = null;
    this.uploadedFiles = [];
    this.filename = "";
    this.filesize = 0;
    this.filesizeUI = "";
    this.isFileUploaded = false;
  }

  updateFormValues() {
    let convertedDate = new Date(this.addTrashForm.get("ReportedDate")?.value).toISOString();
    this.addTrashForm.patchValue({ CategoryId: Number(this.addTrashForm.get("CategoryId")?.value), ReportedDate: convertedDate, Longitude: this.searchCoOrds[0], Latitude: this.searchCoOrds[1] })
  }

  saveTrash() {
    this.userDetails = this.authService.getUserId();
    const user: UserRequest = {
      userid: this.userDetails.userID
    }
    if (this.addTrashForm.valid && this.searchCoOrds) {
      this.updateFormValues();
      let transactionId = getCurrentDateTimeTrasanctionID();

      let commonEntity: TrashCommonEntity = { UserId: this.userDetails?.userID };
      let trashEntity: TrashEntity = { ...this.addTrashForm.value, TransactionId: transactionId };
      if (this.isFileUploaded && this.attachmentEntity) {
        this.attachmentEntity.TransactionId = transactionId;
      }

      let addTrashRequest: AddTrashRequest = { CommonEntity: commonEntity, TrashList: [trashEntity], AttachmentEntity: this.isFileUploaded ? [this.attachmentEntity] : [] };

      this.trashService.addTrash(addTrashRequest).subscribe(
        {
          next: (response: any) => {
            if (response.commonEntity.transactionStatus === "Y" && response.trashDetailsEntity.length > 0) {

              if (this.isFileUploaded && response.attachmentEntity.length > 0) {
                this.resfilename = response.attachmentEntity[0]?.fileName
                this.uploadFormdata(this.resfilename, this.uploadedFiles[0]);

                this.trashService.saveAttachment(this.formData)
                  .then(response => {
                    // console.log('File uploaded successfully:', response);
                  })
                  .catch(error => {
                  });
              }

              this.authService.getUserDetails(user).subscribe((user: any) => {
                if (user.commonEntity?.transactionStatus === "Y" && user.commonEntity?.message === "Success") {
                  this.authService.setProfileDetails(user.userDetailEntity[0]);
                }
              });

              this.dialogRef.close(response.trashDetailsEntity);
            }
          }
        });
    }
  }
  uploadFormdata(fileName: string, file: File) {
    this.formData.append('FileName', fileName);
    this.formData.append('file', file, file.name);
  }
}