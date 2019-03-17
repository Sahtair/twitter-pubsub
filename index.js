const app = require('./src/utils/express.helper');
require('./src/routes');
require('./src/services');

app.listen(4040, () => {
    console.log(`listening on port: 4040`);
});
