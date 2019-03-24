const app = require('../utils/express.helper');
const { insertItem } = require('../utils/mongo.helper');

app.post('/subscribe', async (req, res) => {
    try {
        const { url } = req.body;

        await insertItem(url);
        
        return res.send({
            message: 'success'
        });
    } catch (err) {
        console.log(err);

        return res.status(500).send(`Error subscribing to channel.`);
    }
});
