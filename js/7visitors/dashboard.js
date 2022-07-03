const emptyHero = "https://cdn.daz3d.com/file/dazcdn/media/nfp/dash-update/empty.svg";

function NfpDashboardUI(cfg) {
    this.upgrade = null;
    this.storage = null;
    this.config = cfg || {};
    this.modules = [];
   // this.selectedToken = NftUpgrade.nullNft;
    this.modal = new NfpModal();
    this.cachedStatus = {};
    this.cachedMeta = {};
    this.selectedMeta = {};
    this.notifications = [];
}

// V2
NfpDashboardUI.prototype.Init = function () {
    if (this.upgrade) {
        console.error('already initialized');
        return;
    }
    this.modal.Processing('', 'Initializing...');
    this.storage = window.localStorage;

    this.config.tokenNames = {};
    this.config.proxyNames = {};
    this.config.tokenImageUri = {};
    this.config.tokenThumbUri = {};
    this.config.initTokens = [];
    this.panel = new NfpDashboardUI.ActionPanel(this);
    this.panel.Init();

    for (let addr in this.config.proxies.list) {
        const p = this.config.proxies.list[addr];
        nfpConfig.proxyNames[addr] = p.name;
        if (p.image) {
            nfpConfig.tokenImageUri[addr] = p.image;
        }
    }
    for (let addr in this.config.contracts.list) {
        const c = this.config.contracts.list[addr];
        nfpConfig.tokenNames[addr] = c.name;
        if (c.image) {
            nfpConfig.tokenImageUri[addr] = c.image;
        }
        if (c.thumb) {
            nfpConfig.tokenThumbUri[addr] = c.thumb;
        }
        if (c.init) {
            nfpConfig.initTokens.push(addr);
        }
    }

    for (let i in this.config.modules) {
        const mod = this.config.modules[i].module;
        this.addModule(new mod(this, this.config.modules[i].enabled))
    }

    this.upgrade = new NftUpgrade(this.config);
    this.reset();

    this.upgrade.Init().then(() => {
        for (let i in this.config.initTokens) {
            this.upgrade.addContract(this.config.initTokens[i], DazContract721);
        }

        this.loadTokens();
    }, e => {
        console.error("Unable to initialize dashboard");
        throw (e);
    });
    this.initListeners();
}

NfpDashboardUI.prototype.loadTokens = function () {
    this.upgrade.loadMyUpgradables().then((tokens) => {
        const wallet = dazethutil.me();
        let firstToken = null;
        let hasToken = false;
        for (let addr in this.config.contracts.list) {
            if (tokens.hasOwnProperty(addr)) {
                hasToken = true;
                firstToken = new NftUpgrade.Nft(addr, tokens[addr][0]);
                break;
            }
        }
        if (!hasToken) {
            const title = 'No NFPs Found'
            const message = `We couldn't locate any NFPs in your wallet with the address ${wallet}.`;
            this.modal.Critical(title, message, [
                {
                    text: 'Connect a Different Wallet',
                    callback: () => {
                        dazeth.provider.request({
                            method: "wallet_requestPermissions",
                            params: [
                                {
                                    eth_accounts: {}
                                }
                            ]
                        });
                        return false;
                    }
                }
            ]);
            return;
        }
        const nftJ = this.storage.getItem(wallet + "_selected");
        let selected = firstToken;
        if (nftJ) {
            selected = JSON.parse(nftJ);
            if (!(tokens.hasOwnProperty(selected.address) && tokens[selected.address].indexOf(selected.token.toString()) !== -1)) {
                selected = firstToken;
            }
        }
        if (selected) {
            this.addToken(selected.address, tokens[selected.address][tokens[selected.address].indexOf(selected.token.toString())]);
            this.selectToken(selected.address, selected.token);
            document.querySelector(`a.nft[data-id="${selected.token}"][data-address="${selected.address}"]`).classList.add('selected');
        }
        for (let address in tokens) {
            for (let index in tokens[address]) {
                if (address === selected.address && tokens[address][index].toString() === selected.token.toString()) {
                    continue;
                }
                this.addToken(address, tokens[address][index]);
            }
        }

        this.modal.Close();
    }, err => {
        console.error(err);
    });
}

