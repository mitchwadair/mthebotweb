module.exports = {
    required: value => {
        if (value) {
            return value.trim && value.trim() === '' ? "This input is required" : !!value;
        }
        return "This input is required";
    },
    noSpaces: value => {
        if (value && value.split(' ').length > 1) {
            return 'Input must not contain spaces';
        }
        return true;
    },
    nameExists: valueList => {
        return value => {
            if (valueList.includes(value)) {
                return 'There is an existing item with that name';
            }
            return true;
        }
    },
    email: value => {
       return  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || "Email is invalid";
    }
}