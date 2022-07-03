function NfpUpgradeModule(ui, enabled) {
    this.myUpgrades = {};
    this.selectedUpgrade = NftUpgrade.nullNft;
    this.selectedToken = NftUpgrade.nullNft;
    this.selectedType = null;
    this.enabled = enabled;
    this.loaded = false;
    this.ui = ui;
    this.blocked = false;
    this.blockedNfps = [1,7,16,30,37,42,85,575,1408,1583,2935,4512,5743,6195,7596,8453];

    this.name = "upgrade";
    this.label = "Upgrade";
    this.icon = `<svg width="25" height="55" viewBox="0 0 25 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.0677 46.7369H6.93225C6.48857 46.7361 6.06328 46.5518 5.74955 46.2245C5.43582 45.8971 5.25922 45.4533 5.25843 44.9904V40.6745C5.25922 40.2116 5.43582 39.7678 5.74955 39.4405C6.06328 39.1131 6.48857 38.9288 6.93225 38.928H18.0677C18.5116 38.9284 18.9373 39.1125 19.2514 39.4399C19.5654 39.7673 19.7422 40.2113 19.743 40.6745V44.9904C19.7422 45.4536 19.5654 45.8976 19.2514 46.225C18.9373 46.5524 18.5116 46.7365 18.0677 46.7369ZM7.64322 44.2485H17.3582V41.4164H7.64322V44.2485Z"></path>
                    <path d="M16.7501 55H8.25431C7.84727 54.9996 7.45702 54.8307 7.16919 54.5303C6.88137 54.23 6.71949 53.8228 6.7191 53.3981V50.0185C6.71949 49.5938 6.88137 49.1866 7.16919 48.8862C7.45702 48.5859 7.84727 48.417 8.25431 48.4166H16.7501C17.1572 48.417 17.5474 48.5859 17.8352 48.8862C18.123 49.1866 18.2849 49.5938 18.2853 50.0185V53.3981C18.2849 53.8228 18.123 54.23 17.8352 54.5303C17.5474 54.8307 17.1572 54.9996 16.7501 55ZM9.10091 52.5116H15.9005V50.905H9.10091V52.5116Z"></path>
                    <path d="M17.9172 37.1892H7.08432C6.60097 37.1888 6.13746 36.9886 5.79526 36.6324C5.45306 36.2762 5.26005 35.793 5.25847 35.2887V23.237H2.34008C1.92955 23.2395 1.52581 23.1278 1.17034 22.9135C0.814865 22.6992 0.520498 22.39 0.317488 22.0177C0.109684 21.6482 0.00012207 21.2276 0.00012207 20.7992C0.00012207 20.3708 0.109684 19.9501 0.317488 19.5806L10.4767 1.21775C10.6804 0.8458 10.9751 0.537026 11.3308 0.323047C11.6864 0.109069 12.0902 -0.00242427 12.5008 -1.60026e-05C12.9111 -0.00263219 13.3148 0.108787 13.6702 0.322801C14.0257 0.536814 14.3202 0.845706 14.5234 1.21775L24.684 19.5806C24.8912 19.9503 25.0004 20.3709 25.0004 20.7992C25.0004 21.2274 24.8912 21.648 24.684 22.0177C24.4805 22.391 24.1852 22.7008 23.8286 22.9151C23.472 23.1295 23.067 23.2406 22.6555 23.237H19.7386V35.2887C19.737 35.7922 19.5446 36.2747 19.2034 36.6307C18.8621 36.9868 18.3998 37.1876 17.9172 37.1892ZM7.64325 34.7008H17.3583V20.7486H22.575L12.4993 2.53816L2.42355 20.7486H7.64027L7.64325 34.7008Z"></path>
                 </svg>`;
    this.panel = `
                <h4 class="text-center fw-lighter my-3 panel-head">Upgrade</h4>
                <div class="purple-box p-3 panel-desc">
                    Select your upgrade. This process is irreversible and will burn the upgrade token. Gas fees apply.
                </div>
                <div class="flex-grow-1 py-3 panel-items">
                <ul id="upgradeInv" class="p-0"></ul>
                </div>
                
                <div class="download-all p-3 text-center position-relative panel-footer">
                <div class="fade-grad"></div>
                    <button id="submitUpgrade" class="submit border-0 m-auto" disabled>Apply Upgrade</button>
                </div>
    `;
}

NfpUpgradeModule.prototype.Init = async function () {
    this.initListeners();
}

NfpUpgradeModule.prototype.IsNftBlocked = function (nft) {
    return this.blockedNfps.indexOf(parseInt(nft.token, 10)) !== -1;
}

NfpUpgradeModule.prototype.Display = async function (nft) {
    if (!this.enabled || this.IsNftBlocked(nft)) {
        return;
    }
    this.selectedUpgrade = NftUpgrade.nullNft;
    this.selectedType = null;
    await this.loadUpgrades();
    this.selectedToken = nft;
    await this.disableUpgrades();
}

NfpUpgradeModule.prototype.loadUpgrades = async function () {
    if (this.loaded) {
        return;
    }
    this.myUpgrades = await this.ui.upgrade.loadMyUpgrades();

    upgradeInv.innerHTML = "";
    for (let effect in this.myUpgrades) {
        for (let uptoken in this.myUpgrades[effect]) {
            let qty = this.myUpgrades[effect][uptoken].qty;
            if (qty <= 0) {
                continue;
            }
            this.addUpgrade(effect, uptoken);
        }
    }

    this.loaded = true;
}

