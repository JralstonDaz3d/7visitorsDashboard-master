function DazEth(network, config) {
    this.network = network;
    this.chainId = null;
    this.ethEnabled = false;
    this.readOnly = false;
    this.selectedAccount = null;
    this.accounts = [];
    this.contract = null;
    this.owners = {};
    this.initEvents = false;
    this.provider = null;
    this.config = config ? config : {};
}

DazEth.prototype.IsConnected = async function () {
    let provider = null;
    if (this.provider) {
        provider = this.provider;
    } else if (window.ethereum) {
        provider = window.ethereum;
    } else if (WalletConnectProvider && this.config.walletConnect) {
        let cfg = Object.assign({}, this.config.walletConnect);
        cfg.qrcode = false;
        const wc = new WalletConnectProvider.default(
            cfg
        );
        try {
            wc.connector.on("display_uri", () => {
                throw 'not connected';
            });
            await wc.enable();
        } catch {
            return false;
        }
        provider = wc;
    }
    if (!provider) {
        return false;
    }
    let w3 = new Web3(provider);
    return (await w3.eth.getAccounts()).length > 0;
};


DazEth.prototype.Init = function() {
    if (window.ethereum) {
        this.InitBrowser();
    } else if (WalletConnectProvider && this.config.walletConnect) {
        this.InitWalletConnect();
    } else {
        this.Error(["no-wallet", null]);
    }
};

DazEth.prototype.InitBrowser = function() {
    if (window.ethereum) {
        this.provider = window.ethereum;
        this.__init();
    } else {
        this.Error(["no-wallet", null]);
    }
};

DazEth.prototype.InitWalletConnect = function() {
    if (WalletConnectProvider || !this.config.walletConnect) {
        const wc = new WalletConnectProvider.default(
            this.config.walletConnect
        );
        wc.enable().then((res) => {
            this.provider = wc;
            this.__init();
        }, (e) => {
            this.Error(["no-wallet", null]);
        }).catch(e => {
            this.Error(["no-wallet", null]);
        });
    } else {
        this.Error(["no-wallet", null]);
    }
}

DazEth.prototype.__init = function () {
    if (!this.provider) {
        this.Error(["no-wallet", null]);
        return;
    }
    this.provider.request({method: 'eth_requestAccounts'}).catch( (e) => {
        this.Error(["no-account", null]);
        return null;
    }).then((accounts) => {
        if (!accounts || accounts.length === 0) {
            this.Error(["no-account", null]);
        }
        if (!this.Enable()) {
            return;
        }
        if (!this.initEvents) {
            this.provider.on('accountsChanged',  (accounts) => {
                console.info('accountsChanged event fired');
                window.dazeth.selectedAccount = accounts[0];
                $(document).trigger('dazEthInit');
            });
            // If the network changes refresh the page...  Because that's what Metamask says to do.
            this.provider.on('chainChanged',  (chainId) => {
                console.info('chainChanged event fired', this.chainId, chainId);
                if (chainId != this.GetInitializedChainID()) {
                    this.Error(["wrong-network", this.chainId, [1, 4, 1337]]);
                    this.chainId = chainId;
                    return;
                }
                if (this.chainId !== null && this.chainId !== chainId) {
                    this.Error(["chain-changed", this.chainId, [1, 4, 1337]]);
                }
                this.chainId = chainId;
            });
            this.initEvents = true;
        }
    });
}

DazEth.prototype.SetContract = function (name, address) {
    if (!window.dazContracts[name]) {
        this.Error(['no-contract', name, address])
        return false;
    }
    this.contract = new this.web3.eth.Contract(window.dazContracts[name], address);
    return true;
}

DazEth.prototype.ChangeToChain = async function() {
    return this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
            { chainId: this.GetInitializedChainID() }
        ],
    });
}

DazEth.prototype.GetInitializedChainID = function() {
    let chainId = "0x1";
    switch (this.network) {
        case 'Internal':
            chainId = "0x539"
            break;
        case 'Rinkeby':
            chainId = "0x4";
            break;
        case 'MainNet':
            chainId = '0x1';
            break;
        default:
            throw('unknown network to change to ' + this.network);
    }
    return chainId;
}

DazEth.prototype.Error = function (data) {
    $(document).trigger('dazEthError', data);
}

DazEth.prototype.Enable = async function () {
    if (this.ethEnabled) {
        return true;
    }
    if (this.provider) {
        this.web3 = new Web3(this.provider);
        window.web3 = this.web3;
        const chainId = await this.web3.eth.getChainId();
        this.chainId = '0x' + parseInt(chainId, 10).toString(16);
        if (this.chainId !== "0x539" && this.chainId !== "0x4" && this.chainId !== "0x1") {
            console.error('Wrong network selected');
            this.Error(["wrong-network", this.chainId, [1, 4, 1337]]);
            this.ethEnabled = false;
            return;
        }
        if (this.chainId === "0x539" && this.network !== "Internal") { // Internal
            console.error('Internal enabled, but browser is not configured for the network');
            this.Error(["wrong-network", this.chainId, [1337]]);
            this.ethEnabled = false;
            return;
        }
        if (this.chainId === "0x4" && this.network !== "Rinkeby") { // TestNet
            console.error('Rinkeby enabled, but browser is not configured for the network');
            this.Error(["wrong-network", this.chainId, [4]]);
            this.ethEnabled = false;
            return;
        }
        if (this.chainId === "0x1" && this.network !== "MainNet") { // MainNet
            console.error('MainNet enabled, but browser is not configured for the network');
            this.Error(["wrong-network", this.chainId, [1]]);
            this.ethEnabled = false;
            return;
        }

        let account = await this.provider.request({method: 'eth_accounts'});
        if (account && account.length > 0) {
            this.selectedAccount = account[0];
            this.accounts = account;
        } else {
            this.Error(["no-account", null]);
            return false;
        }
        this.ethEnabled = true;
    } else {
        this.Error(["wrong-network", version, [1, 4, 1337]]);
        this.ethEnabled = false;
    }
    if (this.ethEnabled) {
        setTimeout(function () {
            $(document).trigger('dazEthInit');
        }, 50);
    }
    return this.ethEnabled;
}