// V2
NfpDashboardUI.prototype.addToken = function (address, token) {
    const image = this.config.tokenThumbUri[address];
    const title = this.config.tokenNames[address] + " #" + token;
    const li = document.createElement("li");
    li.setAttribute("class", "nft-item nav-link d-inline-block my-3 text-uppercase text-center");
    li.innerHTML = `<a href="javascript:" data-id="${token}" data-address="${address}" data-img="${image}${token}" id="nfp${token}" class="d-inline-block position-relative nft">
    <img src="${image}${token}" class="img-fluid">
    <span class="position-absolute">${title}</span>
    </a>`;
    invList.appendChild(li);
}

// V2
NfpDashboardUI.prototype.addModule = function (module) {
    const li = document.createElement("li");
    const disabled = module.enabled ? '' : ' disabled ';
    li.setAttribute("class", `option-item nav-link d-inline-block text-uppercase text-center off-canvas ${disabled}`);
    li.innerHTML = `<a href="javascript:" class="nav-module text-decoration-none text-center d-flex" data-module="${module.name}">
                            <i class="mb-2">
                                ${module.icon}
                            </i>
                            ${module.label}
                        </a>`;
    document.querySelector('#dashOptions ul').appendChild(li);

    const pDiv = document.createElement("div");
    pDiv.innerHTML = `<div class="module-panel text-shadow position-absolute off-canvas height-inherit px-0 col-lg-4 py-5 d-flex" data-module="${module.name}">
            <div class="d-flex position-relative frosted-glass w-100 text-center flex-column">
                <a href="javascript:" class="position-absolute d-block p-3 close-panel">
                    <svg style="height:1rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230.02 288.06">
                        <polygon points="230.02 288.06 128.99 143.77 229.66 0 201.66 0 114.99 123.77 28.36 .06 .36 .06 100.99 143.77 0 288 28 288 114.99 163.76 202.02 288.06 230.02 288.06" fill="white"></polygon>
                    </svg>
                </a>
                ${module.panel}
            </div>
        </div>`
    document.querySelector('#module-panels').append(pDiv.children[0]);
    module.Init();
    this.modules[module.name] = module;
}

// V2
NfpDashboardUI.prototype.displayModule = function (module) {
    if (this.selectedToken.isNull() || !this.modules[module].enabled) {
        return;
    }

    this.panel.reset(true);
    this.currentModule = this.modules[module];
    this.loading(true);
    this.currentModule.Display(this.selectedToken).then(() => {
        this.loading(false);
        document.querySelectorAll(".module-panel").forEach((e) => {
            e.classList.toggle('off-canvas', e.getAttribute('data-module') !== module);
        });
    }, (e) => {
        this.loading(false);
        console.error(e);
    });
}

NfpDashboardUI.prototype.disableModules = function (force = false) {
    for (let module in this.modules) {
        let disable = force;
        if (!force) {
            if (!this.modules[module].enabled) {
                continue
            }
            if (this.currentModule && this.currentModule.name === this.modules[module].name) {
                this.hideModules();
            }
            disable = this.modules[module].IsNftBlocked(this.selectedToken);
        }
        document.querySelector(`.nav-module[data-module="${module}"]`).parentNode.classList.toggle('disabled', disable);
    }
}

NfpDashboardUI.prototype.hideModules = function () {
    document.querySelectorAll(".module-panel").forEach((e) => {
        e.classList.add('off-canvas');
    });
    this.currentModule = null;
    this.panel.reset(true);
}

NfpDashboardUI.prototype.fetchNotifications = function (upgrades) {
    const notes = [];

    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].Status !== "pending") {
            continue;
        }
        const old = this.config.tokenThumbUri[this.selectedToken.address] + this.selectedToken.token;
        notes.push({
            token: this.selectedToken.token,
            effect: upgrades[i].Address,
            change: upgrades[i].Name,
            newImg: upgrades[i].Data,
            oldImg: old
        });
    }

    this.notifications = notes;
    const icon = document.getElementById('notifIco');
    // if we have have data show the icon
    if (this.notifications.length) {
        icon.classList.remove('d-none');
        icon.querySelector('span').textContent = this.notifications.length.toString(10);
    } else {
        icon.classList.add('d-none');
        icon.querySelector('span').textContent = "";
    }
}

NfpDashboardUI.prototype.toggleModuleButtons = function (show) {
    document.querySelectorAll('#dashOptions ul li').forEach((e) => {
        e.classList.toggle('off-canvas', !show)
    });
}

