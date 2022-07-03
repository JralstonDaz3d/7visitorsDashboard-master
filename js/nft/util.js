function DazEthUtil() {}

DazEthUtil.prototype.toLower = (what) => {
    if (Array.isArray(what)) {
        let result = [];
        for (let i in what) {
            result[i] = what[i].toString().toLowerCase();
        }
        return result;
    }
    what = what.toString().toLowerCase();
    return what;
};

DazEthUtil.prototype.hash = (hashIn) => {
    let toHash = hashIn.join('');
    return dazeth.web3.utils.keccak256("\x19Ethereum Signed Message:\n" + toHash.length.toString() + toHash);
}

DazEthUtil.prototype.hashAll = (hashIn) => {
    for (let i in hashIn) {
        hashIn[i] = dazethutil.hash([hashIn[i]])
    }
    return dazethutil.hash(hashIn);
}

DazEthUtil.prototype.me = function () {
    return dazethutil.toLower(window.dazeth.selectedAccount);
}

window.dazethutil = new DazEthUtil();

