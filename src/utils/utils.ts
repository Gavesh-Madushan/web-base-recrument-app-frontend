import { SECRET_KEY } from "../store/constants";
import CryptoJS from "crypto-js";
import * as Yup from "yup";

/**
 * Password validator for login pages
 */
// has number
const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed = (number) =>
  new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// set color based on password strength
export const strengthColor = (count) => {
  if (count < 2) return { label: "Poor", color: "#f44336" };
  if (count < 3) return { label: "Weak", color: "#ffc107" };
  if (count < 4) return { label: "Normal", color: "#ffab91" };
  if (count < 5) return { label: "Good", color: "#00e676" };
  if (count < 6) return { label: "Strong", color: "#00c853" };
  return { label: "Poor", color: "#f44336" };
};

// password strength indicator
export const strengthIndicator = (number) => {
  let strengths = 0;
  if (number.length > 5) strengths += 1;
  if (number.length > 7) strengths += 1;
  if (hasNumber(number)) strengths += 1;
  if (hasSpecial(number)) strengths += 1;
  if (hasMixed(number)) strengths += 1;
  return strengths;
};

export function formatMobile(mobile) {
  mobile = mobile?.toString();
  if (mobile?.length === 0) {
    mobile = "";
  } else if (mobile?.length <= 3) {
    mobile = mobile?.replace(/^(\d{0,3})/, "($1)");
  } else if (mobile?.length <= 6) {
    mobile = mobile?.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
  } else if (mobile?.length === 9) {
    mobile = mobile?.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})/, "($1) $2 $3");
  } else if (mobile?.length <= 10) {
    mobile = mobile?.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, "($1) $2 $3");
  } else if (mobile?.length === 11) {
    mobile = mobile?.replace(
      /^(\d{0,2})(\d{0,2})(\d{0,3})(\d{0,4})/,
      "+$1 ($2) $3 $4"
    );
  }

  return mobile;
}

// fromat comma separeted mobile number string to 880XXxxxxxxx format string
export function formatMobileNumberString(numberString) {
  numberString = numberString?.toString();
  let formatedNumberString = "";
  if (numberString !== "" && numberString.length >= 10) {
    formatedNumberString = numberString
      .split(",")
      .map((number) => {
        if (number.startsWith("1")) {
          return "(880)" + number;
        }
        if (number.startsWith("0")) {
          return "(880)" + number.substring(1);
        }
        return number.replace(/^00880|^\+880|^880/, "(880)");
      })
      .join(",");
  }

  return formatedNumberString;
}

export function currencyFormat(num, unit, fractionDigits) {
  return (
    unit +
    num?.toFixed(fractionDigits).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

export function longTextShow(text, maxLength) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
}

export function findCampaignStatus(status) {
  let statusName;
  let statusColor;

  if (status === 0) {
    statusName = "Pending";
    statusColor = "info.main";
  } else if (status === 1) {
    statusName = "Running";
    statusColor = "primary.main";
  } else if (status === 2) {
    statusName = "Completed";
    statusColor = "success.main";
  } else if (status === 3) {
    statusName = "Processng";
    statusColor = "warning.dark";
  }
  // else if (status === 4) {
  //     statusName = "Modified";
  //     statusColor = "secondery.main";
  // }
  else if (status === 5) {
    statusName = "Paused";
    statusColor = "warning.main";
  } else if (status === 6) {
    statusName = "Expired";
    statusColor = "error.dark";
  } else if (status === 7) {
    statusName = "Stopped";
    statusColor = "error.main";
  } else {
    statusName = "-";
    statusColor = "inherit";
  }

  return { status: statusName, color: statusColor };
}

export function findNumberStatus(status) {
  let statusName;
  let statusColor;

  if (status === 0) {
    statusName = "Pending";
    statusColor = "warning.main";
  } else if (status === 1) {
    statusName = "Successfully Submitted";
    statusColor = "success.main";
  } else if (status === 2) {
    statusName = "Failed due to system TPS";
    statusColor = "error.main";
  } else if (status === 3) {
    statusName = "Failed by Operator";
    statusColor = "error.main";
  } else {
    statusName = "-";
    statusColor = "inherit";
  }

  return { status: statusName, color: statusColor };
}

export function getTimeWelcome() {
  const hours = new Date().getHours();

  if (+hours < 12) {
    return "Good Morning!";
  } else if ((+hours > 12 && +hours < 16) || +hours === 12) {
    return "Good Afternoon!";
  } else {
    return "Good Evening!";
  }
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  if (name !== " ") {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children:
        name?.split(" ").length > 1
          ? `${name?.split(" ")[0][0]}${name?.split(" ")[1][0]}`
          : name?.split(" ")[0][0],
    };
  }
}

export function encrypt(cipherText) {
  if (cipherText) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(cipherText),
      SECRET_KEY
    ).toString();
  }
}

