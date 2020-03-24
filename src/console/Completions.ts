type Completions = {
    readonly name: string;
    readonly items: {
        readonly caption?: string;
        readonly content?: string;
        readonly url?: string;
        readonly icon?: string;
    }[];
}[]

export default Completions;