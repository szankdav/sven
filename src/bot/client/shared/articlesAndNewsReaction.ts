let articleReaction = true;
let newsReaction = false;
let discordEventReaction = false;

const reactionSwitch = {
    get articleReaction(): boolean {
        return articleReaction;
    },

    set articleReaction(value: boolean) {
        articleReaction = value;
    },

    get newsReaction(): boolean {
        return newsReaction;
    },

    set newsReaction(value: boolean) {
        newsReaction = value;
    },

    get discordEventReaction(): boolean {
        return discordEventReaction;
    },

    set discordEventReaction(value: boolean) {
        discordEventReaction = value;
    }
};

export default reactionSwitch;