export interface TrashRequest {
  userid?: string
  timestamp?: Date | null,
  nELatitude: Number,
  nWLatitude: Number,
  sELatitude: Number,
  sWLatitude: Number,
  nELongitude: Number,
  nWLongitude: Number,
  sELongitude: Number,
  sWLongitude: Number,
  zoom: Number
}
export interface TrashCommonEntity {
  UserId: string
}

export interface TrashEntity {
  uid: string,
  IsRecovered?: boolean,
  CategoryId?: number,
  Latitude?: number,
  Longitude?: number,
  ImageUrl?: string,
  Filename?: number,
  Title?: number,
  TransactionId?: string,
  ReportedDate?: Date | null,
}

export interface TrashAttachmentEntity {
  TrashId?: string
  TransactionId?: number
  AttachmentTransactionId?: number
  AttachmentName?: string
  AttachmentType?: string
  FileType?: string
  FileSize?: number

}

export interface AddTrashRequest {
  CommonEntity: TrashCommonEntity,
  TrashList: TrashEntity[],
  AttachmentEntity: TrashAttachmentEntity[]
}


