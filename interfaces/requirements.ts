import { Requirement } from './types/requirement';

export interface Requirements {
    appid: string;
    steam_appid: string;
    pc_requirements?: Requirement;
    mac_requirements?: Requirement;
    linux_requirements?: Requirement;
    minimum: string;
    recommended?: string;
}
