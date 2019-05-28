const {
    MONITORING,
    INVALIDATE_CACHE
} = process.env;

if (MONITORING === 'true') {
    console.log('Monitoring attached');
    require('appmetrics-dash').monitor();
}

const app = require('./src/utils/express.helper');
const { invalidateAll } = require('./src/utils/cache.helper');

const init = async () => {
    if (INVALIDATE_CACHE === 'true') {
        await invalidateAll();
    }
    
    try {
        require('./src/routes');
        require('./src/services');
    } catch (e) {
        console.error('fucking erroren', e)
    }
    
    app.listen(4040, () => {
        console.log(`listening on port: 4040`);
    });
};

init();
