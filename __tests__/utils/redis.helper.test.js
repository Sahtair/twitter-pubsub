describe('Unit tests - redis.helper', () => {
    let redis;

    // mock redis port
    process.env.REDIS_PORT = 12345;

    beforeAll(() => {
        jest.mock('redis', () => ({
            createClient: jest.fn()
        }));
        redis = require('redis');
    });

    afterAll(() => {
        jest.unmock('redis');
    })

    afterEach(() => {
        jest.resetAllMocks();
    })

    test('should require and invoce redis', () => {
        require('../../src/utils/redis.helper');

        expect(redis.createClient).toHaveBeenCalledWith(process.env.REDIS_PORT, process.env.REDIS_HOST || "localhost");
    });

    test('should already have a redis instance', () => {
        require('../../src/utils/redis.helper');
        
        expect(redis.createClient).not.toHaveBeenCalled();
    })
});
