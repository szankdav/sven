export type userGuild = {
    id: string,
    name: string,
    icon: string,
    banner: string | null,
    owner: boolean,
    permissions: number,
    permissions_new: string,
    features: Array<string>,
};