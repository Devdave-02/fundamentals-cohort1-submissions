const projectController = require('../src/controllers/projectController');

jest.mock('../src/models/Project', () => {
  function Project(data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  }
  // make find return a chainable object with populate that returns a Promise
  Project.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockImplementation(() => Promise.resolve([{ title: 'p1', author: { username: 'a' } }])) }));
  Project.findById = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockImplementation(() => Promise.resolve({ title: 'p1', author: { username: 'a' } })) }));
  return Project;
});

describe('projectController.unit', () => {
  const Project = require('../src/models/Project');
  test('list returns projects', async () => {
    const req = {};
    const res = { json: jest.fn() };
    await projectController.list(req, res, (e) => { throw e; });
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload.projects)).toBe(true);
  });

  test('create saves project with author from req.userId', async () => {
    const req = { body: { title: 't1' }, userId: 'user1' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await projectController.create(req, res, (e) => { throw e; });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
});
