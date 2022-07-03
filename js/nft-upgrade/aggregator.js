function DazAggregator(address, aggregatorContract) {
    address = dazethutil.toLower(address);
    this.address = address;
    this.eth = window.dazeth;
    if (!this.eth.IsConnected()) {
        console.error('Ethereum network not detected, cannot initialize aggregator');
        return false;
    }
    if (!window.dazContracts[aggregatorContract]) {
        window.dazeth.Error(['no-contract', aggregatorContract, address])
        return false;
    }
    this.contract = new this.eth.web3.eth.Contract(window.dazContracts[aggregatorContract], address);
}

DazAggregator.prototype.getEnabledProxies = async function () {
    return dazethutil.toLower(await this.contract.methods.getEnabledProxies().call({from: dazethutil.me()}));
}

DazAggregator.prototype.listUpgradeInventory = async function () {
    return dazethutil.toLower(await this.contract.methods.listUpgradeInventory().call({from: dazethutil.me()}));
}

DazAggregator.prototype.listUpgradeables = async function () {
    return dazethutil.toLower(await this.contract.methods.listUpgradeInventory().call({from: dazethutil.me()}));
}

DazAggregator.prototype.listEquippedUpgrades = async function (address, token) {
    return dazethutil.toLower(await this.contract.methods.listEquippedUpgrades(address, token).call({from: dazethutil.me()}));
}
