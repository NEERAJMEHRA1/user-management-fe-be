import config from "../helper/envconfig/envVars.js";

class userResponse {
    constructor(instant) {
        this._id = instant._id ? instant._id : null;
        this.firstName = instant.firstName ? instant.firstName : '';
        this.lastName = instant.lastName ? instant.lastName : '';
        this.userName = instant.userName ? instant.userName : '';
        this.email = instant.email ? instant.email : '';
        this.address = instant.address ? instant.address : '';
        this.gender = instant.gender ? instant.gender : '';
        this.age = instant.age ? instant.age : 0;
    }
};

export default userResponse;