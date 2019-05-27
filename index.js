<<<<<<< HEAD
const {
    MONITORING
} = process.env;

if (MONITORING === 'true') {
    console.log('Monitoring attached');
    require('appmetrics-dash').monitor();
}

const app = require('./src/utils/express.helper');
const { invalidateAll } = require('./src/utils/cache.helper');

const {
    INVALIDATE_CACHE
} = process.env;

const init = async () => {
    if (INVALIDATE_CACHE === 'true') {
        await invalidateAll();
    }
    
    require('./src/routes');
    require('./src/services');
    
    app.listen(4040, () => {
        console.log(`listening on port: 4040`);
    });
};

init();
=======
const app = require('./src/utils/express.helper');
require('./src/routes');
require('./src/services');

app.listen(4040, () => {
    console.log(`listening on port: 4040`);
});
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426
