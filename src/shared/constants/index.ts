export const roles = ["full_access", "can_view", "can_edit"];
export const create_roles = ["full_access", "can_edit"];
export const access_roles = ["full_access"];
export const FULL_ACCESS = "full_access";
export const CAN_VIEW = "can_view";
export const CAN_EDIT = "can_edit";
export const REMOVE_ACCESS = "remove_access";

export const HTTP_RESPONSE_CODE = {
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  CREATED: 201,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};

export const enum HttpStatusCode {
  NOT_FOUND = 404,
  CREATED = 201,
  CONFLICT = 409,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export const APP_ERROR_MESSAGE = {
  serverError: "Something went wrong, We are fixing it asap :)",
};
