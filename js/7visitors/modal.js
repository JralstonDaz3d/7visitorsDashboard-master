function NfpModal() {
    this.openedModal = null;
}

NfpModal.prototype.Error = function (title, message) {

    this.viewModal({
        titleStr: title,
        msgStr: message,
        btnObjArr: [
            {
                text: 'Close'
            },
        ],
        dismissOnBlur: true
    })
}

NfpModal.prototype.Critical = function (title, message, buttons = []) {
    this.viewModal({
        titleStr: title,
        msgStr: message,
        btnObjArr: buttons,
        dismissOnBlur: false
    })
}

NfpModal.prototype.Processing = function (title, message) {
    this.viewModal({
        titleStr: title,
        msgStr: message,
        dismissOnBlur: false
    })
}

NfpModal.prototype.Success = function (title, message) {
    this.viewModal({
        titleStr: title,
        msgStr: message,
        dismissOnBlur: true,
        btnObjArr: [
            {
                text: 'Hurray!',
            },
        ],
    })
}

NfpModal.prototype.Transaction = function (hash) {
    let hasp = hash.substr(0, 10) + '...' + hash.substr(hash.length - 10, 10);
    const title = "Transaction Processing";
    const message = `The Ethereum network is processing your transaction. Your transaction hash is: <span title=${hash}">${hasp}</a>`;
    this.viewModal({
        titleStr: title,
        msgStr: message,
        btnObjArr: [
            {
                text: 'View on Etherscan',
                callback: () => {
                    window.open(`https://etherscan.io/tx/${hash}`)
                    return false;
                }
            },
        ],
        dismissOnBlur: false
    })
}


NfpModal.prototype.View = function (title, message, buttonArr = [], dismissOnBlur = true) {
    this.viewModal({
        titleStr: title,
        msgStr: message,
        btnObjArr: buttonArr,
        dismissOnBlur: dismissOnBlur
    })
}

NfpModal.prototype.Confirm = async function (title, message, yesButton = 'Yes', noButton = 'No') {
    return new Promise((resolve, reject) => {
        this.viewModal({
            titleStr: title,
            msgStr: message,
            btnObjArr: [
                {
                    text: noButton,
                    callback: () => reject()
                },
                {
                    text: yesButton,
                    callback: () => resolve()
                },
            ],
            dismissOnBlur: false,
            horizBtns: true
        })
    });
}

NfpModal.prototype.acceptUpdate = async function (el) {
    if (!el) {
        throw('accept updated called without an update');
    }
    return new Promise((resolve, reject) => {

        const title = `Your Update Has Been Applied to NFP #${el.token}`,
            message = `The request you submitted for <strong>${el.change}</strong> has been processed. Here is a preview of the result. Please accept or reject below.<br>
            <div class="update-compare row">
                <div class="card col-6">
                    <img src="${el.oldImg}" class="card-img-top">
                    <div class="card-body">
                        <p class="card-text text-center">Before Update</p>
                    </div>
                </div>    
                <div class="card col-6">
                    <img src="${el.newImg}" class="card-img-top">
                    <div class="card-body">
                        <p class="card-text text-center">After Update</p>
                    </div>
                </div>
            </div>`;
        this.viewModal({
            titleStr: title,
            msgStr: message,
            btnObjArr: [
                {
                    text: "Reject",
                    callback: () => resolve({record: el, reject: true})
                },
                {
                    text: "Choose Later",
                    callback: () => reject(null)
                },
                {
                    text: "Accept",
                    callback: () => resolve({record: el, reject: false})
                }
            ],
            horizBtns: true
        })
    })

}

NfpModal.prototype.Close = function () {
    if (this.openedModal) {
        this.openedModal.remove();
    }
}

NfpModal.prototype.viewModal = function ({titleStr, msgStr, btnObjArr, dismissOnBlur = true, horizBtns = false}) {
    // *Demo at bottom of this file*
    // send in an object with the relevant destructured properties above
    // titleStr & msgStr are both optional, but there must be at least one of them
    // titleStr = string
    // msgStr = string
    // btnObjArr is optional
    // btnObjArr = object with 2 properties: text (string); callback (function reference, optional--defaults to dismissing modal))
    this.Close();
    dismissOnBlur = !!dismissOnBlur;
    const body = document.querySelector('body');

    const modal = document.createElement('div');
    modal.setAttribute('id', 'modal');

    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');

    modal.appendChild(modalBox);
    body.appendChild(modal);
    this.openedModal = document.querySelector('#modal');
    const openedModalBox = document.querySelector('.modal-box');

    if (titleStr) {
        const title = document.createElement('p');
        title.classList.add('modal-title')
        title.innerText = titleStr;
        modalBox.appendChild(title);
    }

    if (msgStr) {
        const message = document.createElement('p');
        message.innerHTML = msgStr;
        modalBox.appendChild(message);
    }

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    if(horizBtns) {
        btnContainer.classList.add('horizontal-buttons');
    }

    const blurDismissEnable = () => {
        openedModalBox.parentElement.addEventListener('click', (evt) => {
            if (
                evt.clientX > openedModalBox.getBoundingClientRect().left &&
                evt.clientX < openedModalBox.getBoundingClientRect().right &&
                evt.clientY > openedModalBox.getBoundingClientRect().top &&
                evt.clientY < openedModalBox.getBoundingClientRect().bottom
            ) {
                return;
            } else {
                this.Close();
                openedModalBox.remove();
            }
        })
    }

    if (btnObjArr && btnObjArr.length > 0) {
        // if any button has a callback, assume user must choose option to continue & disable clicking outside modal to dismiss
        let enableBlurDismiss = dismissOnBlur;

        // attach event listeners to button(s)
        for (let i = 0; i < btnObjArr.length; i++) {
            const button = document.createElement('button');
            button.innerText = btnObjArr[i].text;

            // add sent in callback as event handler to button, or default action of dismiss modal
            if (btnObjArr[i].callback) {
                enableBlurDismiss = false;

                button.addEventListener('click', () => {
                    let value = btnObjArr[i].callback();
                    if (typeof value === 'object' && typeof value.then === 'function') {
                        value.then((closeIt = true) => {
                            closeIt !== false && this.Close();
                        }, (e) => {
                            throw e;
                        });
                    } else {
                        value !== false && this.Close();
                    }
                })
            } else {
                button.addEventListener('click', () => {
                    this.Close();
                })
            }
            btnContainer.appendChild(button);
        }

        enableBlurDismiss && blurDismissEnable();
    } else {
        dismissOnBlur && blurDismissEnable();
    }

    modalBox.appendChild(btnContainer);
}
