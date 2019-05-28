describe('Unit tests - mongo.helper', () => {
    let MongoClient;
    let returnMongoConnection;

    // mock redis port
    process.env.MONGO_URL = 'someurl';

    beforeAll(() => {
        // mock mongodb to return MongoClient object.
        jest.mock('mongodb', () => ({
            MongoClient: {
                connect: jest.fn()
            }
        }));
        ({ MongoClient } = require('mongodb'));
    });

    afterAll(() => {
        jest.unmock('mongodb');
    });

    beforeEach(() => {
        jest.isolateModules(() => {
            ({ returnMongoConnection } = require('../../src/utils/mongo.helper'));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should resolve promise and return client', async () => {
        expect.assertions(2);

        const returnClient = 'someClient';
        // mock connect funtion to call provided callback and check if the host
        // is correct
        MongoClient.connect.mockResolvedValue(returnClient);

        const response = await returnMongoConnection();
        expect(response).toBe(returnClient);
        expect(MongoClient.connect).toHaveBeenCalledWith(
            process.env.MONGO_URL,
            { useNewUrlParser: true }
        );
    });

    test('should reject promise and return error', async () => {
        const error = 'err';
        // mock connect funtion to call provided callback and check if the host
        // is correct
        MongoClient.connect.mockRejectedValue(error)

        expect(returnMongoConnection()).rejects.toBe(error)
    });
});
