import config from '../../config/config';
import { BaseDao } from '../Daos';
import { Client } from '@elastic/elasticsearch';
import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import { HTTP_STATUS } from '../../config/http_status';

class ElasticConnector {
    private esclient: TypedClient;
    private static _instance: ElasticConnector | undefined = undefined;

    private constructor() {
        // @ts-expect-error @elastic/elasticsearch
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

    get client(): TypedClient {
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
    client: ElasticConnector.instance.client,
};

export function NotImplementedFunction(): Promise<never> {
    return new Promise<never>((_, reject) => {
        reject({ ...HTTP_STATUS.NotImplemented, message: 'This function has not yet been implemented' });
    });
}

export default ElasticConnector;
