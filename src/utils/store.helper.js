let storedItems = [];

/**
 * @function getItems
 * @returns {Array} Returns array of all stored items.
 */
const getItems = () => {
    return storedItems;
};

/**
 * @function findItem
 * @param {String} url Url that you are trying to find in stored items.
 * @returns {Boolean} Return true or false if url is found in stored items.
*/
const findItem = (url) => {
    return storedItems.indexOf(url) > -1;
};

/**
 * @function insertItem
 * @param {String} url Url that you are trying to store.
 * @returns {Boolean} Returns true if item is inserted or is already in sotored items.
 */
const insertItem = (url) => {
    if (!findItem(url)) {
        storedItems = storedItems.concat(url);
    }
    return true;
};

/**
 * @function removeItem
 * @param {String} url Url of the item that is being removed.
 * @throws {404} If item is not found.
 * @returns {Boolean} If item is removed.
 */
const removeItem = (url) => {
    if (!findItem(url)) {
        const error = new Error('Item not found');
        error.status = 404;
        throw error;
    }
    storedItems = storedItems.filter(item => item !== url);
    return true;
}

module.exports = {
    getItems,
    insertItem,
    findItem,
    removeItem
};
