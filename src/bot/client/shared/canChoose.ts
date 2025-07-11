let canChooseArticle = false;
let canChooseHWSWNew = false;
let discordEventReaction = false;

const canChoose = {
    get canChooseArticle(): boolean {
        return canChooseArticle;
    },

    set canChooseArticle(value: boolean) {
        canChooseArticle = value;
    },

    get canChooseHWSWNew(): boolean {
        return canChooseHWSWNew;
    },

    set canChooseHWSWNew(value: boolean) {
        canChooseHWSWNew = value;
    },

    get discordEventReaction(): boolean {
        return discordEventReaction;
    },

    set discordEventReaction(value: boolean) {
        discordEventReaction = value;
    }
};

export default canChoose;