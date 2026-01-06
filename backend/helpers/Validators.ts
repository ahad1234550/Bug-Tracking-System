export class Validators {

  static isValidStr(str: string): boolean {

    if (!str) {

      return false;

    }

    return (str && typeof (str) === 'string' && str.trim() && str !== '');

  }

  static isValidDate(date: Date): boolean {

    const valid = (new Date(date)).getTime() > 0;

    return valid;

  }

  static isValidName(str: string): boolean {
    if (!str) {
      return false;
    }
    return /^[A-Za-z ]+$/.test(str);
  }

  static isValidSSN(ssn: string): boolean {

    const re = /^\d{3}-?\d{2}-?\d{4}$/;

    return re.test(ssn);

  }

  static isValidFloat(number: string): boolean {

    const valid = /^-?\d*(\.\d+)?$/;

    return valid.test(number);

  }

  static isValidateEmail(email: string): boolean {

    const re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;

    return re.test(String(email).toLowerCase());

  }

  static isValidPhoneNumber(phone: string): boolean {
    if (!phone) {
        return false;
    }
    return /^\+92\d{10}$/.test(phone);
}


  static isValidJSON(str: string | object | null): boolean {

    if (!str) {

      return false;

    }

    if (typeof str === 'string') {

      try {

        str = JSON.parse(str);

      } catch (e) {

        return false;

      }

    }

    return (!!Object.keys(str).length);

  }

  // static isValidPassword (pPassword) {
  //
  //   if (config.activatePasswordStrength) {
  //
  //     if (/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pPassword)) {
  //
  //       return true
  //
  //     }
  //
  //     return false
  //
  //   }
  //
  //   return Validators.isValidStr(pPassword)
  //
  // }

  static isValidPassword(password: string): boolean {

    if (Validators.isValidStr(password) && password.length >= 8) {

      return true;

    }

    return false;

  }

  static isValidPasswordCheck(password: string, confirm_password: string): boolean {
    if (password === confirm_password) {
      return true;
    }
    return false;
  }

  static isValidRole(role: string): boolean {
    if (role === 'manager' || role === 'qa' || role === 'developer') {
      return true;
    }
    return false;
  }

  static getParsedJson<T = any>(data: string | object | null): T | null {

    if (!data) {

      return null;

    }

    if (typeof data === 'string') {

      try {

        return JSON.parse(data);

      } catch (e) {

        console.log(e.message);

        return null;

      }

    } else if (Object.keys(data).length) {

      return data as T;

    }

  }

  static propExists(key: string, obj: object): boolean {

    return (Object.prototype.hasOwnProperty.call(obj, key) && (key in obj));

  }

  static isArray(variable: Array<string>): boolean {

    return (variable && (Object.prototype.toString.call(variable) === '[object Array]') && Array.isArray(variable));

  }

  static parseInteger(value: string, defaultValue: number): number {

    try {

      const val: number = parseInt(value, 10);

      return Number.isNaN(val) ? defaultValue : val;

    } catch (ex) {

      return defaultValue;

    }

  }

  static validateCode(code: number, defaultCode: number): number {

    if (code >= 400 && code < 500) {

      return code;

    }

    return defaultCode;

  }

  static isPNG(fileName: string): boolean {

    if (!fileName || !fileName.length || fileName.lastIndexOf('.') === -1) {

      return false;

    }

    return fileName.substring(fileName.lastIndexOf('.') + 1) === 'png';

  }

  static isObject(value: object): boolean {

    return value && typeof value === 'object' && value.constructor === Object;

  }

  static isString(value: string): boolean {

    if (!value) {

      return false;

    }

    return Boolean(value && typeof value === 'string' && value.trim());

  }

  static isBoolean(value: string): boolean {

    try {

      return typeof JSON.parse(value) === 'boolean';

    } catch (err) {

      return false;

    }

  }

  static isValidDomain(email: string, domain: string): boolean {

    if (this.isValidStr(email) && this.isValidStr(domain)) {

      const pattern = new RegExp(`@?(${domain})$`, 'i');

      return pattern.test(email);

    }

    return false;

  }

  static isFunction(fn: Function): boolean {

    return fn && typeof fn === 'function';

  }

  static isUndefined(obj: undefined): boolean {

    return typeof obj === 'undefined';

  }

  static isNumber(value: number): boolean {

    return typeof value === 'number';

  }

  static isValidNumber(value: number | string): boolean {

    const val = Number(value);
    return Number.isFinite(val);

  }


  static isNaN(value: number): boolean {

    return Number.isNaN(value);

  }

  static getParsedValue(value: string): boolean | number | string {

    try {

      if (!value || value.trim() === '') {

        return value;

      }

      const boolValue = value.toLowerCase();

      if (boolValue === 'true') {

        return true;

      }

      if (boolValue === 'false') {

        return false;

      }

      const num = Number(value);

      if (!Number.isNaN(num)) {

        const numberRegEx = new RegExp(/^\d+(\.\d+)?$/);

        if (numberRegEx.test(value)) {

          return num;

        }

      }

    } catch (err) {

      console.log(`getParsedValue:: Error occurred while parsing value: ${value} error: `, err);

    }

    return value;

  }

}

