import logging from '../../config/logging';
import { HTTP_STATUS } from '../../config/http_status';
import { ElasticBaseDao } from './ElasticConnector';
import { User } from '../../interfaces/auth';
import UserDao from '../UserDao';
import { DaoErrorHandler } from './utils/error_handler';

const NAMESPACE = 'USER_DAO';
const indexName = 'user';

const ElasticUserDao: UserDao = {
    ...ElasticBaseDao,

    getById(userId: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const { body } = await ElasticBaseDao.client.get({
                    index: indexName,
                    id: userId,
                });
                const userDoc = body._source as any;
                resolve({ ...userDoc, id: body._id });
            } catch (error) {
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },

    toggleLibraryGame(userId: string, gameId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getById(userId);
                // logging.info(NAMESPACE, 'toggleLibraryGame - userdata', user);
                let newGames = [];
                let action = 'error';

                if (user.games === undefined || !user.games.includes(gameId)) {
                    newGames = [...user.games, gameId];
                    action = 'add';
                } else {
                    user.games.splice(user.games.indexOf(gameId), 1);
                    newGames = user.games;
                    action = 'remove';
                }

                await ElasticBaseDao.client.update({
                    index: indexName,
                    id: userId,
                    body: {
                        doc: {
                            games: newGames,
                        },
                    },
                });

                resolve({ action, games: newGames });
            } catch (error) {
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },
};

export default ElasticUserDao;
