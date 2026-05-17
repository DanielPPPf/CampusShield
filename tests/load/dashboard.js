import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:4173';

export const options = {
  vus: 50,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/`);
  check(response, {
    'home page responds with 200': (res) => res.status === 200,
    'home page includes CampusShield': (res) => res.body.includes('CampusShield'),
  });
  sleep(1);
}
