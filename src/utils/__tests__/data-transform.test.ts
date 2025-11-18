import { objectToFormData, stringsToOptions } from '../data-transform';

// Mock the Option type from components
jest.mock('@/components/option-bottom-sheet', () => ({
  Option: {},
}));

describe('data transform utilities', () => {
  describe('stringsToOptions', () => {
    it('should convert array of strings to options', () => {
      const input = ['apple', 'banana', 'orange'];
      const result = stringsToOptions(input);

      expect(result).toEqual([
        { label: 'apple', value: 'apple' },
        { label: 'banana', value: 'banana' },
        { label: 'orange', value: 'orange' },
      ]);
    });

    it('should handle empty array', () => {
      const result = stringsToOptions([]);
      expect(result).toEqual([]);
    });

    it('should handle single string', () => {
      const result = stringsToOptions(['single']);
      expect(result).toEqual([{ label: 'single', value: 'single' }]);
    });

    it('should handle strings with spaces', () => {
      const input = ['hello world', 'foo bar'];
      const result = stringsToOptions(input);

      expect(result).toEqual([
        { label: 'hello world', value: 'hello world' },
        { label: 'foo bar', value: 'foo bar' },
      ]);
    });

    it('should handle strings with special characters', () => {
      const input = ['test-value', 'test_value', 'test.value'];
      const result = stringsToOptions(input);

      expect(result).toEqual([
        { label: 'test-value', value: 'test-value' },
        { label: 'test_value', value: 'test_value' },
        { label: 'test.value', value: 'test.value' },
      ]);
    });

    it('should handle strings with numbers', () => {
      const input = ['option1', 'option2', '123'];
      const result = stringsToOptions(input);

      expect(result).toEqual([
        { label: 'option1', value: 'option1' },
        { label: 'option2', value: 'option2' },
        { label: '123', value: '123' },
      ]);
    });

    it('should maintain order of items', () => {
      const input = ['z', 'a', 'm', 'b'];
      const result = stringsToOptions(input);

      expect(result.map((r) => r.value)).toEqual(['z', 'a', 'm', 'b']);
    });

    it('should handle large arrays', () => {
      const input = Array.from({ length: 100 }, (_, i) => `item${i}`);
      const result = stringsToOptions(input);

      expect(result).toHaveLength(100);
      expect(result[0]).toEqual({ label: 'item0', value: 'item0' });
      expect(result[99]).toEqual({ label: 'item99', value: 'item99' });
    });
  });

  describe('objectToFormData', () => {
    it('should convert simple object to FormData', () => {
      const obj = { name: 'John', age: 30 };
      const formData = objectToFormData(obj);

      expect(formData.get('name')).toBe('John');
      // FormData converts all values to strings
      expect(formData.get('age')).toBe('30');
    });

    it('should handle empty object', () => {
      const obj = {};
      const formData = objectToFormData(obj);

      expect(formData).toBeInstanceOf(FormData);
    });

    it('should handle object with string values', () => {
      const obj = { email: 'test@example.com', username: 'testuser' };
      const formData = objectToFormData(obj);

      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('username')).toBe('testuser');
    });

    it('should handle object with number values', () => {
      const obj = { count: 42, price: 19.99, quantity: 0 };
      const formData = objectToFormData(obj);

      // FormData converts numbers to strings
      expect(formData.get('count')).toBe('42');
      expect(formData.get('price')).toBe('19.99');
      expect(formData.get('quantity')).toBe('0');
    });

    it('should handle object with boolean values', () => {
      const obj = { active: true, deleted: false };
      const formData = objectToFormData(obj);

      // FormData converts booleans to strings
      expect(formData.get('active')).toBe('true');
      expect(formData.get('deleted')).toBe('false');
    });

    it('should handle object with null values', () => {
      const obj = { name: 'John', middle: null };
      const formData = objectToFormData(obj);

      expect(formData.get('name')).toBe('John');
      // FormData converts null to string "null"
      expect(formData.get('middle')).toBe('null');
    });

    it('should handle object with undefined values', () => {
      const obj = { name: 'John', description: undefined };
      const formData = objectToFormData(obj);

      expect(formData.get('name')).toBe('John');
      // FormData converts undefined to string "undefined"
      expect(formData.get('description')).toBe('undefined');
    });

    it('should handle mixed type values', () => {
      const obj = {
        username: 'john_doe',
        age: 28,
        isActive: true,
        bio: null,
        rating: 4.5,
      };
      const formData = objectToFormData(obj);

      expect(formData.get('username')).toBe('john_doe');
      expect(formData.get('age')).toBe('28');
      expect(formData.get('isActive')).toBe('true');
      expect(formData.get('bio')).toBe('null');
      expect(formData.get('rating')).toBe('4.5');
    });

    it('should handle object with special characters in keys', () => {
      const obj = { user_name: 'john', 'user-email': 'john@example.com' };
      const formData = objectToFormData(obj);

      expect(formData.get('user_name')).toBe('john');
      expect(formData.get('user-email')).toBe('john@example.com');
    });

    it('should handle object with many keys', () => {
      const obj: Record<string, string | number> = {};
      for (let i = 0; i < 50; i++) {
        obj[`field${i}`] = i;
      }

      const formData = objectToFormData(obj);

      expect(formData.get('field0')).toBe('0');
      expect(formData.get('field25')).toBe('25');
      expect(formData.get('field49')).toBe('49');
    });

    it('should return FormData instance', () => {
      const obj = { test: 'value' };
      const result = objectToFormData(obj);

      expect(result instanceof FormData).toBe(true);
    });
  });
});
