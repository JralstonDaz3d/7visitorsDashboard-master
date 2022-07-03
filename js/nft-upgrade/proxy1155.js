function DazProxy1155(address, cfg, proxyContract = null) {
    address = dazethutil.toLower(address);
    this.address = address;
    if (proxyContract === null) {
        proxyContract = cfg.proxies.contractName;
    }
    this.name = cfg.proxies.list[address].name;
    this.contracts = [];
    this.effect = {};
    this.types = cfg.proxies.list[address].types;
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

DazProxy1155.prototype.Init = async function () {
    this.contracts = await this.getAllowedContracts();
    this.effect = new DazContract1155(await this.contract.methods.effect().call(), this.config, this.address);
    for (let i in this.contracts) {
        await this.loadTypes(this.contracts[i]);
    }
}

DazProxy1155.prototype.getMyUpgrades = async function (address) {
    let upgrades = {};

    let types = [];
    for (let addr in this.types) {
        for (let i in this.types[addr]) {
            let tt = this.types[addr][i];
            if (!this.allowedTypes[addr][tt]) {
                continue;
            }
            if (types.indexOf(tt) === -1) {
                types.push(tt);
            }
        }
    }

    for (let i in types) {
        let tt = types[i];
        let qty = await this.effect.balanceOf(address, tt);
        upgrades[tt] = { qty: parseInt(qty, 10), type: tt};
    }

    return upgrades;
}

DazProxy1155.prototype.loadTypes = async function (address) {
    this.allowedTypes[address] = {};
    for (let i = 0; i < this.types[address].length; i++) {
        let tt = this.types[address][i];
        this.allowedTypes[address][tt] = await this.isTypeAllowed(address, tt);
    }
}

DazProxy1155.prototype.isTypeAllowed = async function (address, tokenType) {
    return await this.contract.methods.allowedTypes(address, tokenType).call();
}

DazProxy1155.prototype.typeOfToken = async function (token) {
    return token;
}

DazProxy1155.prototype.tokenTypes = async function (address) {
    return this.types[address];
}

DazProxy1155.prototype.getAllowedContracts = async function () {
    return dazethutil.toLower(await this.contract.methods.getAllowedContracts().call());
}

DazProxy1155.prototype.upgradedTokenList = function (address, token) {
    return this.contract.methods.upgradedTokenList(address, token).call();
}

DazProxy1155.prototype.canUpgrade = async function (address, token, tokenType = false) {
    if (tokenType) {
        if (!this.allowedTypes[address][tokenType]) {
            return false;
        }
        return this.contract.methods['canUpgrade(address,uint256,uint256)'](address, token, tokenType).call();
    } else {
        return this.contract.methods.canUpgrade(address, token).call();
    }
}

DazProxy1155.prototype.canUpgradeWithToken = async function (address, token, withToken) {
    return this.contract.methods.canUpgradeWithToken(address, token, withToken).call();
}

DazProxy1155.prototype.upgrade = function (upgradeToken, address, index, data = "") {
    data = web3.utils.asciiToHex(data);
    return this.contract.methods.upgrade(upgradeToken, address, index, data).send({from: this.eth.selectedAccount});
}
