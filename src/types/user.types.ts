
export type userState = {
    token: undefined | string
}

export interface UserData {
    _id: string;
    name: string;
    email: string;
    gender: string;
    dateOfBirth: string; // Assuming this is a string in the format "DD-MM-YYYY"
    photo: string;
    createdAt: string; // Assuming this is an ISO 8601 date string
  }