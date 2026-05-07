export const CREDITS_GUEST = 10; // how many credits guest user starts with
export const MONTHLY_CREDITS_GUEST = 10;
export const GUEST_SESSION_EXPIRES = 2592000;

// 1 month
export const MONTH_PASSED = 30;

/*
    subscription features
*/

export const Free = {
    monthlyCredits: 15,
    fileUploadLimit: 10
}

export const Plus = {
    monthlyCredits: 250,
    fileUploadLimit: 25,
    disabledAds: true
}

export const Premium = {
    monthlyCredits: 500,
    fileUploadLimit: 50,
    discountsOnCredits: 0.25,
    disabledAds: true
}

export const Pro = {
    monthlyCredits: 1000,
    fileUploadLimit: 100,
    discountsOnCredits: 0.5,
    disabledAds: true
}