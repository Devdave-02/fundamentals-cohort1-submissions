const authController = require('../src/controllers/authController');

jest.mock('../src/models/User', () => {
  function User(data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  }
  User.findOne = jest.fn();
  return User;
});

describe('authController.unit', () => {
  const User = require('../src/models/User');
  test('register creates a new user when none exists', async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { username: 'u1', email: 'e1', password: 'p1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await authController.register(req, res, (e) => { throw e; });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('token');
    expect(payload).toHaveProperty('user');
  });

  test('login returns token on valid credentials', async () => {
    const fakeUser = { _id: 'id1', username: 'u1', email: 'e1', comparePassword: jest.fn().mockResolvedValue(true) };
    User.findOne.mockResolvedValue(fakeUser);
    const req = { body: { email: 'e1', password: 'p1' } };
    const res = { json: jest.fn() };
    await authController.login(req, res, (e) => { throw e; });
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('token');
    expect(payload.user.email).toBe('e1');
  });
});
