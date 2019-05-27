describe('Unit tests - cache.helper', () => {
    let redisClient;
    let cache;

    beforeAll(() => {
        // mock mongodb to return MongoClient object.
        jest.mock('../../src/utils/redis.helper', () => ({
            set: jest.fn(),
            get: jest.fn(),
            rpush: jest.fn(),
            llen: jest.fn(),
            lpop: jest.fn(),
            del: jest.fn(),
            on: jest.fn()
        }));
        redisClient = require('../../src/utils/redis.helper');
    });

    afterAll(() => {
        jest.unmock('../../src/utils/redis.helper');
    });

    beforeEach(() => {
        jest.isolateModules(() => {
            cache = require('../../src/utils/cache.helper');
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    
    test('should return all defined functions', () => {
        const functionNameArray = [
            'setCache',
            'getCache',
            'setListCache',
            'getListLength',
            'popElement',
            'invalidateCache',
            'invalidateAll'
        ];

        expect(Object.keys(cache)).toEqual(functionNameArray);
    });

    describe('test suit for setCache function', () => {
        let setCache;
        const key = 'someRedisKey';
        const data = 'someData';
        const error = 'error';

        const mockFn = (e = false) => {
            redisClient.set.mockImplementation((k, d, fn) => {
                expect(k).toBe(key);
                expect(d).toBe(data);
                return fn(e);
            })
        };

        beforeEach(() => {
            ({ setCache } = cache);
        });

        test('should call function and resolve function', () => {
            mockFn();

            expect(setCache(key, data)).resolves;
            expect(redisClient.set).toHaveBeenCalled();
        });

        test('should call function and reject function', () => {
            mockFn(error);

            expect(setCache(key, data)).rejects.toBe(error);
            expect(redisClient.set).toHaveBeenCalled();
        });
    });

    describe('test suit for getCache function', () => {
        let getCache;
        const key = 'someRedisKey';
        const error = 'error';

        const mockFn = (e = false) => {
            redisClient.get.mockImplementation((k, fn) => {
                expect(k).toBe(key);
                return fn(e);
            })
        };

        beforeEach(() => {
            ({ getCache } = cache);
        });

        test('should call function and resolve function', () => {
            mockFn();

            expect(getCache(key)).resolves;
            expect(redisClient.get).toHaveBeenCalled();
        });

        test('should call function and reject function', () => {
            mockFn(error);

            expect(getCache(key)).rejects.toBe(error);
            expect(redisClient.get).toHaveBeenCalled();            
        });
    });

    describe('test suit for setListCache function', () => {
        let setListCache;
        const key = 'someRedisKey';
        const data = 'someData'
        const error = 'error';

        const mockFn = (e = false) => {
            redisClient.rpush.mockImplementation((k, d, fn) => {
                expect(k).toBe(key);
                expect(d).toBe(data);
                return fn(e);
            })
        };

        beforeEach(() => {
            ({ setListCache } = cache);
        });

        test('should call function and resolve function', () => {
            mockFn();

            expect(setListCache(key, data)).resolves;
            expect(redisClient.rpush).toHaveBeenCalled();

        });

        test('should call function and reject function', () => {
            mockFn(error);

            expect(setListCache(key, data)).rejects.toBe(error);
            expect(redisClient.rpush).toHaveBeenCalled();

        });
    });
});