export function decrypt(cipherText) {
  if (cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}

export const _setImage = async (src, filename) => {
  try {
    if (src) {
      return await fetch(src)
        .then((r) => r.blob())
        .then((blobFile) => {
          new File([blobFile], filename, { type: blobFile.type });
        });
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const _setBlobToFile = async (blobFile, filename) => {
  try {
    if (blobFile instanceof Blob) {
      return new File([blobFile], filename, { type: blobFile.type });
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export function getSalaryRange(val) {
  let range;
  switch (val) {
    case 0:
      range = "Between Rs. 100,000 & Rs. 200,000";
      break;
    case 1:
      range = "Between Rs. 200,000 & Rs. 300,000";
      break;
    case 2:
      range = "Above Rs. 300,000";
      break;
    default:
      range = "inavlid";
  }

  return range;
}

export function getIncomeType(val) {
  let type;
  switch (val) {
    case 0:
      type = "Salaried Employee";
      break;
    case 1:
      type = "Other Income";
      break;
    default:
      type = "inavlid";
  }

  return type;
}

export function getEmployeeType(val) {
  let type;
  switch (val) {
    case 0:
      type = "Permanent";
      break;
    case 1:
      type = "Contract";
      break;
    case 2:
      type = "Self Employed";
      break;
    default:
      type = "inavlid";
  }

  return type;
}

// message character count start here. import only messageCounterUpdate and pass the message
function hasUnicode(str) {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) {
      return true;
    }
  }
  return false;
}

const setMessageLength = (message, msgDefaultSize) => {
  let messageRemLength;
  let numberOfMessages;

  const msgTempLength = message.length;

  const quotient = Math.floor(msgTempLength / msgDefaultSize);
  const remainder =
    (msgTempLength - msgDefaultSize * quotient) % msgDefaultSize;
  if (msgTempLength % msgDefaultSize === 0) {
    if (msgTempLength === msgDefaultSize * quotient && msgTempLength !== 0) {
      messageRemLength = 0;
      numberOfMessages = quotient;
    } else {
      messageRemLength = msgDefaultSize - remainder;
      numberOfMessages = quotient;
    }
  } else {
    messageRemLength = msgDefaultSize - remainder;
    numberOfMessages = quotient + 1;
  }
  //setting number of messages to 1 when ever message box is empty
  if (message.length === 0) {
    numberOfMessages = 1;
  }

  return {
    messageRemLength: messageRemLength,
    numberOfMessages: numberOfMessages,
  };
};

export const messageCounterUpdate = (message) => {
  if (message) {
    if (hasUnicode(message)) {
      // console.log("has unicode");
      return setMessageLength(message, 70);
    } else {
      return setMessageLength(message, 160);
    }
  } else {
    return setMessageLength(message, 160);
  }
};

// character count function end here

export function htmlToString(ref) {
  const msg = ref.current.innerHTML;
  let textMsg;

  if (msg?.startsWith("<div>")) {
    textMsg = msg
      .replaceAll("</div><div>", "\n")
      .replaceAll('<div><span style="font-size: 1rem;">', "\n")
      .replaceAll("</span><div>", "\n")
      .replaceAll("<br>", "")
      .replaceAll("</div>", "")
      .replaceAll("<div>", "")
      .replaceAll("&amp;", "&")
      .replaceAll("&nbsp;", " ")
      .replaceAll(
        document.getElementById("img_col1")?.outerHTML,
        "#ADA_BAN_VAR1"
      )
      .replaceAll(
        document.getElementById("img_col2")?.outerHTML,
        "#ADA_BAN_VAR2"
      )
      .replaceAll(
        document.getElementById("img_col3")?.outerHTML,
        "#ADA_BAN_VAR3"
      )
      .replaceAll(
        document.getElementById("img_col4")?.outerHTML,
        "#ADA_BAN_VAR4"
      )
      .replaceAll(
        document.getElementById("img_col5")?.outerHTML,
        "#ADA_BAN_VAR5"
      )
      .replaceAll(
        document.getElementById("img_col6")?.outerHTML,
        "#ADA_BAN_VAR6"
      )
      .replaceAll(/(<([^>]+)>)/gi, "");
  } else {
    textMsg = msg
      .replace("<div>", "\n")
      .replaceAll("</div><div>", "\n")
      .replaceAll('<div><span style="font-size: 1rem;">', "\n")
      .replaceAll("</span><div>", "\n")
      .replaceAll("<br>", "")
      .replaceAll("</div>", "")
      .replaceAll("<div>", "")
      .replaceAll("&amp;", "&")
      .replaceAll("&nbsp;", " ")
      .replaceAll(
        document.getElementById("img_col1")?.outerHTML,
        "#ADA_BAN_VAR1"
      )
      .replaceAll(
        document.getElementById("img_col2")?.outerHTML,
        "#ADA_BAN_VAR2"
      )
      .replaceAll(
        document.getElementById("img_col3")?.outerHTML,
        "#ADA_BAN_VAR3"
      )
      .replaceAll(
        document.getElementById("img_col4")?.outerHTML,
        "#ADA_BAN_VAR4"
      )
      .replaceAll(
        document.getElementById("img_col5")?.outerHTML,
        "#ADA_BAN_VAR5"
      )
      .replaceAll(
        document.getElementById("img_col6")?.outerHTML,
        "#ADA_BAN_VAR6"
      )
      .replaceAll(/(<([^>]+)>)/gi, "");
  }

  // console.log(textMsg);

  return { textMsg: textMsg, msg: msg };
}

export const general_character_array = [
  "@",
  "£",
  "$",
  "¥",
  "è",
  "é",
  "ù",
  "ì",
  "ò",
  "Ç",
  "\n",
  "Ø",
  "ø",
  "\r",
  "Å",
  "å",
  "Δ",
  "_",
  "Φ",
  "Γ",
  "Λ",
  "Ω",
  "Π",
  "Ψ",
  "Σ",
  "Θ",
  "Ξ",
  "Æ",
  "æ",
  "ß",
  "É",
  " ",
  "!",
  '"',
  "#",
  "¤",
  "%",
  "&",
  "'",
  "(",
  ")",
  "*",
  "+",
  ",",
  "-",
  ".",
  "/",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "¡",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Ä",
  "Ö",
  "Ñ",
  "Ü",
  "§",
  "¿",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "ä",
  "ö",
  "ñ",
  "ü",
  "à",
  "\f",
  "^",
  "{",
  "}",
  "\\",
  "[",
  "~",
  "]",
  "|",
  "€",
];

export function deepEqualLoose(obj1, obj2) {
  // If both are strictly equal, return true
  if (obj1 === obj2) return true;

  // If either is null or not an object, return false (we ignore types)
  if (
    obj1 == null ||
    obj2 == null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return obj1 === obj2; // Loose equality check (e.g., 1 == "1")
  }

  // Get object keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If number of keys is different, objects are not equal
  if (keys1.length !== keys2.length) return false;

  // Compare each key and value in both objects
  for (const key of keys1) {
    if (!deepEqualLoose(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function convert_to_proper_case(text) {
  return text
    ?.split("_") // Split the string by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join them back with a space
}

export const getApproxLocation = async (setAuthState, openSnackBar, auth) => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    setAuthState({
      ...auth,
      address: `${data.city}, ${data.region}, ${data.country_name}`,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  } catch (error) {
    console.error("Failed to fetch IP-based location", error);
    setAuthState({
      ...auth,
      error: error,
    });
    openSnackBar(error, "error", 3000);
  }
};

export const getLocation = (openSnackBar) => {
  if (!navigator.geolocation) {
    openSnackBar("Geolocation not supported", "error", 3000);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      // console.log({latitude: latitude, longitude: longitude})
      // setAuthState({ ...auth, latitude: latitude, longitude: longitude });

      // Reverse geocode to get address
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      )
        .then((res) => res.json())
        .then(() => {
          // setAuthState({ ...auth, address: data.display_name });
        })
        .catch((err) => {
          openSnackBar(err, "error", 3000);
          // setAuthState({
          //   ...auth,
          //   error: err,
          // });
        });
    },
    (error) => {
      // setAuthState({ ...auth, error: error.message });
      openSnackBar(error.message, "error", 3000);
    }
  );
};

// Function to enhance all Yup string fields with common validations
export const applyGlobalValidations = (schema: Yup.ObjectSchema<any>) => {
  const updatedFields = Object.keys(schema.fields).reduce((acc: any, key) => {
    const field = schema.fields[key];

    // Apply common rules only if the field is a string
    if (field instanceof Yup.StringSchema) {
      acc[key] = field
        .trim("Cannot start or end with a space")
        .strict()
        .test(
          "no-spaces",
          "Cannot start or end with a space",
          (value) => !value?.startsWith(" ") && !value?.endsWith(" ")
        );
    } else {
      acc[key] = field; // Keep non-string fields unchanged
    }

    return acc;
  }, {} as Record<string, Yup.AnySchema>);

  return Yup.object().shape(updatedFields);
};

export const convertToCents = (value: number | string) => {
  const numberValue = Number(value);
  const result = numberValue * 100;
  if (numberValue === 0) {
    return 0;
  } else {
    return Math.round(result); // Rounds to nearest integer
  }
};

export const convertToRupees = (value: number | string) => {
  const numberValue = Number(value);
  if (numberValue === 0) {
    return 0;
  } else {
    // Return the result as a number with exactly 2 decimal places
    return parseFloat((numberValue / 100).toFixed(2));
  }
};


export const defaultLocation = [6.9271, 79.8612]