NfpDashboardUI.prototype.getSigningMessage = function (tokens, wallet, nonce) {
    const msg = `Signing this message will allow you to access\ndownloads and submit updates to the NFPs on\nyour dashboard. It will not trigger a blockchain\ntransaction or cost any gas fees.\n\nYour NFP Collection: ${tokens}\n\nWallet: ${wallet}\n\nNonce: ${nonce}`;
    const hash = dazethutil.hash([msg]);
    return {
        text: msg,
        hash: hash
    }
}

NfpDashboardUI.prototype.getSignature = async function (address, allowSigning) {
    const tokens = await this.upgrade.contracts[address].getMyTokenIDs(dazethutil.me());
    const tokenStr = tokens.join(', ');
    const nonce = Date.now();
    let signatureData = await this.storage.getItem(dazethutil.me() + "_signatureData");
    let data = false;
    let msg = null;

    if (signatureData) {
        try {
            data = JSON.parse(signatureData);
            if (Math.floor((nonce - data.Nonce) / 1000) < 2592000) {
                msg = this.getSigningMessage(data.Tokens, dazethutil.me(), data.Nonce);
                if (data.SigHash && data.SigHash === msg.hash) {
                    return data
                }
            }
        } catch (e) {
            data = false;
        }
    }

    if (!allowSigning) {
        return false;
    }

    try {
        msg = this.getSigningMessage(tokenStr, dazethutil.me(), nonce);
        const sig = await dazeth.web3.eth.personal.sign(msg.text, dazethutil.me()).then(r => r, error => {
            console.error(error);
        });
        if (nonce && sig) {
            data = {};
            data.Signature = sig;
            data.SigHash = msg.hash;
            data.Tokens = tokenStr;
            data.Nonce = nonce;
        } else {
            throw "signature failed"
        }
    } catch (e) {
        this.modal.Error('Signing Canceled', 'You declined the signing request for the your collection, interaction with your collection has been cancelled.')
        return false;
    }
    if (data === false) {
        this.storage.removeItem(dazethutil.me() + "_signatureData");
    } else {
        this.storage.setItem(dazethutil.me() + "_signatureData", JSON.stringify(data));
    }
    return data;
}

NfpDashboardUI.prototype.reset = function () {
    this.upgrade.reset();
    this.selectedToken = NftUpgrade.nullNft;
    this.selectedMeta = {};
    this.hideModules();
    for (let i in this.modules) {
        this.modules[i].Reset();
    }
    this.selectToken();
}

NfpDashboardUI.prototype.selectToken = function (address, token, element = null) {
    let nft = new NftUpgrade.Nft(address, token);
    if (nft.isNull() || nft.equals(this.selectedToken)) {
        nft = NftUpgrade.nullNft;
    }
    if (this.upgrade.tokenIsLoaded(nft)) {
        alert('Invalid token selected');
        return;
    }
    this.selectedToken = nft;
    this.loading(true);
    this.displayHero();
    this.loadStatus(nft);
    this.loadMetadata(nft);
    this.hideModules();
    this.disableModules();
    this.addLinks();
    this.toggleModuleButtons(!nft.isNull());
    !nft.isNull() && this.storage.setItem(dazethutil.me() + "_selected", JSON.stringify(nft));
    document.dispatchEvent(new CustomEvent('nfp_selected', {detail: {nft: nft}}));
}

NfpDashboardUI.prototype.loadMetadata = async function (nft) {
    if (nft.isNull()) {
        return;
    }
    if (this.cachedMeta.hasOwnProperty(nft.valueOf())) {
        this.selectedMeta = this.cachedMeta[nft.valueOf()];
        this.displayHero();
        return this.selectedMeta;
    }

    fetch("https://nftcdn.daz3d.com/nfp/gen1/m/" + nft.token, {
        method: 'GET',
        mode: 'cors',
    }).then((response) => {
        return response.json()
    }).then(response => {
        this.cachedMeta[nft.valueOf()] = response;
        this.selectedMeta = response;
        this.displayHero();
    }).catch(e => {
        delete this.cachedMeta[nft.valueOf()];
        console.error(e);
    });
}

