
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const statusCodes = new Counter('http_status_codes');

const url = __ENV.URL || 'http://localhost:8000/api/blog/all';

export const options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '30s', target: 20 },
        { duration: '10s', target: 0 },
    ],
    summaryTrendStats: [
        'min', 'med', 'avg', 'max',
        'p(90)', 'p(95)', 'p(99)',
    ],
};

export default function () {
    const response = http.get(url, {
        tags: { name: 'GET /api/blog/all' },
        timeout: '10s',
    });

    statusCodes.add(1, {
        status: String(response.status),
    });

    check(response, {
        'HTTP status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
