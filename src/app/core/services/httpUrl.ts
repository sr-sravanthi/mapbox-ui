'use strict';

// export const httpUrls = {
//   LOGIN: 'loginV2',
//   SAVEUSER: 'SaveUserDetails',
//   MASTERDATA: 'FetchMasterDetails',
//   COMPANYDATA: 'FetchCompanyDetails',
//   VESSELDATA: 'FetchVesselDetails',
//   TRASHDETAILS: 'FetchTrashDetailsV2',
// };


// Real API
export const httpUrls = {
  LOGIN: "login/LoginV2",
  SAVEUSER: "user/SaveUserDetails",
  MASTERDETAILS: "home/FetchMasterDetails",
  COMAPANYDETAILS: "company/FetchCompanyDetails",
  VESSELDETAILS: "Vessel/FetchVesselDetails",
  TRASHDETAILS: "Trash/FetchTrashDetailsV2",
  RECOVEREDTRASH: "Trash/SaveTrashRecovered",
  POSTIMAGE: "TrashAttachment/postImage"
};