NfpDashboardUI.prototype.loadStatus = async function (nft, signing = true) {
    if (nft.isNull()) {
        return;
    }
    if (this.cachedStatus.hasOwnProperty(nft.valueOf())) {
        this.fetchNotifications(this.cachedStatus[nft.valueOf()]);
        return this.cachedStatus[nft.valueOf()];
    }
    const now = Math.floor(Date.now() / 1000);
    this.getSignature(nft.address, signing).then(sig => {
        if (sig === false) {
            return;
        }
        const hash = dazethutil.hashAll([sig.Signature, sig.Nonce.toString(), dazethutil.me(), nft.token.toString(), now, sig.Tokens, sig.SigHash]);
        const data = {
            who: dazethutil.me(),
            sig: sig.Signature,
            sigHash: sig.SigHash,
            nonce: sig.Nonce,
            tokens: sig.Tokens,
            token: nft.token,
            hash: hash,
            now: now.toString(10),
        }

        fetch(this.config.baseUrl + "/nfp/gen1/upgrades", {
            method: 'POST',
            body: (new URLSearchParams(data)).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
        }).then((response) => {
            if (!response.ok) {
                this.storage.removeItem(dazethutil.me() + "_signatureData");
                throw 'invalid response from upgrades';
            }
            return response.json()
        }).then(response => {
            this.cachedStatus[nft.valueOf()] = response;
            this.fetchNotifications(response);
        }).catch(e => {
            delete this.cachedStatus[nft.valueOf()];
            console.error(e);
        });

    });
    setInterval(() => {
        delete this.cachedStatus[this.selectedToken.valueOf()];
        this.loadStatus(this.selectedToken, false);
    }, 1800000);
}

NfpDashboardUI.prototype.displayHero = function (cb = null) {
    let image = '', anim = false;
    if (this.selectedToken.equals(NftUpgrade.nullNft)) {
        image = emptyHero;
    } else {
        if (this.selectedMeta.hasOwnProperty('image')) {
            image = this.selectedMeta.image;
            anim = this.selectedMeta.hasOwnProperty('animation_url') ? this.selectedMeta.animation_url : false;
        } else {
            image = this.upgrade.contracts[this.selectedToken.address].getImageURL(this.selectedToken.token)
        }
    }
    if (cb === null) {
        cb = (new Date()).getTime();
    }
    if (image.indexOf('?') > -1) {
        image += `&_=${cb}`;
    } else {
        image += `?_=${cb}`;
    }
    let name = "";
    if (!this.selectedToken.isNull()) {
        name = this.config.tokenNames.hasOwnProperty(this.selectedToken.address) ? this.config.tokenNames[this.selectedToken.address] : "";
    }
    if (name !== "") {
        name += " #" + this.selectedToken.token;
    }
    this.setName('Loading...', name);

    const nftImg = document.querySelector('img.selected-nft');
    if (anim) {
        video_hero.pause();
        video_hero_source.setAttribute('src', anim);
        video_hero_source.setAttribute('type', 'video/mp4');
        video_hero.load();
        video_hero.play();
        nftImg.style.display = "none";
        video_hero.style.display = "inline";
    } else {
        nftImg.style.display = "inline";
        video_hero.style.display = "none";
        video_hero.pause();
    }
    if (nftImg.getAttribute('src') !== image) {
        nftImg.setAttribute('src', image);
    }
}

NfpDashboardUI.prototype.addLinks = function (nft) {
    return;
    let linkHTML = `<a class="mx-lg-1 d-inline-block" style="max-height:32px;max-width: 32px;width: 32%;" href="https://rarible.com/token/${nft.address}:${nft.token}?tab=details" target="_blank"><img src="https://cdn.daz3d.com/file/dazcdn/media/nfp-dashboard/icons/rarity.png" style="width:32px; max-height:32px; height:32px;" title="View on Rarible" alt="Rarible"></a>
                            <a class="mx-lg-1 d-inline-block" style="max-height:32px;max-width: 32px;width: 32%;" href="https://opensea.io/assets/${nft.address}/${nft.token}" target="_blank"><img src="https://cdn.daz3d.com/file/dazcdn/media/nfp-dashboard/icons/opensea.png" style="width:32px; max-height:32px; height:32px;" title="View on OpenSea" alt="OpenSea"></a>
                            <a class="mx-lg-1 d-inline-block" style="max-height:32px;max-width: 32px;width: 32%;" href="https://etherscan.io/token/${nft.address}?a=${nft.token}" target="_blank"><img src="https://cdn.daz3d.com/file/dazcdn/media/nfp-dashboard/icons/third.png" style="width:32px; max-height:32px; height:32px;" title="View on Etherscan" alt="Etherscan"></a>`;
    $to.html(linkHTML);
    $to.addClass('show');
}

NfpDashboardUI.prototype.setName = function (name, afterLoadingName) {
    const nftName = document.querySelector('span.nft-name');
    nftName.setAttribute('data-aftername', afterLoadingName === undefined ? null : String(afterLoadingName));
    nftName.textContent = name;
}

