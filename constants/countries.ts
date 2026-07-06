export interface CountryInfo {
  name: string;
  dialCode: string;
  placeholder: string;
  regex: RegExp;
  errorMsg: string;
}

export const COUNTRY_DETAILS: Record<string, CountryInfo> = {
  "Egypt": {
    name: "Egypt",
    dialCode: "+20",
    placeholder: "010 1234 5678",
    regex: /^01[0125][0-9]{8}$/,
    errorMsg: "Please enter a valid Egyptian phone number starting with 01 (e.g. 01012345678)",
  },
  "Saudi Arabia": {
    name: "Saudi Arabia",
    dialCode: "+966",
    placeholder: "050 123 4567",
    regex: /^0?5[0-9]{8}$/,
    errorMsg: "Please enter a valid Saudi phone number starting with 5 (e.g. 0501234567)",
  },
  "United Arab Emirates": {
    name: "United Arab Emirates",
    dialCode: "+971",
    placeholder: "050 123 4567",
    regex: /^0?5[0-9]{8}$/,
    errorMsg: "Please enter a valid UAE phone number starting with 5 (e.g. 0501234567)",
  },
  "Kuwait": {
    name: "Kuwait",
    dialCode: "+965",
    placeholder: "5123 4567",
    regex: /^[569][0-9]{7}$/,
    errorMsg: "Please enter a valid Kuwaiti phone number (8 digits starting with 5, 6, or 9)",
  },
  "Qatar": {
    name: "Qatar",
    dialCode: "+974",
    placeholder: "3333 1234",
    regex: /^[3567][0-9]{7}$/,
    errorMsg: "Please enter a valid Qatari phone number (8 digits)",
  },
  "Bahrain": {
    name: "Bahrain",
    dialCode: "+973",
    placeholder: "3333 1234",
    regex: /^[369][0-9]{7}$/,
    errorMsg: "Please enter a valid Bahraini phone number (8 digits)",
  },
  "Oman": {
    name: "Oman",
    dialCode: "+968",
    placeholder: "9123 4567",
    regex: /^[9][0-9]{7}$/,
    errorMsg: "Please enter a valid Omani phone number (8 digits starting with 9)",
  },
  "Jordan": {
    name: "Jordan",
    dialCode: "+962",
    placeholder: "07 9123 4567",
    regex: /^0?7[789][0-9]{7}$/,
    errorMsg: "Please enter a valid Jordanian phone number starting with 07 (e.g. 0791234567)",
  },
  "United States": {
    name: "United States",
    dialCode: "+1",
    placeholder: "(555) 000-0000",
    regex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    errorMsg: "Please enter a valid US phone number (10 digits)",
  },
  "United Kingdom": {
    name: "United Kingdom",
    dialCode: "+44",
    placeholder: "7700 900077",
    regex: /^7[0-9]{9}$/,
    errorMsg: "Please enter a valid UK mobile number",
  },
  "Canada": {
    name: "Canada",
    dialCode: "+1",
    placeholder: "(555) 000-0000",
    regex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    errorMsg: "Please enter a valid Canadian phone number (10 digits)",
  },
};

export const COUNTRIES: ReadonlyArray<string> = Object.keys(COUNTRY_DETAILS);