export const BASE_URL = "";

export const ROUTES = {
  INTROSPECT: {
    POST_SIGNUP_CHECK: "/introspect/signup/check",
    POST_SIGNUP_CONFIRM: "/introspect/signup/confirm",
    GET_SIGNUP_OBJECT: "/introspect/signup/object/:uid",
    GET_SIGNUP_PHOTO: "/introspect/signup/photo/:uid",
    GET_SIGNUP_WALLET: "/introspect/signup/wallet/:wallet",
  },
  DAPP: {
    POST_PROFILE_UPDATE: "/dapp/profile/update",
    POST_PROFILE_PHOTO_UPDATE: "/photo/upload",
  },
};