NfpDashboardUI.prototype.setActionPanel = function (panel) {
    let html = "";
    for (let i in panel) {

    }
}

NfpDashboardUI.prototype.loading = function (toggle) {
    if (toggle === undefined) {
        toggle = !this.isLoading;
    }
    this.isLoading = toggle;
    if (this.isLoading) {
        setTimeout(() => {
            let trans = window.getComputedStyle(heroCircle.children[0]).transform;
            heroCircle.classList.add('loading');
            heroCircle.children[0].style.transform = trans;
        }, 50);
    } else {
        setTimeout(() => {
            let trans = window.getComputedStyle(heroCircle.children[0]).transform;
            heroCircle.classList.remove('loading');
            heroCircle.children[0].style.transform = trans;
            const nftName = document.querySelector('span.nft-name');
            const name = nftName.getAttribute('data-aftername');
            if (name !== null && name !== 'null') {
                this.setName(name);
            }
        }, 50);
    }
    this.isLoading = toggle;
}

NfpDashboardUI.prototype.initListeners = function () {
    dazeth.provider.on('accountsChanged', (accounts) => {
        console.warn('reset after accounts changed');
        this.reset();
        this.loadTokens();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== 'visible') {
            return;
        }
    });

    // Modified for 7visitors
    document.querySelector('.selected-nft').addEventListener('load', async (e) => {
        this.loading(false);
    })

    // Added for 7visitors
    document.querySelector('#hero-thumb').addEventListener('load', async (e) => {
        this.loading(false);
    })

    document.querySelector('#heroCircle video').addEventListener('loadeddata', async (e) => {
        this.loading(false);
    })

    document.querySelector("#invList").addEventListener('click', (e) => {
        const nft = e.target.parentNode;
        if (!nft.classList.contains('nft')) {
            return;
        }
        document.querySelectorAll('a.nft').forEach(link => {
            link.classList.remove('selected')
        });
        nft.classList.add('selected');
        const token = nft.getAttribute('data-id');
        const address = nft.getAttribute('data-address');
        this.selectToken(address, token, nft);
    });

    document.querySelectorAll("#dashOptions a").forEach(a => {
        a.addEventListener('click', (e) => {
            this.displayModule(e.target.closest('a').getAttribute('data-module'));
        });
    });

    document.querySelectorAll(".close-panel").forEach(a => {
        a.addEventListener('click', () => this.hideModules());
    });

    document.getElementById('notifIco').addEventListener('click', async (e) => {
        return this.ShowApproval();
    })
}

NfpDashboardUI.prototype.SaveApproval = async function (upg, approved) {
    const now = Math.floor(Date.now() / 1000);
    const nft = this.selectedToken;

    this.loading(true);
    this.modal.Processing('', approved ? 'Updating your NFP' : "Rejecting your changes");
    return this.getSignature(nft.address, true).then(sig => {
        if (sig === false) {
            return;
        }
        const approve = approved ? "1" : "0";
        const hash = dazethutil.hashAll([sig.Signature, sig.Nonce.toString(), dazethutil.me(), nft.token.toString(), upg.effect, approve, now, sig.Tokens, sig.SigHash]);
        const data = {
            who: dazethutil.me(),
            sig: sig.Signature,
            sigHash: sig.SigHash,
            nonce: sig.Nonce,
            tokens: sig.Tokens,
            token: nft.token,
            hash: hash,
            effect: upg.effect,
            approved: approve,
            now: now.toString(10),
        }


        return fetch(this.config.baseUrl + "/nfp/gen1/upgrades/commit", {
            method: 'POST',
            mode: 'cors',
            body: (new URLSearchParams(data)).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        }).then((response) => {
            if (!response.ok) {
                throw "invalid response";
            }
            return response.json()
        }).then(response => {
            this.modal.Close();
            this.loading(false);
            this.notifications.shift();
            if (approved) {
                this.displayHero((new Date).getTime());
                this.panel.reset(true);
                this.modal.View(
                    'NFP Update Was Successful',
                    'Your NFP PFP change has been completed. You will need to refresh MetaData on OpenSea to see this change.',
                    [
                        {
                            text: 'View NFP On OpenSea',
                            callback : () => { window.open(`https://opensea.io/assets/${this.selectedToken.address}/${this.selectedToken.token}`); return false; }
                        },
                        {
                            text: 'Close',
                        }
                    ]
                );
            } else {
                this.modal.View(
                    'NFP Change Rejection Was Saved',
                    'Your NFP PFP change has been rejected.',
                    [
                        {
                            text: 'Close',
                        }
                    ]
                );
            }
        }).catch(e => {
            this.modal.Close();
            this.loading(false);
            this.modal.Error('NFP Update Failed', 'Please try again later...');
            console.error(e);
        });
    });
}

