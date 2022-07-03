function DazProxy721(address, cfg, proxyContract = null) {
    address = dazethutil.toLower(address);
    this.address = address;
    if (proxyContract === null) {
        proxyContract = cfg.proxies.contractName;
    }
    this.name = cfg.proxies.list[address].name;
    this.contracts = [];
    this.effect = {};
    this.types = cfg.proxies.list[address].types;
    this.tokenTypeMap = cfg.proxies.list[address].tokenTypes;
    this.config = cfg || {};
    this.allowedTypes = {};
    this.eth = window.dazeth;
    if (!this.eth.IsConnected()) {
        console.error('Ethereum network not detected, cannot initialize aggregator');
        return false;
    }
    if (!window.dazContracts[proxyContract]) {
        window.dazeth.Error(['no-contract', proxyContract, address])
        return false;
    }
    this.contract = new this.eth.web3.eth.Contract(window.dazContracts[proxyContract], address);
}

DazProxy721.prototype.Init = async function () {
    this.contracts = await this.getAllowedContracts();
    this.effect = new DazContract721(await this.contract.methods.effect().call(), this.config, this.address);
    for (let i in this.contracts) {
        await this.loadTypes(this.contracts[i]);
    }
}

DazProxy721.prototype.getMyUpgrades = async function(address) {
    let count = await this.effect.balanceOf(address);
    if (count === 0) {
        return {};
    }
    let upgrades = {};
    for (let x = 0; x < count; x++) {
        let token = await this.effect.tokenOfOwnerByIndex(address, x);
        let tt = await this.typeOfToken(token);
        if (!upgrades.hasOwnProperty(tt)) {
            upgrades[tt] = { qty: 1, type: parseInt(tt, 10), tokens: [token]};
        } else {
            upgrades[tt].qty++;
            upgrades[tt].tokens.push(token);
        }
    }
    return upgrades;
}

DazProxy721.prototype.loadTypes = async function (address) {
    this.allowedTypes[address] = {};
    for (let i = 0; i < this.types[address].length; i++) {
        let tt = this.types[address][i];
        this.allowedTypes[address][tt] = await this.isTypeAllowed(address, tt);
    }
}

DazProxy721.prototype.isTypeAllowed = async function (address, tokenType) {
    return await this.contract.methods.allowedTypes(address, tokenType).call();
}

DazProxy721.prototype.typeOfToken = async function (token) {
    return this.tokenTypeMap[token-1];
}

DazProxy721.prototype.tokenTypes = async function (address) {
    return this.types[address];
}

DazProxy721.prototype.getAllowedContracts = async function () {
    return dazethutil.toLower(await this.contract.methods.getAllowedContracts().call());
}

DazProxy721.prototype.upgradedTokenList = function (address, token) {
    return this.contract.methods.upgradedTokenList(address, token).call();
}

DazProxy721.prototype.canUpgrade = async function (address, token, tokenType = false) {
    if (tokenType) {
        if (!this.allowedTypes[address][tokenType]) {
            return false;
        }
        return this.contract.methods['canUpgrade(uint256,address,uint256)'](tokenType, address, token).call();
    } else {
        return this.contract.methods.canUpgrade(address, token).call();
    }
}

DazProxy721.prototype.canUpgradeWithToken = async function (address, token, withToken) {
    return this.contract.methods['canUpgrade(address,uint256,uint256)'](address, token, withToken).call();
}

DazProxy721.prototype.upgrade = function (upgradeToken, address, index, data = "") {
    data = web3.utils.asciiToHex(data);
    return this.contract.methods.upgrade(upgradeToken, address, index, data).send({from: this.eth.selectedAccount});
}
