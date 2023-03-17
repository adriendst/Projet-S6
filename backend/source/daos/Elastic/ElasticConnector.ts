import config from '../../config/config';
import StatusCode from '../../config/statusCodes';
import { BaseDao } from '../Daos';
import { Client } from '@elastic/elasticsearch';

class ElasticConnector {
    private esclient: Client;
    private static _instance: ElasticConnector | undefined = undefined;

    private constructor() {
        this.esclient = new Client({ node: config.elastic.url });
    }

    static get instance(): ElasticConnector {
        try {
            if (ElasticConnector._instance === undefined) ElasticConnector._instance = new ElasticConnector();
            return ElasticConnector._instance;
        } catch (_) {
            throw new Error('Error while building connection');
        }
    }

    get client(): Client {
        return this.esclient;
    }

    public destroy = async () => {
        return new Promise<void>((resolve, reject) => {
            ElasticConnector._instance = undefined;
            resolve();
        });
        // this.instance.client
    };
}

export const ElasticBaseDao: BaseDao = {
    destroy: ElasticConnector.instance.destroy,
    client: ElasticConnector.instance.client
};

export function NotImplementedFunction(): Promise<never> {
    return new Promise<never>((_, reject) => {
        reject({ code: StatusCode.NotImplemented, label: 'Not implemented', message: 'This function has not yet been implemented' });
    });
}

export default ElasticConnector;
