/*
Title: user.interface.ts
Author: Professor Krasso
Updated Date: 02/09/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: User interface
*/

import { SelectedSecurityQuestion } from "./selected-security-question.interface";



export interface User {
  _id?: string;
  userName?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  selectedSecurityQuestions?: SelectedSecurityQuestion[];
}
