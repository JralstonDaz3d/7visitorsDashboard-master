function DazContract1155(address, cfg, proxyAddress = null) {
    address = dazethutil.toLower(address);
    this.config = cfg || {};
    this.address = address;
    this.proxyAddress = proxyAddress;
    const ct = this.config.contracts.list[address];
    this.names = ct.name;
    this.tokens = ct.tokens;
    this.contract = new window.dazeth.web3.eth.Contract(window.dazContracts["ERC1155Supply"], address);
}

DazContract1155.prototype.getName = function (token) {
    return this.tokens[token].name;
}

DazContract1155.prototype.getImageURL = function (token) {
    return this.tokens[token].image;
}

DazContract1155.prototype.getThumbURL = function (token) {
    return this.tokens[token].thumb;
}

DazContract1155.prototype.getMetadataURL = async function (token) {
    return this.contract.methods.tokenURI(token).call();
}

DazContract1155.prototype.balanceOf = async function (address, token) {
    return this.contract.methods.balanceOf(address, token).call();
}
