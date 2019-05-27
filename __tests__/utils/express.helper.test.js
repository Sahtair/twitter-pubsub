describe('Unit tests - express.helper', () => {
    let express;
    let bodyParser;

    beforeAll(() => {
        jest.mock('express', () => jest.fn(() => {
            return {
                use: jest.fn()
            }
        }));
        express = require('express');

        jest.mock('body-parser', () => {
            return {
                urlencoded: jest.fn(),
                json: jest.fn()
            }
        });
        bodyParser = require('body-parser');
    });

    afterAll(() => {
        jest.unmock('express')
        jest.unmock('body-parser')
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    test('should require and invoce express and body-parser functions', () => {
        require('../../src/utils/express.helper');

        expect(express).toHaveBeenCalled();
        expect(bodyParser.urlencoded).toHaveBeenCalledWith({ extended: false });
        expect(bodyParser.json).toHaveBeenCalled();
    });

    test('should already have an app instance', () => {
        require('../../src/utils/express.helper');
        
        expect(express).not.toHaveBeenCalled();
        expect(bodyParser.urlencoded).not.toHaveBeenCalled()
        expect(bodyParser.json).not.toHaveBeenCalled();
    })
});
