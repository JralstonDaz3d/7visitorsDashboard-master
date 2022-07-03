function NftUpgrade(cfg) {
    this.eth = window.dazeth;
    this.tokens = {};
    this.proxies = {};
    this.contracts = {};
    this.aggregator = null;
    this.myUpgrades = {};
    this.myTypes = {};
    this.effects = {};
    this.canUpgradeCache = {};
    this.config = cfg || {};
}

NftUpgrade.prototype.Init = async function () {
    if (!this.eth.IsConnected()) {
        console.error('Ethereum network not detected, cannot initialize dashboard');
        throw ('Ethereum network not detected, cannot initialize dashboard');
    }
    if (!this.config.aggregator.enabled || !this.config.aggregator.address) {
        console.warn('Aggregator not enabled');
        return;
    }
    this.aggregator = new DazAggregator(this.config.aggregator.address, this.config.aggregator.contractName);
    if (!this.aggregator) {
        return false;
    }
    await this.initProxies();
}

NftUpgrade.prototype.addContract = function (addr, ofType) {
    this.contracts[addr] = new ofType(addr, this.config);
}

NftUpgrade.prototype.tokenIsLoaded = function (nft) {
    if (!this.tokens.hasOwnProperty(nft.address)) {
        return false;
    }
    return this.tokens[nft.address].indexOf(nft.token) === -1;
}

NftUpgrade.prototype.initProxies = async function () {
    const proxies = dazethutil.toLower(await this.aggregator.getEnabledProxies());
    let contracts = {};
    for (let i in proxies) {
        const cfgProxy = this.config.proxies.list[proxies[i]];
        let proxy = null;
        if (cfgProxy.type === 721) {
            proxy = new DazProxy721( proxies[i], this.config, cfgProxy.contractName);
        } else {
            proxy = new DazProxy1155( proxies[i], this.config, cfgProxy.contractName);
        }
        await proxy.Init();
        let pc = proxy.contracts;
        for (let pci in pc) {
            let addr = dazethutil.toLower(pc[pci]);
            if (this.contracts.hasOwnProperty(addr)) {
                continue;
            }
            this.addContract(addr, DazContract721);
        }
        this.effects[proxy.effect.address] = proxy.effect;
        this.proxies[proxies[i]] = proxy;
    }
}

NftUpgrade.prototype.reset = function () {
    this.tokens = {};
    this.myUpgrades = {};
}

NftUpgrade.prototype.loadMyUpgradables = async function () {
    if (this.contracts.length === 0) {
        return [];
    }
    let me = dazethutil.me();
    for (let i in this.contracts) {
        let count = await this.contracts[i].balanceOf(me);
        if (count === 0) {
            continue;
        }
        for (let x = 0; x < count; x++) {
            let token = await this.contracts[i].tokenOfOwnerByIndex(me, x);
            if (!this.tokens.hasOwnProperty(this.contracts[i].address)) {
                this.tokens[this.contracts[i].address] = [];
            }
            this.tokens[this.contracts[i].address].push(token);
        }
    }
    return this.tokens;
}

NftUpgrade.prototype.loadMyUpgrades = async function () {
    if (!this.aggregator) {
        return {};
    }
    let me = dazethutil.me();
    const upgrades = await this.aggregator.listUpgradeInventory();
    for (let i in upgrades) {
        const prox = this.proxies[upgrades[i]];
        let upg = await prox.getMyUpgrades(me);
        if (!this.myTypes[prox.effect.address]) {
            this.myTypes[prox.effect.address] = {};
        }
        this.myUpgrades[this.proxies[upgrades[i]].effect.address] = upg;
    }
    return this.myUpgrades;
}

NftUpgrade.prototype.listNfpUpgrades = async function (address, token) {
    if (!this.aggregator) {
        return {};
    }
    let promises = [];
    let result = {};
    const upgrades = await this.aggregator.listEquippedUpgrades(address, token);
    for (let i in upgrades) {
        let p = this.proxies[upgrades[i]].upgradedTokenList(address, token).then((list) => {
            result[upgrades[i]] = list;
        }, e => {
            console.error(e);
            throw e;
        });
        promises.push(p);
    }
    return Promise.all(promises).then(() => {
        return result;
    }, e => {
        console.error(e);
        throw (e);
    });
}

NftUpgrade.prototype.proxyForEffect = function (address) {
    for (let i in this.proxies) {
        if (this.proxies[i].effect.address !== address) {
            continue;
        }
        return this.proxies[i];
    }
    console.error('Invalid proxy address ' + address);
    return null;
}

NftUpgrade.prototype.canUpgradeByType = async function (effectAddress, address, token) {
    const proxy = this.proxyForEffect(effectAddress);
    // need to find type
    let can = await proxy.canUpgrade(address, token);
    return can;
}

NftUpgrade.prototype.cacheUpgrade = function (address, token, effectAddress, effect, can) {
    let key = `${address}_${token}_${effectAddress}`;
    if (!this.cacheUpgrade.hasOwnProperty(key)) {
        this.cacheUpgrade[key] = {};
    }
    this.cacheUpgrade[key][effect] = can;
}

NftUpgrade.prototype.getCache = function (address, token, effectAddress) {
    let key = `${address}_${token}_${effectAddress}`;
    if (!this.cacheUpgrade.hasOwnProperty(key)) {
        return {};
    }
    return this.cacheUpgrade[key];
}

NftUpgrade.prototype.canUpgradeWithToken = async function (effectAddress, effectTokens, address, token) {
    const proxy = this.proxyForEffect(effectAddress);
    let can = this.getCache(address, token, effectAddress);
    let promises = [];
    for (let t in effectTokens) {
        if (can.hasOwnProperty(effectTokens[t].toString())) {
            continue;
        }
        let p = proxy.canUpgradeWithToken(address, token, effectTokens[t]).then(canToken => {
            can[effectTokens[t].toString()] = canToken;
            this.cacheUpgrade(address, token, effectAddress, effectTokens[t].toString(), canToken);
            return canToken;
        }, e => {
            console.error(e);
            throw e;
        })
        promises.push(p);
    }
    return Promise.all(promises).then(() => {
        return can;
    }, e => {
        console.error(e);
        throw (e);
    });
}

