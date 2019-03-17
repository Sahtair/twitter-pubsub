const app = require('./src/utils/express.helper');
require('./src/routes');

app.listen(4040, () => {
    console.log(`listening on port: 4040`);
});
