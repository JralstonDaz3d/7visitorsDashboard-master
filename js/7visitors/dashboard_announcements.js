
function NfpAnnouncementsModule(ui, enabled) {
    this.cachedStatus = {};
    this.options = {};
    this.ui = ui;
    this.enabled = true; //enabled;
    this.expandedAnnouncement = null;
   
    // some sample data
    this.announcements = [
        {date:'June 22, 2022', title:'Announcement Title 1',description:'Announcement 1 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.', expanded:'false'},
        {date:'June 23, 2022', title:'Announcement Title 2',description:'Announcement 2 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 24, 2022', title:'Announcement Title 3',description:'Announcement 3 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 25, 2022', title:'Announcement Title 4',description:'Announcement 4 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 26, 2022', title:'Announcement Title 5',description:'Announcement 5 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 27, 2022', title:'Announcement Title 6',description:'Announcement 6 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},

        {date:'June 22, 2022', title:'Announcement Title 1',description:'Announcement 1 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 23, 2022', title:'Announcement Title 2',description:'Announcement 2 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 24, 2022', title:'Announcement Title 3',description:'Announcement 3 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 25, 2022', title:'Announcement Title 4',description:'Announcement 4 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 26, 2022', title:'Announcement Title 5',description:'Announcement 5 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
        {date:'June 27, 2022', title:'Announcement Title 6',description:'Announcement 6 description text goes here. Lorem ipsum dolres et mina wil dronor. Ment gallos verbi melor kim quoata. Lorem ipsum dolres et simna halede an met kolarre.',expanded:'false'},
    ];

    this.name = "announcements";
    this.label = "Anouncements";
    this.icon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_37_182)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.4595 3.34465C31.1287 2.11109 30.2006 1.12728 28.9906 0.723963C27.7807 0.32065 26.4476 0.553525 25.4452 1.34159C19.9811 5.63628 9.00726 14.2611 9.00726 14.2611C8.60901 14.575 8.4352 15.0947 8.56683 15.5841L11.9317 28.1408C12.0616 28.6301 12.4717 28.9947 12.9729 29.0655C12.9729 29.0655 26.7901 31.0483 33.6701 32.0355C34.9323 32.2178 36.2013 31.752 37.0485 30.7969C37.8956 29.8435 38.2061 28.5272 37.877 27.2953C36.2587 21.2608 33.0761 9.37915 31.4595 3.34465ZM29.0143 3.9994C30.6309 10.0339 33.8135 21.9156 35.4318 27.9501C35.5415 28.3601 35.4386 28.7989 35.1551 29.1178C34.8733 29.4351 34.4497 29.5903 34.0295 29.5296L14.1592 26.6794L11.228 15.736L27.0095 3.33115C27.3436 3.06959 27.7875 2.99196 28.1908 3.12528C28.5941 3.26028 28.9029 3.58765 29.0143 3.9994Z" fill="#CF1C77"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.012 14.9293C10.8298 14.2543 10.1362 13.8527 9.46122 14.0332C9.46122 14.0332 6.31066 14.8787 3.74397 15.5655C2.55428 15.8844 1.54009 16.6623 0.925843 17.7288C0.309906 18.7937 0.142843 20.061 0.461781 21.249C0.959593 23.1069 1.58059 25.4289 2.07841 27.2868C2.39734 28.4748 3.17528 29.489 4.24178 30.1033C5.30659 30.7192 6.57391 30.8863 7.76359 30.5673C10.3303 29.8788 13.4808 29.0351 13.4808 29.0351C14.1558 28.8545 14.5575 28.161 14.3752 27.486L11.012 14.9293ZM8.89422 16.8058L11.6027 26.9173L7.10716 28.1222C6.56716 28.2673 5.99172 28.1913 5.50741 27.9112C5.02309 27.6328 4.66872 27.1721 4.52359 26.6304L2.90697 20.5942C2.76184 20.0542 2.83778 19.4788 3.11791 18.9945C3.39634 18.5102 3.85872 18.1558 4.39872 18.0107L8.89422 16.8058Z" fill="#CF1C77"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4197 26.8599C14.9978 26.7991 14.5743 26.9544 14.2925 27.2716C14.0106 27.5906 13.906 28.0293 14.0174 28.4394L15.688 34.6781C15.8585 35.3126 16.4845 35.7108 17.1325 35.5961C17.2996 35.5674 17.4666 35.5303 17.6354 35.4847C20.651 34.6764 22.5005 31.6828 21.9402 28.6638C21.8406 28.1306 21.412 27.7188 20.8754 27.6429L15.4197 26.8599ZM17.7822 32.7105L16.9587 29.6375L19.4984 30.002C19.414 31.1259 18.7711 32.1502 17.7822 32.7105Z" fill="#CF1C77"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4608 27.7846C16.3309 27.2953 15.9208 26.9308 15.4196 26.8599L13.3339 26.5595C13.1634 26.5359 12.9913 26.546 12.8259 26.5899L8.4182 27.7711C8.06888 27.8656 7.77695 28.1036 7.61495 28.4259C7.45295 28.7499 7.43607 29.1262 7.57107 29.462C7.57107 29.462 10.428 36.6339 11.8809 40.2856C12.5914 42.0693 14.5253 43.0396 16.3798 42.5418C18.4605 41.985 19.6941 39.8469 19.1372 37.7679L16.4608 27.7846ZM14.2333 29.246L16.692 38.4226C16.8878 39.1516 16.4541 39.9009 15.7251 40.0966C15.1091 40.262 14.4679 39.9414 14.2333 39.3491L10.4483 29.8485L13.2309 29.1026L14.2333 29.246Z" fill="#CF1C77"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M44.6271 11.7788L39.7317 13.0917C39.0567 13.2723 38.6567 13.9658 38.8373 14.6408C39.0179 15.3158 39.7131 15.7175 40.3864 15.5352L45.2819 14.224C45.9569 14.0435 46.3585 13.3482 46.1779 12.6749C45.9957 11.9999 45.3021 11.5983 44.6271 11.7788Z" fill="#CF1C77"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M39.7095 2.58533L35.6359 5.5992C35.074 6.01601 34.9558 6.80914 35.371 7.36939C35.7861 7.93133 36.5792 8.05114 37.1412 7.63433L41.2148 4.62045C41.7767 4.20533 41.8948 3.4122 41.4797 2.85026C41.0646 2.29001 40.2715 2.1702 39.7095 2.58533Z" fill="#CF1C77"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M45.7727 22.1739L40.7474 21.5208C40.0538 21.4314 39.4193 21.9207 39.3282 22.6143C39.2387 23.3062 39.7281 23.9424 40.4217 24.0318L45.447 24.6832C46.1389 24.7726 46.7751 24.2832 46.8645 23.5914C46.954 22.8978 46.4646 22.2633 45.7727 22.1739Z" fill="#CF1C77"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_37_182">
                            <rect width="40" height="40"></rect>
                        </clipPath>
                    </defs>
                </svg>`;
    this.panel = `
                <h4 class="text-center fw-lighter my-3 panel-head">
                    Announcements
                </h4>
                <!-- Loop through announcements -->                
                `;
}

NfpAnnouncementsModule.prototype.Init = async function () {
    this.initListeners();
    this.Display();
}

NfpAnnouncementsModule.prototype.Display = async function () {
    if (!this.enabled) {
        return;
    }
   
    this.expandedAnnouncement = null;
    dashboard_announcements.innerHTML = "";
    for (let i in this.announcements) {        
        this.addAnnouncement(i, this.announcements[i]);
    }
}

NfpAnnouncementsModule.prototype.addAnnouncement = async function (index, announcement) {   
    const descriptionShort = announcement.description.substring(0, 99);
    const descriptionLong = announcement.description.substring(99,);
    const div = document.createElement("div");    
    div.classList.add('flex-grow', 'p-3', 'panel-items', 'text-start');
    div.innerHTML = `
                    <div id="announcement-${index}" class="panel-item text-start">
                        <p class="mb-1" style="font-size: small;">${announcement.date}</p>
                        <h5 class="fw-bold">${announcement.title}</h5>
                        <p style="font-size: small;">${descriptionShort}<span id="points-${index}">...</span> <span id="moreText-${index}">${descriptionLong}</span></p>
                        <button class="btn-more text-uppercase" id="buttonText-${index}" onclick="toggleText(${index})">More ></button>
                        <hr class="mb-0">
                    </div>
                    <style>
                    #moreText-${index} {
                        display: none;
                    }
                    </style>
                    `;
    const button = document.getElementById("buttonText-" + index);  
    //button.addEventListener('click', (e) => this.expandAnnouncement(e));
    dashboard_announcements.append(div);
}

NfpAnnouncementsModule.prototype.toggleText = async function (index) {
    var points = document.getElementById("points-" + index);
    var showMoreText = document.getElementById("moreText-" + index);
    var buttonText = document.getElementById("buttonText-" + index);

    if (points.style.display === "none") {
      showMoreText.style.display = "none";
      points.style.display = "inline";
      buttonText.innerHTML = 'More >';
    }
    else {
      showMoreText.style.display = "inline";
      points.style.display = "none";
      buttonText.innerHTML = '< Less';
    }
}

NfpAnnouncementsModule.prototype.Reset = async function () {
    dashboard_announcements.innerHTML = "";
}

NfpAnnouncementsModule.prototype.initListeners = function () {
    /*
    document.querySelector('.images-download-all').addEventListener('click', async e => {
        await this.download('thumbs');
    })   
    */
}
