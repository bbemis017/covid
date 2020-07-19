
import requests
import time

class BaseAPI:

    class APIError(Exception):
        pass


    def __init__(self, api_key, host, port, path):
        extended_url = ''
        if len(path):
            extended_url = '/{}'.format(path)
        self.uri = 'http://{host}:{port}{path}'.format(
            host=host,
            port=port,
            path=extended_url
        )
        self.auth_header = {'Authorization': 'KEY {}'.format(api_key)}

    def start_job(self, template_id):
        url = '{uri}/api/job/{template}'.format(
            uri=self.uri,
            template=template_id
        )

        req = requests.post(url=url,
                            headers=self.auth_header,
                            data={
                                'cache_on': False
                            }
        )
        if req.status_code == 202 and 'id' in req.json():
            return req.json()['id']
        else:
            raise BaseAPI.APIError(req.text)
    
    def get_job_status(self, job_id):
        url = '{uri}/api/job/{job_id}/status'.format(
            uri=self.uri,
            job_id=job_id
        )

        req = requests.get(url=url, headers=self.auth_header)
        if req.status_code == 200:
            state = req.json()['state']
            data = req.json()['data']
            if state == 'SUCCESS':
                if data is None:
                    raise BaseAPI.APIError('Error: no data returned: {}'.format(req.text))
                else:
                    return state, data
            elif state == 'FAILURE':
                raise BaseAPI.APIError('Job Failure: {}'.format(req.text))
            else:
                return state, data

        else:
            raise BaseAPI.APIError('Error status {}: {}'.format(req.status_code, req.text))

    def get_data(self, template_id):

        job_id = self.start_job(template_id)
        print('job started {}'.format(job_id))

        wait_time = 3 # seconds
        max_retries = 10

        data = None
        retry = 0
        while data is None and retry < max_retries:
            state, data = self.get_job_status(job_id)
            time.sleep(wait_time)
            print(state)

        return data