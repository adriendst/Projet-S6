interface IRequirement {
    minimum: string;
}

interface IRawRequirementsData {
    steam_appid: string;
    pc_requirements: IRequirement | Array<any>;
    mac_requirements: IRequirement | Array<any>;
    linux_requirements: IRequirement | Array<any>;
    minimum: string;
    recommended?: string;
}

interface IRequirementsDocument extends Omit<IRawRequirementsData, 'steam_appid'> {
    appid: string;
}
