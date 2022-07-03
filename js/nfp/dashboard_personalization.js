function NfpPersonalizationModule(ui, enabled) {
    this.cachedStatus = {};
    this.options = {};
    this.enabled = true;
    this.ui = ui;
    this.blockedNfps = [1,7,16,30,37,42,85,575,1408,1583,2935,4512,5743,6195,7596,8453];

    this.optionBlocks = {
        background: document.getElementById('background'),
        background: document.getElementById('expression'),
        background: document.getElementById('eyes'),
        background: document.getElementById('character'),
        background: document.getElementById('hair'),
    };

    this.options = {
        "expression": {
            "smile-open": "Smile Mouth Open",
            "sad": "Sad",
            "goofy-smile": "Goofy Smile Tongue Out",
            "composed": "Composed",
        }, "eyes": {
            "grey": "Grey",
            "orange": "Orange",
            "dark-brown": "Brown",
            "green": "Green",
        }, "background": {
            "blue": "Blue",
            "cyan": "Cyan",
            "green": "Green",
            "yellow": "Yellow",
        }, "character": {
            "clara": "Clara",
            "jinx": "Jinx",
            "kala": "Kala",
            "victoria": "Victoria",
        }, "hair": {
            "feshort-black": "Fe Short Hair - Black",
            "feshort-blonde": "Fe Short Hair - Blonde",
            "feshort-brown": "Fe Short Hair - Brown",
            "feshort-red": "Fe Short Hair - Red",

            "matilda-black": "Matilda - Black",
            "matilda-blonde": "Matilda - Blonde",
            "matilda-brown": "Matilda - Brown",
            "matilda-red": "Matilda - Red",

            "pandora-black": "Pandora - Black",
            "pandora-blonde": "Pandora - Blonde",
            "pandora-brown": "Pandora - Brown",
            "pandora-red": "Pandora - Red",

            "ilias-black": "Ilias - Black",
            "ilias-blonde": "Ilias - Blonde",
            "ilias-brown": "Ilias - Brown",
            "ilias-red": "Ilias - Red",

        }, "clinique" : {
            "background" : "Clinique Background",
        },
    }

    this.selected = null;

    this.name = "personalize";
    this.label = "Personalize";
    this.icon = `<svg width="47" height="30" viewBox="0 0 47 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.27015 5.79952H18.2317C18.5424 6.60961 19.0928 7.3068 19.81 7.79898C20.5273 8.29116 21.3777 8.55515 22.249 8.55609C23.1196 8.55487 23.9693 8.2907 24.6858 7.7985C25.4023 7.3063 25.9518 6.60926 26.2617 5.79952H45.7343C46.071 5.79893 46.3938 5.66555 46.6318 5.4286C46.8699 5.19165 47.0039 4.87045 47.0045 4.53535C47.0039 4.20026 46.8699 3.87905 46.6318 3.6421C46.3938 3.40515 46.071 3.27177 45.7343 3.27118H26.4258C26.1983 2.33914 25.6629 1.51012 24.9055 0.91698C24.1482 0.323844 23.2127 0.000933946 22.249 0C21.2856 0.00143466 20.3507 0.324573 19.5938 0.91767C18.8369 1.51077 18.3018 2.33951 18.0743 3.27118H1.27465C0.937966 3.27177 0.615241 3.40515 0.37717 3.6421C0.1391 3.87905 0.00508795 4.20026 0.00449363 4.53535C0.00508239 4.86968 0.138478 5.19021 0.375578 5.42703C0.612679 5.66385 0.934246 5.79775 1.27015 5.79952ZM22.2445 2.23747C22.788 2.23806 23.3092 2.45324 23.6935 2.83579C24.0779 3.21835 24.2941 3.73703 24.2947 4.27804C24.2941 4.81905 24.0779 5.33774 23.6935 5.72029C23.3092 6.10285 22.788 6.31802 22.2445 6.31861C21.7013 6.31743 21.1807 6.10199 20.7968 5.7195C20.413 5.33701 20.1971 4.81867 20.1965 4.27804C20.1971 3.73664 20.4136 3.21762 20.7984 2.835C21.1833 2.45239 21.705 2.23747 22.249 2.23747H22.2445Z"></path>
                    <path d="M45.7299 13.8656H12.6251C12.3597 12.9849 11.8161 12.2129 11.0751 11.6639C10.334 11.115 9.43491 10.8184 8.51112 10.8182C7.58743 10.8187 6.68849 11.1155 5.9475 11.6643C5.20651 12.2132 4.66289 12.9851 4.39719 13.8656H1.27015C0.933283 13.8656 0.610217 13.9988 0.372018 14.2359C0.133819 14.4729 0 14.7945 0 15.1298C0.000594321 15.4649 0.134606 15.7861 0.372676 16.023C0.610747 16.26 0.933466 16.3934 1.27015 16.3939H4.41742C4.69654 17.2575 5.24317 18.011 5.97896 18.5464C6.71475 19.0817 7.60193 19.3715 8.51337 19.3743C9.42489 19.3719 10.3122 19.0822 11.0481 18.5468C11.7839 18.0114 12.3305 17.2577 12.6093 16.3939H45.7321C46.0688 16.3934 46.3915 16.26 46.6296 16.023C46.8676 15.7861 47.0017 15.4649 47.0022 15.1298C47.0022 14.9636 46.9693 14.799 46.9053 14.6455C46.8414 14.492 46.7476 14.3525 46.6294 14.2351C46.5113 14.1177 46.371 14.0246 46.2166 13.9612C46.0622 13.8978 45.8968 13.8653 45.7299 13.8656ZM8.51112 17.1368C7.96755 17.1362 7.44642 16.921 7.06205 16.5385C6.67769 16.1559 6.46149 15.6372 6.4609 15.0962C6.46149 14.5552 6.67769 14.0365 7.06205 13.654C7.44642 13.2714 7.96755 13.0562 8.51112 13.0556C9.05353 13.0568 9.57341 13.2716 9.95715 13.6532C10.3409 14.0347 10.5573 14.5519 10.5591 15.0917C10.5597 15.6331 10.3443 16.1526 9.96032 16.5361C9.57632 16.9195 9.05508 17.1356 8.51112 17.1368Z"></path>
                    <path d="M45.7299 24.46H39.496C39.2238 23.5878 38.6788 22.825 37.9403 22.2828C37.2019 21.7406 36.3087 21.4475 35.3911 21.4461C34.4734 21.4475 33.5803 21.7406 32.8418 22.2828C32.1034 22.825 31.5583 23.5878 31.2861 24.46H1.27015C0.933283 24.46 0.610217 24.5932 0.372018 24.8303C0.133819 25.0674 0 25.3889 0 25.7242C0.000595531 26.0591 0.134679 26.3801 0.372814 26.6167C0.610948 26.8532 0.933672 26.9861 1.27015 26.9861H31.2861C31.5583 27.8583 32.1034 28.6212 32.8418 29.1633C33.5803 29.7055 34.4734 29.9987 35.3911 30C36.3087 29.9987 37.2019 29.7055 37.9403 29.1633C38.6788 28.6212 39.2238 27.8583 39.496 26.9861H45.7299C46.0663 26.9861 46.3891 26.8532 46.6272 26.6167C46.8653 26.3801 46.9994 26.0591 47 25.7242C47 25.3889 46.8662 25.0674 46.628 24.8303C46.3898 24.5932 46.0667 24.46 45.7299 24.46ZM35.3888 23.6836C35.9324 23.6842 36.4535 23.8994 36.8379 24.2819C37.2222 24.6645 37.4384 25.1832 37.439 25.7242C37.4379 26.2648 37.2214 26.7829 36.8371 27.165C36.4528 27.5471 35.932 27.7619 35.3888 27.7625C34.8456 27.7619 34.3248 27.5471 33.9405 27.165C33.5562 26.7829 33.3398 26.2648 33.3386 25.7242C33.3392 25.1828 33.5557 24.6638 33.9405 24.2812C34.3254 23.8985 34.8471 23.6836 35.3911 23.6836H35.3888Z"></path>
                </svg>`;

    this.panel = `<h4 class="text-center fw-lighter my-3 panel-head">Personalize</h4>
                <div class="purple-box p-3 panel-desc">
                    <div class="row">
                        <a href="javascript:" class="col personalize-cat text-decoration-none d-flex align-items-center text-center flex-column justify-content-center">
                        <div class="purple-cir d-flex align-items-center text-center justify-content-center"">
                            <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.2386 22H6.90943C6.44244 21.9994 5.99473 21.8089 5.66452 21.4702C5.33431 21.1315 5.14855 20.6723 5.14799 20.1934V18.1996C5.14799 18.0855 5.19218 17.9761 5.27083 17.8955C5.34948 17.8148 5.45615 17.7695 5.56738 17.7695C5.67861 17.7695 5.78529 17.8148 5.86394 17.8955C5.94259 17.9761 5.98677 18.0855 5.98677 18.1996V20.1934C5.98733 20.4442 6.08471 20.6845 6.25763 20.8619C6.43054 21.0392 6.6649 21.1391 6.90943 21.1397H24.2386C24.4831 21.1391 24.7175 21.0392 24.8904 20.8619C25.0633 20.6845 25.1607 20.4442 25.1612 20.1934V5.17469C25.1607 4.92408 25.0632 4.68393 24.8902 4.50692C24.7173 4.32991 24.4829 4.23051 24.2386 4.23051H20.4326C20.3214 4.23051 20.2147 4.18519 20.1361 4.10452C20.0574 4.02385 20.0132 3.91444 20.0132 3.80036C20.0132 3.68628 20.0574 3.57686 20.1361 3.4962C20.2147 3.41553 20.3214 3.37021 20.4326 3.37021H24.2386C24.7054 3.37021 25.1531 3.56025 25.4833 3.8986C25.8136 4.23694 25.9994 4.69591 26 5.17469V20.1934C25.9994 20.6723 25.8137 21.1315 25.4835 21.4702C25.1533 21.8089 24.7056 21.9994 24.2386 22Z" fill="white"/>
                            <path d="M18.1469 18.6299H2.71135C1.99242 18.6293 1.3031 18.3361 0.794748 17.8147C0.286392 17.2933 0.000555368 16.5863 0 15.8489V2.78099C0.00111039 2.044 0.287195 1.33754 0.79549 0.816608C1.30379 0.295673 1.99279 0.00279645 2.71135 0.00222778H18.1469C18.8659 0.0027974 19.5552 0.29597 20.0635 0.81737C20.5719 1.33877 20.8577 2.04577 20.8583 2.78314V15.8511C20.8572 16.5881 20.5711 17.2945 20.0628 17.8155C19.5545 18.3364 18.8655 18.6293 18.1469 18.6299ZM2.71135 0.862527C2.21488 0.863096 1.73891 1.06563 1.38785 1.42569C1.0368 1.78575 0.839334 2.27394 0.838779 2.78314V15.8511C0.839334 16.3603 1.0368 16.8485 1.38785 17.2085C1.73891 17.5686 2.21488 17.7711 2.71135 17.7717H18.1469C18.6434 17.7711 19.1194 17.5686 19.4704 17.2085C19.8215 16.8485 20.019 16.3603 20.0195 15.8511V2.78314C20.019 2.27394 19.8215 1.78575 19.4704 1.42569C19.1194 1.06563 18.6434 0.863096 18.1469 0.862527H2.71135Z" fill="white"/>
                            <path d="M17.1866 16.9371H9.77596C9.66473 16.9371 9.55805 16.8918 9.4794 16.8111C9.40075 16.7305 9.35657 16.6211 9.35657 16.507C9.35657 16.3929 9.40075 16.2835 9.4794 16.2028C9.55805 16.1222 9.66473 16.0768 9.77596 16.0768H17.1866C17.4305 16.0763 17.6644 15.9766 17.8369 15.7997C18.0094 15.6227 18.1066 15.3829 18.1071 15.1327V6.64795C18.1071 6.53387 18.1513 6.42446 18.2299 6.34379C18.3086 6.26312 18.4153 6.2178 18.5265 6.2178C18.6377 6.2178 18.7444 6.26312 18.8231 6.34379C18.9017 6.42446 18.9459 6.53387 18.9459 6.64795V15.1327C18.9453 15.6111 18.7598 16.0697 18.43 16.408C18.1002 16.7463 17.653 16.9366 17.1866 16.9371Z" fill="white"/>
                            </svg>
                            </div>
                            Backgrounds
                        </a>
                        <a href="javascript:" class="col personalize-cat disabled text-decoration-none d-flex align-items-center text-center flex-column justify-content-center">
                        <div class="purple-cir d-flex align-items-center text-center justify-content-center"">
                            <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 17C13.7281 16.993 10.5036 16.2444 7.58597 14.8145C4.66834 13.3846 2.13908 11.3133 0.201715 8.76725L0 8.5L0.201715 8.23275C2.13908 5.68671 4.66834 3.6154 7.58597 2.18548C10.5036 0.75557 13.7281 0.00699458 17 0C20.2719 0.00699458 23.4964 0.75557 26.414 2.18548C29.3317 3.6154 31.8609 5.68671 33.7983 8.23275L34 8.5L33.7983 8.76725C31.8609 11.3133 29.3317 13.3846 26.414 14.8145C23.4964 16.2444 20.2719 16.993 17 17ZM1.1657 8.5C3.02346 10.8554 5.41832 12.7657 8.16439 14.0827C10.9105 15.3997 13.9339 16.088 17 16.0941C20.0661 16.088 23.0895 15.3997 25.8356 14.0827C28.5817 12.7657 30.9765 10.8554 32.8343 8.5C30.9762 6.145 28.5812 4.23494 25.8353 2.91798C23.0893 1.60102 20.066 0.912538 17 0.905942C13.934 0.912538 10.9107 1.60102 8.16475 2.91798C5.41876 4.23494 3.02383 6.145 1.1657 8.5Z" fill="white"/>
                            <path d="M17 17C14.6138 16.9976 12.3261 16.1013 10.6389 14.5078C8.95158 12.9142 8.00254 10.7536 8 8.5C8.00254 6.2464 8.95158 4.08578 10.6389 2.49225C12.3261 0.898708 14.6138 0.0024032 17 0C19.3862 0.0024032 21.6739 0.898708 23.3612 2.49225C25.0484 4.08578 25.9975 6.2464 26 8.5C25.9975 10.7536 25.0484 12.9142 23.3612 14.5078C21.6739 16.1013 19.3862 16.9976 17 17ZM17 0.907877C14.8688 0.91028 12.8256 1.71093 11.3186 3.13421C9.81157 4.55749 8.96383 6.48718 8.96128 8.5C8.96383 10.5128 9.81157 12.4425 11.3186 13.8658C12.8256 15.2891 14.8688 16.0897 17 16.0921C19.1312 16.0897 21.1744 15.2891 22.6814 13.8658C24.1884 12.4425 25.0362 10.5128 25.0387 8.5C25.0362 6.48718 24.1884 4.55749 22.6814 3.13421C21.1744 1.71093 19.1312 0.91028 17 0.907877Z" fill="white"/>
                            <path d="M17 12C15.9395 11.9989 14.9228 11.6298 14.1729 10.9737C13.423 10.3176 13.0012 9.42793 13 8.5C13.0012 7.57207 13.423 6.68245 14.1729 6.0263C14.9228 5.37015 15.9395 5.00106 17 5C18.0605 5.00106 19.0772 5.37015 19.8271 6.0263C20.577 6.68245 20.9988 7.57207 21 8.5C20.9988 9.42793 20.577 10.3176 19.8271 10.9737C19.0772 11.6298 18.0605 11.9989 17 12ZM17 5.79291C16.1823 5.79397 15.3984 6.07867 14.8201 6.58462C14.2419 7.09057 13.9165 7.77647 13.9153 8.49199C13.9159 9.20767 14.2411 9.89388 14.8195 10.3999C15.3978 10.906 16.1821 11.1905 17 11.1911C17.8179 11.1905 18.6022 10.906 19.1805 10.3999C19.7589 9.89388 20.0841 9.20767 20.0847 8.49199C20.081 7.77786 19.7546 7.09401 19.1766 6.58979C18.5987 6.08557 17.8162 5.80197 17 5.80092V5.79291Z" fill="white"/>
                            </svg>
                            </div>
                            Eyes
                        </a>
                        <a href="javascript:" class="col personalize-cat disabled text-decoration-none d-flex align-items-center text-center flex-column justify-content-center">
                        <div class="purple-cir d-flex align-items-center text-center justify-content-center"">
                            <svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.6893 22.9969C11.0288 22.9963 8.45174 22.0428 6.40213 20.3008C4.35252 18.5588 2.95866 16.1372 2.46065 13.4532L2.25 12.2587L3.32158 12.7604C6.71337 14.328 10.905 14.9017 13.7015 14.9017C16.498 14.9017 20.6866 14.3405 24.0814 12.7604L25.1469 12.2587L24.9271 13.447C24.43 16.1337 23.0354 18.5579 20.9837 20.3014C18.9321 22.0449 16.3522 22.9982 13.6893 22.9969V22.9969ZM3.94437 14.3907C4.59543 16.5216 5.89155 18.3837 7.64418 19.706C9.39681 21.0282 11.5145 21.7418 13.6893 21.7428C15.864 21.7418 17.9818 21.0282 19.7344 19.706C21.487 18.3837 22.7831 16.5216 23.4342 14.3907C20.3073 15.5447 17.0119 16.1437 13.6893 16.1621C10.3667 16.1432 7.07141 15.5442 3.94437 14.3907V14.3907Z" fill="white"/>
                            <path d="M13.6893 18.2157C10.3267 18.2009 6.98858 17.6281 3.80396 16.5195L4.21304 15.3375C7.2619 16.399 10.4578 16.9475 13.6771 16.9616C16.8964 16.9475 20.0923 16.399 23.1411 15.3375L23.5502 16.5195C20.3734 17.6254 17.0437 18.1982 13.6893 18.2157V18.2157Z" fill="white"/>
                            <path d="M10.8775 5.64655C10.7156 5.64655 10.5603 5.58048 10.4458 5.46289C10.3313 5.3453 10.2669 5.1858 10.2669 5.0195C10.2669 4.02169 9.88097 3.06473 9.19394 2.35917C8.5069 1.65361 7.57507 1.25723 6.60345 1.25723C5.63183 1.25723 4.7 1.65361 4.01296 2.35917C3.32592 3.06473 2.93995 4.02169 2.93995 5.0195C2.93995 5.1858 2.87561 5.3453 2.7611 5.46289C2.6466 5.58048 2.4913 5.64655 2.32936 5.64655C2.16743 5.64655 2.01211 5.58048 1.89761 5.46289C1.7831 5.3453 1.71878 5.1858 1.71878 5.0195C1.71878 3.68908 2.23341 2.41315 3.14946 1.4724C4.06552 0.531652 5.30795 0.00314331 6.60345 0.00314331C7.89894 0.00314331 9.14138 0.531652 10.0574 1.4724C10.9735 2.41315 11.4881 3.68908 11.4881 5.0195C11.4881 5.1858 11.4238 5.3453 11.3093 5.46289C11.1948 5.58048 11.0395 5.64655 10.8775 5.64655Z" fill="white"/>
                            <path d="M24.4722 5.64655C24.3102 5.64655 24.1549 5.58048 24.0404 5.46289C23.9259 5.3453 23.8616 5.1858 23.8616 5.0195C23.8616 4.02169 23.4756 3.06473 22.7886 2.35917C22.1015 1.65361 21.1697 1.25723 20.1981 1.25723C19.2265 1.25723 18.2947 1.65361 17.6076 2.35917C16.9206 3.06473 16.5346 4.02169 16.5346 5.0195C16.5346 5.1858 16.4703 5.3453 16.3558 5.46289C16.2412 5.58048 16.0859 5.64655 15.924 5.64655C15.7621 5.64655 15.6068 5.58048 15.4923 5.46289C15.3778 5.3453 15.3134 5.1858 15.3134 5.0195C15.3134 3.68908 15.8281 2.41315 16.7441 1.4724C17.6602 0.531652 18.9026 0.00314331 20.1981 0.00314331C21.4936 0.00314331 22.736 0.531652 23.6521 1.4724C24.5681 2.41315 25.0827 3.68908 25.0827 5.0195C25.0827 5.1858 25.0184 5.3453 24.9039 5.46289C24.7894 5.58048 24.6341 5.64655 24.4722 5.64655Z" fill="white"/>
                            <path d="M19.4685 21.191H18.2473C18.2473 20.9809 17.0047 19.962 13.6893 19.962C10.3738 19.962 9.13126 20.9809 9.13126 21.191H7.9101C7.9101 19.4854 10.905 18.7079 13.6893 18.7079C16.4735 18.7079 19.4685 19.4854 19.4685 21.191Z" fill="white"/>
                            <path d="M0.754062 14.4785C0.631775 14.4786 0.512281 14.441 0.411037 14.3706C0.309794 14.3001 0.23147 14.2001 0.186224 14.0834C-0.0698365 13.4231 -0.0606844 12.6855 0.211677 12.032C0.484039 11.3786 0.997421 10.8626 1.63942 10.5971C2.00912 10.4452 2.40787 10.3825 2.80489 10.4141C3.2019 10.4456 3.58654 10.5704 3.9291 10.7789C3.99831 10.8207 4.05881 10.876 4.10717 10.9418C4.15552 11.0076 4.19077 11.0825 4.2109 11.1623C4.23103 11.2421 4.23566 11.3252 4.2245 11.4068C4.21334 11.4884 4.18662 11.567 4.14587 11.638C4.10522 11.709 4.05131 11.7712 3.98726 11.8208C3.9232 11.8705 3.85024 11.9067 3.77254 11.9274C3.69485 11.948 3.61396 11.9528 3.53448 11.9413C3.455 11.9299 3.37849 11.9024 3.30935 11.8606C3.12682 11.7489 2.92167 11.6821 2.70986 11.6652C2.49804 11.6483 2.28528 11.6819 2.08819 11.7634C1.74592 11.9043 1.47191 12.1786 1.32604 12.5264C1.18016 12.8742 1.17428 13.2672 1.3097 13.6194C1.33944 13.696 1.35418 13.7778 1.35309 13.8603C1.352 13.9427 1.3351 14.0241 1.30334 14.0998C1.27158 14.1755 1.22559 14.2441 1.16801 14.3015C1.11043 14.359 1.04239 14.4042 0.96777 14.4346C0.899854 14.4629 0.82735 14.4778 0.754062 14.4785Z" fill="white"/>
                            <path d="M26.249 14.4785C26.1716 14.4794 26.0948 14.4645 26.0231 14.4346C25.9485 14.4042 25.8804 14.359 25.8228 14.3015C25.7653 14.2441 25.7193 14.1755 25.6875 14.0998C25.6558 14.0241 25.6389 13.9427 25.6378 13.8603C25.6367 13.7778 25.6514 13.696 25.6812 13.6194C25.8164 13.2668 25.8101 12.8735 25.6636 12.5256C25.5171 12.1778 25.2424 11.9037 24.8996 11.7634C24.7024 11.6826 24.4897 11.6494 24.278 11.6663C24.0663 11.6831 23.8612 11.7496 23.6784 11.8606C23.5391 11.9441 23.3732 11.9676 23.217 11.9259C23.0608 11.8841 22.9271 11.7806 22.845 11.638C22.8043 11.567 22.7775 11.4884 22.7664 11.4068C22.7552 11.3252 22.7598 11.2421 22.78 11.1623C22.8001 11.0825 22.8353 11.0076 22.8837 10.9418C22.932 10.876 22.9925 10.8207 23.0617 10.7789C23.4043 10.5704 23.789 10.4456 24.186 10.4141C24.583 10.3825 24.9817 10.4452 25.3514 10.5971C25.6704 10.7273 25.9613 10.9208 26.2074 11.1666C26.4535 11.4123 26.6501 11.7054 26.7859 12.0291C26.9217 12.3529 26.994 12.701 26.9988 13.0534C27.0036 13.4059 26.9407 13.7559 26.8138 14.0834C26.7687 14.1996 26.6909 14.2993 26.5903 14.3697C26.4896 14.4401 26.3708 14.478 26.249 14.4785V14.4785Z" fill="white"/>
                            </svg>
                            </div>
                            Expression
                        </a>
                        <a href="javascript:" class="col personalize-cat disabled text-decoration-none d-flex align-items-center text-center flex-column justify-content-center">
                        <div class="purple-cir d-flex align-items-center text-center justify-content-center"">
                            <svg width="13" height="35" viewBox="0 0 13 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.53092 35H4.53397C4.2527 34.9997 3.97424 34.9422 3.71453 34.8307C3.45483 34.7193 3.21897 34.5561 3.02045 34.3504C2.82194 34.1448 2.66468 33.9007 2.55766 33.6323C2.45064 33.3638 2.39596 33.0762 2.39676 32.786V21.9208H2.13925C1.57205 21.9202 1.02823 21.6874 0.627162 21.2735C0.226094 20.8596 0.000536863 20.2984 0 19.713V10.2269C0.000536863 9.64154 0.226094 9.08031 0.627162 8.66639C1.02823 8.25247 1.57205 8.01969 2.13925 8.01913H9.86279C10.43 8.01969 10.9738 8.25247 11.3749 8.66639C11.7759 9.08031 12.0015 9.64154 12.002 10.2269V19.7214C12.0015 20.3067 11.7759 20.868 11.3749 21.2819C10.9738 21.6958 10.43 21.9286 9.86279 21.9292H9.66002V32.786C9.66164 33.3708 9.43836 33.9324 9.0392 34.3475C8.64003 34.7625 8.09758 34.9972 7.53092 35ZM2.13925 8.8562C1.78716 8.85676 1.44965 9.00135 1.20069 9.25829C0.951726 9.51522 0.811621 9.86355 0.811085 10.2269V19.7214C0.811621 20.0847 0.951726 20.4331 1.20069 20.69C1.44965 20.9469 1.78716 21.0915 2.13925 21.0921H3.20784V32.786C3.20784 33.1489 3.34756 33.497 3.59626 33.7537C3.84495 34.0104 4.18226 34.1546 4.53397 34.1546H7.53092C7.70558 34.1554 7.87868 34.1206 8.04028 34.0522C8.20187 33.9838 8.34879 33.8831 8.47258 33.7559C8.59636 33.6288 8.69459 33.4776 8.76161 33.3112C8.82863 33.1447 8.86313 32.9662 8.86313 32.786V21.0837H9.87699C10.2291 21.0832 10.5666 20.9386 10.8155 20.6816C11.0645 20.4247 11.2046 20.0764 11.2051 19.713V10.2269C11.2046 9.86355 11.0645 9.51522 10.8155 9.25829C10.5666 9.00135 10.2291 8.85676 9.87699 8.8562H2.13925Z" fill="white"/>
                            <path d="M5.96352 7.65291C4.98008 7.65236 4.03707 7.24893 3.34167 6.53125C2.64628 5.81357 2.25536 4.84036 2.25482 3.82541C2.2559 2.81083 2.64705 1.83814 3.34239 1.12092C4.03773 0.403697 4.98043 0.000553812 5.96352 0C6.94696 -6.06137e-07 7.89017 0.402899 8.58595 1.12018C9.28173 1.83747 9.67315 2.81046 9.67423 3.82541C9.67369 4.84072 9.28251 5.81426 8.58667 6.53199C7.89083 7.24973 6.94731 7.65291 5.96352 7.65291ZM5.96352 0.83707C5.19554 0.837624 4.45915 1.15258 3.91591 1.71282C3.37268 2.27306 3.06698 3.03283 3.06591 3.82541C3.06698 4.61818 3.37262 5.37817 3.91579 5.93874C4.45896 6.49932 5.19535 6.81473 5.96352 6.81584C6.73219 6.81584 7.46942 6.50085 8.01315 5.94009C8.55687 5.37934 8.8626 4.61871 8.86314 3.82541C8.86207 3.03247 8.5561 2.27238 8.01243 1.71208C7.46876 1.15178 6.73184 0.837069 5.96352 0.83707Z" fill="white"/>
                            </svg>
                            </div>
                            Body&nbsp;Type
                        </a>
                        <a href="javascript:" class="col personalize-cat disabled text-decoration-none d-flex align-items-center text-center flex-column justify-content-center">
                            <div class="purple-cir d-flex align-items-center text-center justify-content-center"">
                            <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 24H8V20.3143L8.53674 20.4769C9.21648 20.6832 9.92924 20.7887 10.6469 20.7894C11.6049 20.7894 12.5514 20.6023 13.4204 20.2412L14 20V24ZM8.81633 23.2691H13.1837V21.1183C12.3708 21.3839 11.5122 21.52 10.6469 21.5203C10.0276 21.5207 9.41056 21.452 8.8102 21.3157L8.81633 23.2691Z" fill="white"/>
                            <path d="M4.06607 11C3.41975 11 2.73465 10.97 2 10.9015L2.08187 10.0453C6.0912 10.4199 9.37666 9.64924 11.3285 7.88104C11.8881 7.39714 12.3386 6.8013 12.6504 6.13251C12.9623 5.46371 13.1285 4.73703 13.1382 4H14C13.9911 4.85628 13.8003 5.70103 13.4402 6.47901C13.0801 7.25699 12.5587 7.95067 11.9102 8.51468C10.6025 9.70061 8.21975 11 4.06607 11Z" fill="white"/>
                            <path d="M19 10C16.5837 10 13 8.3205 13 6H13.8368C13.8368 7.69203 16.7469 9.2838 19 9.2838V10Z" fill="white"/>
                            <path d="M19.7615 24H1.23853C0.910231 23.9994 0.595544 23.874 0.363401 23.6513C0.131258 23.4285 0.000581578 23.1265 0 22.8115V10.0653C0.00582096 7.39568 1.11428 4.83719 3.08247 2.95049C5.05066 1.06379 7.71802 0.00278779 10.5 0C13.2839 0.00279408 15.9529 1.06525 17.9214 2.95423C19.8899 4.8432 20.9971 7.4044 21 10.0758V22.8221C20.9971 23.1354 20.8653 23.435 20.6334 23.6556C20.4014 23.8762 20.0881 24 19.7615 24ZM10.5 0.844401C7.9495 0.847195 5.50429 1.82068 3.70081 3.55131C1.89733 5.28193 0.882861 7.62835 0.87995 10.0758V22.8221C0.87995 22.9133 0.917729 23.0008 0.984976 23.0654C1.05222 23.1299 1.14343 23.1662 1.23853 23.1662H19.7615C19.8566 23.1662 19.9478 23.1299 20.015 23.0654C20.0823 23.0008 20.1201 22.9133 20.1201 22.8221V10.0758C20.1171 7.62835 19.1027 5.28193 17.2992 3.55131C15.4957 1.82068 13.0505 0.847195 10.5 0.844401Z" fill="white"/>
                            <path d="M10.5 21C8.51155 20.9979 6.60516 20.2397 5.19911 18.8918C3.79306 17.5438 3.00218 15.7162 3 13.8099V10.8193H3.82418V13.8099C3.82636 15.5066 4.53041 17.1333 5.78189 18.333C7.03338 19.5328 8.73013 20.2078 10.5 20.2099C12.2699 20.2078 13.9666 19.5328 15.2181 18.333C16.4696 17.1333 17.1736 15.5066 17.1758 13.8099V9H18V13.8099C17.9978 15.7162 17.2069 17.5438 15.8009 18.8918C14.3948 20.2397 12.4885 20.9979 10.5 21Z" fill="white"/>
                            </svg>
                            </div>
                            Hair
                        </a>
                    </div> 
                </div>
                <div class="flex-grow-1 py-3 panel-items">
                    <div id="background">
                        <div class="personalize-option row">
                        <a class="d-flex align-items-center px-3 py-1 text-decoration-none text-start personalize-item" href="javascript:" data-effect="" data-type="">
                        <img class="rounded-circle personalize-image mx-4" src="https://cdn.daz3d.com/file/dazcdn/media/nfp-dashboard/important/yoda.jpg">                        <p class="m-0"><span class="personalization-name">Clinique Background<span></p>
                        </a>
                        </div>
                    </div>
                    <div id="expression" style="display:none"></div>
                    <div id="eyes" style="display:none"></div>
                    <div id="character" style="display:none"></div>
                    <div id="hair" style="display:none"></div>
                </div>
                
                <div class="download-all p-3 text-center position-relative panel-footer">
                <div class="fade-grad"></div>
                    <button id="submitPersonalization" class="submit border-0 m-auto" disabled>Apply Personalization</button>
                </div>
    `;
}

NfpPersonalizationModule.prototype.IsNftBlocked = function (nft) {
    return true;
}

NfpPersonalizationModule.prototype.Init = async function () {
    // Event deligation gone loco
    document.querySelector('body').addEventListener('click', e => {
        const { target } = e;
        if (target.closest('.personalize-item') !== null) {
            let options = document.querySelectorAll('.personalize-item');
            options.forEach(function(el,i){
                el.classList.remove('selected');
            })

            target.closest('.personalize-item').classList.add('selected');
            document.getElementById('submitPersonalization').disabled = false;
        } else if (target.closest('#submitPersonalization') !== null) {
            this.addToQueue();
        }
    });
}

NfpPersonalizationModule.prototype.Display = async function (nft) {
    return false;
}

NfpPersonalizationModule.prototype.Reset = async function () {
}

NfpPersonalizationModule.prototype.addToQueue = async function () {
    console.log('yo dog this needs added to queue');
}