NfpDashboardUI.prototype.ShowApproval = async function () {
    await this.modal.acceptUpdate(this.notifications[0]).then(async (accepting) => {
        if (accepting.reject) {
            return this.modal.Confirm('Are you sure you want to reject this change?', 'You will not be able to accept this change again. This cannot be undone.', 'Yes, reject this change', 'No, I changed my mind').then(() => {
                return this.SaveApproval(accepting.record, false);
            }, async () => {
                return this.ShowApproval();
            })
        } else {
            return this.modal.Confirm('Are you sure you want to accept this change?', 'This will permanently change your NFP metadata, default image, and Daz assets included in downloads.<br><br>Your alternate renders and 3D files will be queued to be delivered at a later date.', 'Yes, permanently change my NFP', 'No, I changed my mind').then(() => {
                return this.SaveApproval(accepting.record, true);
            }, async () => {
                return this.ShowApproval();
            })
        }
    }).catch((e) => {
        console.error(e);
    }).finally(() => {
        if (!this.notifications.length) {
            // no more
            document.getElementById('notifIco').classList.add('d-none');
        } else {
            // update count
            document.getElementById('notifIco').querySelector('span').textContent = this.notifications.length.toString(10);
        }
    })
}

NfpDashboardUI.ActionPanel = function (ui) {
    this.ui = ui;
    this.elements = [];
}

NfpDashboardUI.ActionPanel.prototype.Init = function () {
    document.addEventListener('nfp_selected', (e) => {
        const nft = e.detail.nft;
        if (nft.isNull()) {
            this.reset(true);
        }
    });
}

NfpDashboardUI.ActionPanel.prototype.render = function () {
    actions.innerHTML = "";
    image_selected.style.display = "none";
    video_selected.style.display = "none";
    for (let i in this.elements) {
        const element = this.elements[i];
        switch (element.type) {
            case 'text':
                actions.innerHTML += `<p class="description fw-lighter">${element.text}</p>`;
                break;
            case 'title':
                actions.innerHTML += `<h2>${element.text}</h2>`;
                break;
            case 'button':
                let a = document.createElement("a");
                a.classList.add('submit', 'mt-4', 'text-decoration-none');
                a.href = "javascript:";
                a.addEventListener('click', element.onClick);
                a.innerText = element.text;
                actions.append(a);
                break;
            case 'selected':
                video_selected.pause();
                if (element.video) {
                    image_selected.style.display = "none";
                    selected_video_source.setAttribute('src', element.src);
                    selected_video_source.setAttribute('type', 'video/mp4');
                    video_selected.load();
                    video_selected.play();
                    video_selected.style.display = "inline";
                } else {
                    video_selected.style.display = "none";
                    image_selected.src = element.src;
                    image_selected.style.display = "inline";
                }
                break;
            default:
                alert('unhandled ' + element.type);
        }
    }

}

NfpDashboardUI.ActionPanel.prototype.reset = function (render = false) {
    this.elements = [];
    render && this.render();
    return this;
}

NfpDashboardUI.ActionPanel.prototype.setSelectedImage = function (src) {
    this.elements.push({
        'type': 'selected',
        'src': src,
    });
    return this;
}

NfpDashboardUI.ActionPanel.prototype.setSelectedVideo = function (src) {
    this.elements.push({
        'type': 'selected',
        'video' : true,
        'src': src,
    });
    return this;
}

NfpDashboardUI.ActionPanel.prototype.addButton = function (text, onClick) {
    this.elements.push({
        'type': 'button',
        'text': text,
        'onClick': onClick
    });
    return this;
}

NfpDashboardUI.ActionPanel.prototype.addText = function (text) {
    this.elements.push({
        'type': 'text',
        'text': text,
    });
    return this;
}

NfpDashboardUI.ActionPanel.prototype.addTitle = function (text) {
    this.elements.push({
        'type': 'title',
        'text': text,
    });
    return this;
}

NfpDashboardUI.ActionPanel.prototype.addDownload = function (text, url) {
    this.elements.push({
        'type': 'download',
        'text': text,
        'url': url,
    });
    return this;
}
