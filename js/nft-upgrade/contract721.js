function DazContract721(address, cfg, proxyAddress = null) {
    address = dazethutil.toLower(address);
    this.config = cfg || {};
    this.address = address;
    this.proxyAddress = proxyAddress;
    const ct = this.config.contracts.list[address];
    this.name = ct.name;
    if (ct.types) {
        this.types = ct.types;
    } else {
        this.baseImageURI = ct.image;
        this.baseThumbURI = ct.thumb;
    }
    this.contract = new window.dazeth.web3.eth.Contract(window.dazContracts["ERC721Enumerable"], address);
}

DazContract721.prototype.getName = function (token) {
    if (this.types && this.types[token]) {
        return this.types[token].name;
    }
    return this.name;
}

DazContract721.prototype.getImageURL = function (token) {
    if (this.types && this.types[token]) {
        return this.types[token].image;
    }
    return this.baseImageURI + token;
}

DazContract721.prototype.getThumbURL = function (token) {
    if (this.types && this.types[token]) {
        return this.types[token].thumb;
    }
    return this.baseThumbURI + token;
}

DazContract721.prototype.getMetadataURL = async function (token) {
    return this.contract.methods.tokenURI(token).call();
}

DazContract721.prototype.balanceOf = async function (address) {
    return this.contract.methods.balanceOf(address).call();
}

DazContract721.prototype.tokenOfOwnerByIndex = async function (address, index) {
    return this.contract.methods.tokenOfOwnerByIndex(address, index).call();
}

DazContract721.prototype.getMyTokenIDs = async function (address) {
    let tokens = [];
    let count = await this.balanceOf(address);
    if (count === 0) {
        return tokens;
    }
    for (let x = 0; x < count; x++) {
        tokens.push(await this.tokenOfOwnerByIndex(address, x));
    }
    return tokens;
}
