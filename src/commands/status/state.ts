import fetch from 'node-fetch'
export default class State {

    async checkStatus(url: string, accessToken: string): Promise<string> {
        let state = '';
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `${accessToken}`,
            },
            method: 'GET'
        };

        const response = await fetch(url, options);
        if (response.ok) {
            const rJson = JSON.parse(JSON.stringify(await response.json()));
            if (rJson.state === 'running' || rJson.state === 'created') {
                state = 'state ' + rJson.state;
                if (rJson.progress) {
                    console.log(rJson.progress)
                }

                await new Promise(resolve => setTimeout(resolve, 10_000));
                await this.checkStatus(url, accessToken);
            } else if (rJson.state === 'stopped') {
                if (rJson.error) {
                    console.log(rJson.error);
                }

                return rJson.state;
            }
        } else {
            console.log(`Error: ${response.status} - ${response.statusText}`);
            return response.statusText;
        }

        return state;
    }
}