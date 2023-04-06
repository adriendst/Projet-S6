import { ElasticBaseDao } from './ElasticConnector';
import { PrivateUser } from '@steam-wiki/types';
import UserDao from '../UserDao';
import { DaoErrorHandler } from './utils/error_handler';
import { APIError } from '../../error/ApiError';
import { HTTP_STATUS } from '../../config/http_status';

const NAMESPACE = 'USER_DAO';
const indexName = 'user';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

const ElasticUserDao: UserDao = {
    ...ElasticBaseDao,

    getById(userId: string): Promise<PrivateUser> {
        return new Promise<PrivateUser>(async (resolve, reject) => {
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

    insertToken({ userId, token, userAgent: user_agent }: { userId: string; token: string; userAgent: string }): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user: PrivateUser = await this.getById(userId);

                const newTokens = user.refresh_tokens ?? [];

                if (newTokens.find((dbToken) => dbToken.token === token)) {
                    reject(APIError.withStatus(HTTP_STATUS.Conflict, 'The token already exists'));
                }

                if (newTokens.some((dbToken) => dbToken.user_agent === user_agent)) {
                    const tokenIndex = newTokens.findIndex((dbToken) => dbToken.user_agent === user_agent);
                    newTokens.splice(tokenIndex, 1);
                }

                newTokens.push({
                    token,
                    user_agent,
                    cearted_at: dateFormatter.format(new Date()),
                });

                await ElasticBaseDao.client.update({
                    index: indexName,
                    id: userId,
                    body: {
                        doc: {
                            refresh_tokens: newTokens,
                        },
                    },
                });

                resolve(true);
            } catch (error) {
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },

    deleteToken({ userId, token, userAgent: user_agent }: { userId: string; token: string; userAgent: string }): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user: PrivateUser = await this.getById(userId);

                const newTokens = user.refresh_tokens ?? [];
                newTokens.splice(
                    newTokens.findIndex((dbToken) => dbToken.token === token),
                    1,
                );

                await ElasticBaseDao.client.update({
                    index: indexName,
                    id: userId,
                    body: {
                        doc: {
                            refresh_tokens: newTokens,
                        },
                    },
                });

                resolve(true);
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
