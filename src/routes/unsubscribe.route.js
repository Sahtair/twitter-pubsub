const app = require('../utils/express.helper');
const { removeItem } = require('../database/subscribers.controller');

app.post('/unsubscribe', async (req, res) => {
    try {
        const { url } = req.body;

        console.log('URL to remove', url)

        await removeItem(url);

        return res.send();
    } catch (err) {
        console.log(err);

        return res.status(err.status || 500).send(err.message || `Error unsubscribing from channel.`);
    }
});