
function Nfp3dModelModule(ui, enabled) {
    this.cachedStatus = {};
    this.options = {};
    this.ui = ui;
    this.enabled = enabled;
    this.selectedFormat = null;
    this.selectedToken = NftUpgrade.nullNft;
    this.formats = {'daz' : 'Daz 3D'};
    this.name = "models";
    this.label = "3d Files";
    this.icon = `<svg width="43" height="44" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.1856 10.5381L21.8248 0.16303C21.6098 0.0513784 21.3706 -0.00695038 21.1278 -0.00695038C20.8849 -0.00695038 20.6457 0.0513784 20.4308 0.16303L0.794444 10.5381C0.554345 10.6645 0.353563 10.8531 0.213612 11.0837C0.0736608 11.3144 -0.000181047 11.5783 3.33343e-07 11.8473V32.6517C0.000370978 32.9249 0.0770887 33.1926 0.221693 33.4254C0.366298 33.6582 0.57317 33.847 0.819436 33.9708L20.4607 43.8518C20.6687 43.9544 20.8979 44.0079 21.1303 44.0079C21.3627 44.0079 21.5919 43.9544 21.7998 43.8518L42.1606 33.9708C42.4121 33.8489 42.6241 33.6598 42.7724 33.4249C42.9208 33.19 42.9996 32.9187 43 32.6418V11.8572C43.0001 11.5845 42.9241 11.3171 42.7804 11.0843C42.6367 10.8516 42.4309 10.6626 42.1856 10.5381ZM28.3952 23.3142C28.2252 23.196 28.0322 23.1141 27.8284 23.0736C27.6247 23.0331 27.4147 23.035 27.2117 23.0791C27.0087 23.1231 26.8172 23.2085 26.6494 23.3296C26.4815 23.4508 26.341 23.6051 26.2367 23.7828C26.1324 23.9606 26.0666 24.1578 26.0435 24.362C26.0204 24.5662 26.0405 24.7729 26.1026 24.9691C26.1646 25.1652 26.2672 25.3464 26.4038 25.5012C26.5404 25.656 26.7081 25.7811 26.8962 25.8684L38.3582 32.5183L22.6592 40.1365V22.914L40.0221 14.2632V30.0728L28.3952 23.3142ZM16.5435 23.4377C16.4439 23.2695 16.3117 23.1224 16.1545 23.0047C15.9974 22.8871 15.8183 22.8013 15.6276 22.7522C15.4368 22.7031 15.2381 22.6917 15.0429 22.7186C14.8477 22.7455 14.6598 22.8102 14.4899 22.9091L2.99791 29.5787V14.3027L19.6413 22.8992V40.102L4.18708 32.3256L16.0088 25.4682C16.1789 25.3698 16.3277 25.2391 16.4467 25.0837C16.5656 24.9283 16.6524 24.7512 16.7021 24.5626C16.7517 24.374 16.7633 24.1775 16.7361 23.9845C16.7088 23.7915 16.6434 23.6057 16.5435 23.4377ZM21.1502 3.15697L38.2233 11.8424L21.1752 20.3351L4.7317 11.8424L21.1502 3.15697Z"></path>
                </svg>`;
                
    this.panel = `
                <h4 class="text-center fw-lighter my-3 panel-head">Download</h4>
                <div class="panel-dl-icons purple-box p-3 panel-desc">
                    <div class='dl-icon-container'>
                        <div class='dl-img-container dl-live'>
                            <img src='https://cdn.daz3d.com/file/dazcdn/media/nfp/dash-update/daz1.svg' alt='Daz 3D'>
                        </div>
                        <p>Daz 3D</p>
                    </div>
                    <div class='dl-icon-container'>
                        <div class='dl-img-container'>
                            <img src='https://cdn.daz3d.com/file/dazcdn/media/nfp/dash-update/unreal1.svg' alt='Unreal'>
                        </div>
                        <p>Unreal</p>
                    </div>
                    <div class='dl-icon-container'>
                        <div class='dl-img-container'>
                            <img src='https://cdn.daz3d.com/file/dazcdn/media/nfp/dash-update/maya1.svg' alt='Maya'>
                        </div>
                        <p>Maya</p>
                    </div>
                    <div class='dl-icon-container'>
                        <div class='dl-img-container'>
                            <img src='https://cdn.daz3d.com/file/dazcdn/media/nfp/dash-update/unity1.svg' alt='Unity'>
                        </div>
                        <p>Unity</p>
                    </div>
                    <div class='dl-icon-container'>
                        <div class='dl-img-container'>
                            <img src='https://cdn.daz3d.com/file/dazcdn/media/nfp/dash-update/cinema4d1.svg' alt='Cinema 4D'>
                        </div>
                        <p>Cinema 4D</p>
                    </div>
                </div>
                <div class="flex-grow-1 p-3 panel-items">
                    <p class='fw-bold'>Daz 3D</p>
                    <p>New to Daz Studio? Here’s a quick guide to help you get started.</p>

                    <iframe id='panel-howto-video' src="https://www.youtube.com/embed/KhJxPne2vMg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="download-all p-3 panel-footer">
                    <button id="downloadFiles" class="submit border-0 m-auto">Download <span class="software-name">Daz 3D Studio</span> Files</button>
                </div>
    `;
}

Nfp3dModelModule.prototype.Init = async function () {
    downloadFiles.addEventListener('click', () => this.download(this.selectedFormat))
}

Nfp3dModelModule.prototype.IsNftBlocked = function (nft) {
    return false;
}

Nfp3dModelModule.prototype.Display = async function (nft) {
    if (!this.enabled || this.IsNftBlocked(nft)) {
        return;
    }
    this.selectedToken = nft;
    await this.selectFormat('daz'); // there is only one right now
}

Nfp3dModelModule.prototype.selectFormat = async function (format = null) {
    if (format !== null) {
        this.selectedFormat = format;
    }
    if (!this.selectedFormat) {
        return;
    }
    this.ui.panel.reset()
        //.setSelectedImage(this.selectedFormat.src)
        .addText('Download your NFP’s 3D files to create stunning renders and animations in Daz Studio. Other file formats coming soon!')
        //.addButton('Download your 3D NFP for ' + this.formats[this.selectedFormat], () => this.download(this.selectedFormat))
        .render();
}

Nfp3dModelModule.prototype.download = async function (what) {
    const now = Math.floor(Date.now() / 1000);
    this.ui.getSignature(this.selectedToken.address, true).then(signature => {
        this.ui.loading(true);
        const hash = dazethutil.hashAll([what, this.selectedToken.token, dazethutil.me(), now,  signature.Signature, signature.Nonce, signature.Tokens, signature.SigHash]);

        const data = {
            who: dazethutil.me(),
            sig: signature.Signature,
            sigHash: signature.SigHash,
            tokens: signature.Tokens,
            nonce: signature.Nonce.toString(),
            hash: hash,
            token: this.selectedToken.token,
            now: now.toString(10),
            what: what
        }

        document.location.href = "/nft-api/nfp/gen1/download?" + (new URLSearchParams(data)).toString();
        this.ui.loading(false);
    });
}

Nfp3dModelModule.prototype.Reset = async function () {
}


