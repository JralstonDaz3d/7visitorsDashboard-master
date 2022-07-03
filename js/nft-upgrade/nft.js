const nfpNullAddress = "0x0";
const nfpNullToken = "0";

NftUpgrade.Nft = function () {
    this.address = nfpNullAddress;
    this.token = nfpNullToken;
    if (arguments.length === 2 && arguments[0] !== undefined && arguments[1] !== undefined) {
        this.address = String(arguments[0]);
        this.token = String(arguments[1]);
    } else if (arguments.length === 1 && arguments[0].hasOwnProperty('address') && arguments[0].hasOwnProperty('token')) {
        this.address = String(arguments[0].address);
        this.token = String(arguments[0].token);
    }
}

NftUpgrade.Nft.prototype.valueOf = function () {
    return `${this.address}:${this.token}`;
}

NftUpgrade.Nft.prototype.equals = function (nft2) {
    if (!nft2) {
        return false;
    }
    return this.valueOf() === nft2.valueOf();
}

NftUpgrade.Nft.prototype.isNull = function () {
    return this.valueOf() === NftUpgrade.nullNft.valueOf();
}

NftUpgrade.nullNft = new NftUpgrade.Nft();
Object.freeze(NftUpgrade.nullNft);
