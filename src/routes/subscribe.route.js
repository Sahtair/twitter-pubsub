const app = require('../utils/express.helper');
const { insertItem } = require('../utils/store.helper');

app.post('/subscribe', async (req, res) => {
    try {
        const { url } = req.body;

        console.log('URL to insert', url)

        insertItem(url);

        return res.send();
    } catch (err) {
        console.log(err);

        return res.status(500).send(`Error subscribing to channel.`);
    }
});
