let storedItems = [];

const getItems = () => {
    return storedItems;
};

const findItem = (url) => {
    return storedItems.indexOf(url) > -1;
};

const insertItem = (url) => {
    if (!findItem(url)) {
        storedItems = storedItems.concat(url);
    }
    return true;
};

module.exports = {
    getItems,
    insertItem,
    findItem
};
