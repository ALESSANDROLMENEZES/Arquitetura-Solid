import request from 'supertest';
import app from '../config/app';

describe('Cors middlewares', () => {
  test('Deve habilitar cors', async () => {
    app.get('/test_cors', (req, res) => { res.send(); });
    await request(app)
      .get('/test_body_parser')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*');
  });
});
