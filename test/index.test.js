import * as api from '../src';

test('API', () => {
  expect(typeof api.Link).toBe('function');
  expect(typeof api.Route).toBe('function');
  expect(typeof api.Router).toBe('function');
});
