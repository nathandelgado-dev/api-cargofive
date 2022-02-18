const regexUpperGlobal = (name) => {
    // const namelowerCase = name.toUpperCase();
    return new RegExp(name, 'g');
}

module.exports = {
    regexUpperGlobal
}