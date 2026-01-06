export class Exception extends Error {

  message : string;
  code : number;
  meta : object;

  
  constructor (message : string, code : number = 500, meta : object) {

    super(message);
    this.code = code;
    this.meta = meta;

    Object.setPrototypeOf(this, Exception.prototype);

  }


  toJson () : {message : string, code: number, meta: object} {

    const json = JSON.parse(JSON.stringify(this.meta || {}));

    json.code = this.code;
    json.message = this.message;

    return json;

  }

}