NfpUpgradeModule.prototype.disableUpgrades = function () {
    for (let effect in this.myUpgrades) {
        const proxy = this.ui.upgrade.proxyForEffect(effect);
        for (let uptoken in this.myUpgrades[effect]) {
            if (this.myUpgrades[effect][uptoken].qty === 0) {
                continue;
            }
            proxy.canUpgrade(this.selectedToken.address, this.selectedToken.token, uptoken).then((can) => {
                const a = document.querySelector(`.upgrade-item[data-effect="${effect}"][data-type="${uptoken}"]`);
                if (!a) {
                    return;
                }
                a.classList.toggle('disabled', !can);
                this.myUpgrades[effect][uptoken].disabled = !can;
            }, (e) => {
                console.error(e);
            })
        }
    }
}

NfpUpgradeModule.prototype.Load = async function () {
    return this.loadMyUpgrades().then((tokens) => {
        let count = 0;
        for (let address in tokens) {
            for (let index in tokens[address]) {
                this.addUpgrade(address, tokens[address][index]);
                count++;
            }
        }
        if (count > 0) {
            $dashboard.addClass('with-upgrades');
            $uc.show();
        } else {
            $dashboard.removeClass('with-upgrades');
            $uc.hide();
        }
    }, err => {
        console.error(err);
    });
}

NfpUpgradeModule.prototype.Reset = function () {
    this.selectedUpgrade = NftUpgrade.nullNft;
    this.selectedType = null;
    this.loaded = false;
    this.myUpgrades = {};
}

NfpUpgradeModule.prototype.selectUpgrade = function (e = null) {
    if (!e) {
        return;
    }
    let target = e.target;
    while (target.tagName !== 'A') {
        target = target.parentNode;
        if (target === null) {
            return;
        }
    }
    const address = target.getAttribute('data-effect');
    const tt = target.getAttribute('data-type');
    const proxy = this.ui.upgrade.proxyForEffect(address);
    const url = proxy.effect.getImageURL(tt);
    const upg = this.myUpgrades[address][tt];
    if (upg.disabled) {
        return;
    }
    const nfpName = "";
    const upgradeName = proxy.effect.getName(tt);
    let token = upg.type;
    if (upg.hasOwnProperty("tokens")) {
        token = upg.tokens[upg.tokens.length - 1];
    }
    this.selectedType = tt;
    this.selectedUpgrade = new NftUpgrade.Nft(address, token);
    submitUpgrade.disabled = false;
    const targetLi = target.parentNode;
    Array.prototype.filter.call(targetLi.parentNode.children, (child) =>
        child.classList.remove('selected')
    );
    targetLi.classList.add('selected');
    this.ui.panel.reset()
        .setSelectedImage(url)
        .addTitle(`Upgrade ${nfpName} with ${upgradeName}`)
        .addText('Level up your NFP with a permanent enhancement. This will alter its appearance and traits on OpenSea.')
        .render();
}

NfpUpgradeModule.prototype.addUpgrade = function (address, tokenType) {
    const proxy = this.ui.upgrade.proxyForEffect(address);
    const qty = this.myUpgrades[address][tokenType].qty;
    const name = proxy.effect.getName(tokenType);
    const img = proxy.effect.getImageURL(tokenType);
    const a = document.createElement("a");
    a.classList.add('d-flex', 'align-items-center', 'px-3', 'py-1', 'text-decoration-none', 'text-start', 'upgrade-item');
    a.href = "javascript:"
    a.setAttribute("data-effect", address);
    a.setAttribute("data-type", tokenType);
    a.addEventListener("click", (e) => this.selectUpgrade(e));
    a.innerHTML = `<img class="rounded-circle upgrade-image me-2" src="${img}"><p class="m-0"><span class="upgrade-name">${name}</span><br><span class="owned-qty"><small>x${qty}</small></span></p>`;
    const li = document.createElement("li");
    li.append(a);
    upgradeInv.append(li);
}

NfpUpgradeModule.prototype.upgradeConfirm = function () {
    const title = "Are you sure?";
    const message = "This upgrade is irreversible and your upgrade token will be burned. Gas fees apply. The upgrade process can take a few weeks. Please confirm to continue."
    this.ui.modal.View(title, message, [{
        text: "Let's Do It!",
        callback: () => { this.upgrade(); return true; }
    }, {
        text: "Cancel"
    }]);
}

NfpUpgradeModule.prototype.initListeners = function () {
    submitUpgrade.addEventListener("click", () => this.upgradeConfirm())
}

NfpUpgradeModule.prototype.upgrade = function () {
    if (this.selectedUpgrade.isNull()) {
        return;
    }
    const proxy = this.ui.upgrade.proxyForEffect(this.selectedUpgrade.address);
    let trxHash = null;
    return proxy.upgrade(this.selectedUpgrade.token, this.selectedToken.address, this.selectedToken.token, "").on('transactionHash', (hash) => {
        trxHash = hash;
        this.ui.modal.Transaction(hash);
    }).then(async (trx) => {
            this.Reset();
            await this.loadUpgrades();
            await this.disableUpgrades();
            this.ui.panel.reset(true);
            const title = "Transaction Completed";
            const message = `Your upgrade transaction is complete! Please allow a few weeks for your upgrade to be processed.`;
            this.ui.modal.View(title, message, [{
                text: 'View Transaction on Etherscan',
                callback: () => {
                    window.open(`https://etherscan.io/tx/${trxHash}`)
                    return false;
                }
            }, {
                text: 'Close'
            }], false);
        },
        (e) => {
            this.ui.modal.Error('Upgrade Canceled', 'An error occurred or you rejected the upgrade transaction. The upgrade to your NFP has not been applied.');
                console.error(e);
        }
    ).catch(function (err) {
        console.error(err);
    });
}
