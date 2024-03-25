export interface UserType {
    id: number,
    code: string,
    name: string
}

export interface TrashCatergory {
    id: number,
    code: string,
    name: string,
    imageURL: string,
    sortOrder: number,
    isActive: boolean
}
export interface Company {
    id: string,
    code: string,
}

export interface Vessel {
    id: string,
    vesselObjectId: string,
    vesselName: string,
    imoNumber: string
}

export interface MasterData {
    trashCategories: TrashCatergory[],
    companyData: Company[],
    vesselData: Vessel[],
    userTypes: UserType[]
}