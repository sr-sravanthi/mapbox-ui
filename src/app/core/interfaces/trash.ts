export interface TrashRequest {
  userid?: string
  timestamp?: Date | null,
  nELatitude: number,
  nWLatitude: number,
  sELatitude: number,
  sWLatitude: number,
  nELongitude: number,
  nWLongitude: number,
  sELongitude: number,
  sWLongitude: number,
  zoom: number
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
  AttachmentId?: string
  AttachmentType?: string
  FileName?: string
  FileUrl?: string
  IsActive?: boolean

}

export interface AddTrashRequest {
  CommonEntity: TrashCommonEntity,
  TrashList: TrashEntity[],
  AttachmentEntity: TrashAttachmentEntity[]
}


