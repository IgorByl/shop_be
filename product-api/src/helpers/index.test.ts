/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject } from './';

describe('Helpers', () => {
  describe('isObject function', () => {
    it('should return true on object', () => {
      expect(isObject({})).toBe(true);
    });
    it('should return false on non-object', () => {
      expect(isObject(undefined)).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(false)).toBe(false);
      expect(isObject('')).toBe(false);
    });
  });
});
