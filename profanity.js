module.exports.checkProfanity = function(profanityArr, string) {
    let check = string.toLowerCase();
    check = check.replace('1', 'i');
    check = check.replace('3', 'e');
    check = check.replace('4', 'a');
    check = check.replace('5', 's');
    check = check.replace('6', 'b');
    check = check.replace('7', 't');
    check = check.replace('8', 'b');
    check = check.replace('0', 'o');
    check = check.replace('!', 'i');
    check = check.replace('@', 'a');
    check = check.replace('$', 's');
    let containsProfanity = false;
    profanityArr.forEach(word => {
        if (check.indexOf(word) >= 0) containsProfanity = true;
    });
    return containsProfanity;
}
