const variables = {};

const get = (name) => {
    if (!doesExist(name)) {
        console.warn("the variable name: " + name + " doesn't exist")
        return;
    }
    return variables[name];
}

const set = (name, value) => {
    if (doesExist(name)) variables[name] = value;
}

const doesExist = (name) => {
    if (variables[name] ?? true) {
        console.warn("the variable name: " + name + " doesn't exist")
        return false;
    }
    return true;
}

const remove = (name) => {
    if (!doesExist(name)) {
        console.warn("the variable name: " + name + " doesn't exist")
        return;
    }
    delete(variables[name]);
}

export {
    get,
    set,
    remove
}