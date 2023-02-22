const { beforeAll } = require('@jest/globals');

const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const validateType = require("../src/validation/typeValidation")
const validateSubType = require("../src/validation/subTypeValidation")
const validateColor = require("../src/validation/colorValidation")
const validateLocation = require("../src/validation/locationValidation")
const validateTime = require("../src/validation/timeValidation")
const validateIdentifiable = require("../src/validation/identifiableValidation")


//  Connect to a new in-memory database before running any tests
 
beforeAll(async () => {
    await dbHandler.connect();
});


//  Clear all test data after every test
 
afterEach(async () => {
    await dbHandler.clearDatabase();
});


//  Remove and close the db and server
 
afterAll(async () => {
    await dbHandler.closeDatabase();
});

// Tests for found endpoint

describe('validateType', () => {
    test('returns an error for invalid type', () => {
        const result = validateType({ type: 'not a type' });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Invalid type');
    });

    test('returns success for valid type', () => {
        const result = validateType({ type: 'tech', subtype: 'laptop' });
        expect(result.success).toBe(true);
    });

});

describe('validateSubType', () => {
    test('returns an error for invalid subtype', () => {
        const result = validateSubType({ type: 'tech', subtype: 'not a subtype' });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Invalid subtype');
    });

    test('returns success for valid subtype', () => {
        const result = validateSubType({ type: 'tech', subtype: 'laptop' });
        expect(result.success).toBe(true);
    });
});


describe('validateColor', () => {
    test('returns an error for invalid color format', () => {
      const result = validateColor({ color: 'not an array' });
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Invalid color format. Color must be an array of 3 numbers');
    });
  
    test('returns an error for invalid color values', () => {
      const result = validateColor({ color: [256, -1, 200] });
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Invalid color');
    });
  
    test('returns success for valid color', () => {
      const result = validateColor({ color: [100, 200, 50] });
      expect(result.success).toBe(true);
    });

});

describe('validateLocation', () => {
    test('returns an error for empty location', () => {
        const result = validateLocation({ location: 'not an object' });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Missing location type');

    });

    test('returns an error for invalid location type', () => {
        const result = validateLocation({ location: { type: 'not a type' } });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Invalid location type');

    });
    
    test('returns an error for empty coordinates in exact location', () => {
        const result = validateLocation({ location: { type: 'exact', coordinates: [] } });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Missing coordinates');

    });

    test('returns an error for missing latitude or longitude coordinates in exact location', () => {
        const result = validateLocation({ location: { type: 'exact', coordinates: {longitude: 80 }} });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Missing coordinates');

    });

    test('returns an error for coordinates that are not numbers in exact location', () => {
        const result = validateLocation({ location: { type: 'exact', coordinates: {latitude: 80, longitude: "not a number" } } });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Invalid coordinates. Latitude and longitude must be a number');

    });

    test('returns an error for latitude not being within the valid range in exact location', () => {
        const result = validateLocation({ location: { type: 'exact', coordinates: {latitude: 100, longitude: 100 } } });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Invalid latitude');

    });

    test('returns an error for longitude not being within the valid range in exact location', () => {
        const result = validateLocation({ location: { type: 'exact', coordinates: {latitude: 80, longitude: 200 } } });
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Invalid longitude');

    });

});