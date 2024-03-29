
export interface UserRequest {
    emailid?: string,
    userid?: string,
    username?: string,
    deviceId?: string,
    deviceType?: string,
    firebasetokenId?: string,
    AuthType?: string,
    isGuestUser?: string
}


export interface UserDetails {
    userID: string,
    name: string,
    userNumber?: string,
    imoNumber?: string,
    vesselName?: string,
    userTypeId?: string,
    rank?: number,
    points?: number,
    companyName?: string,
    profileImage?: string,
    companyId?: string,
    vesselId?: string,
    phoneNumber?: string,
    code?: string,
    isRegistered?: boolean,
    level?: boolean,
    isFirstTimeLogin?: boolean,
    isGuestUser?: string

}

export interface GuestUserRequest{
    oldId?:string,
    newId?:string,
    email?:string,
    photoURL?:string,
    name?:string
}

