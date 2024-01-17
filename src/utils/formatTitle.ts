function formatTitle(value: string) {
    let firstName = value.split(" ")[0];
    firstName = firstName.toLowerCase().replace("'s", "");
    return `@${firstName}'s`;
}

export default formatTitle;