window.nfpConfig = {
    baseUrl : "http://localhost:7080",
    network: "Internal",
    walletConnect : {
        infuraId: "ac09d5abb9154f3ba86442116998be8f",
    },
    contracts: {
        list: {
            /*
            "0x412055fff05693929ee1e6d1f3550f7e2277799e": {
                name: "NFP Gen1",
                image: "https://nftcdn.daz3d.com/nfp/gen1/i/",
                thumb: "https://nftcdn.daz3d.com/nfp/gen1/t/",
                init: true,
            },
            "0x9ef7b6543fd3cd02fcf71f53b408c7a7d88b5cb9": {
                name: "Champion x NFP",
                types: {
                    1: {
                        name: "Champion x NFP - Bronze",
                        image: "https://nftcdn.daz3d.com/nfp/champion/gen1/bronze_revealed.png",
                        thumb: "https://nftcdn.daz3d.com/nfp/champion/gen1/bronze_revealed.png",
                    },
                    2: {
                        name: "Champion x NFP - Silver",
                        image: "https://nftcdn.daz3d.com/nfp/champion/gen1/silver_revealed.png",
                        thumb: "https://nftcdn.daz3d.com/nfp/champion/gen1/silver_revealed.png",
                    },
                    3: {
                        name: "Champion x NFP - Gold",
                        image: "https://nftcdn.daz3d.com/nfp/champion/gen1/gold_revealed.png",
                        thumb: "https://nftcdn.daz3d.com/nfp/champion/gen1/gold_revealed.png",
                    },
                },
                init: false,
            },
            "0xfec2cd127fdea4eab16646bad7557ed990072ac9": {
                name: "Daz Generic Upgrade",
                tokens: {
                    1: {
                        name: "Diamond Hands",
                        image: "https://nftcdn.daz3d.com/nfp/upgrades/diamondhands/potion.png",
                        thumb: "https://nftcdn.daz3d.com/nfp/upgrades/diamondhands/potion.png"
                    },
                    2: {
                        name: "Louis Moinet",
                        image: "https://nftcdn.daz3d.com/nfp/upgrades/lm/watch.jpg",
                        thumb: "https://nftcdn.daz3d.com/nfp/upgrades/lm/watch.jpg"
                    },
                },
                init: false,
            }
            */
        }
    },
    proxies: {
        list: {
            /*
            "0x659ec418b8f83334127371dbad66d88f2fc8a417": {
                name: "Champion x NFP",
                contractName: 'UpgradeProxy721',
                type: 721,
                types: { '0x412055fff05693929ee1e6d1f3550f7e2277799e' : [1,2,3] },
                tokenTypes: [1,1,1,1,1,2,1,1,1,1,2,1,3,3,1,1,1,2,1,2,1,1,2,1,1,1,1,3,1,1,1,1,1,3,1,3,1,2,1,1,3,2,1,1,1,1,1,1,1,1,1,1,1,2,3,2,3,1,1,1,1,1,2,3,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,2,1,1,1,1,2,3,1,1,3,1,1,1,1,3,1,1,2,3,1,1,1,3,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,3,1,3,1,1,1,1,1,2,1,1,1,2,1,2,1,3,1,1,1,1,2,3,1,3,2,1,1,1,1,1,1,1,3,1,3,3,1,3,1,1,1,1,3,1,2,2,1,1,1,3,1,1,1,1,1,1,1,2,1,1,3,1,2,1,2,1,3,1,1,1,1,2,2,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,3,1,2,1,1,1,2,1,1,3,3,1,3,2,1,1,1,1,1,1,1,3,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,3,1,1,3,2,2,1,1,1,1,1,1,2,1,2,1,2,1,3,1,1,2,2,1,1,3,1,1,1,1,1,1,2,3,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,3,1,3,1,1,1,1,3,1,1,1,3,1,3,1,1,1,2,1,1,2,1,3,1,1,2,1,1,1,1,2,1,1,1,3,1,1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,1,1,1,2,1,1,1,1,1,1,3,1,1,1,2,2,1,1,1,2,1,1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,2,2,2,1,2,1,3,1,2,1,1,1,1,1,2,1,3,2,1,1,1,1,1,1,1,1,1,2,3,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,3,1,1,1,1,1,1,2,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,3,1,1,1,1,2,1,1,1,1,2,1,3,1,1,1,1,1,1,1,1,1,2,1,1,1,3,1,1,3,1,1,1,1,1,1,1,1,2,1,3,1,2,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,2,1,1,1,2,1,1,1,1,3,1,2,2,1,1,1,1,1,1,1,3,1,1,1,3,3,1,1,1,2,1,3,1,1,3,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3,1,1,1,2,1,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,3,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,2,1,1,1,3,1,2,1,1,1,1,1,1,1,2,1,2,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,3,1,1,1,1,1,1,2,1,3,1,2,2,2,1,1,1,1,1,2,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,3,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,3,2,1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,3,1,1,1,1,1,3,3,1,1,1,1,3,1,3,1,1,2,1],

            },
            "0xed0c7d2b75e40e74191f0e2f61ac744bd602236f": {
                name: "Daz Generic Upgrade",
                contractName: 'UpgradeProxy1155',
                type: 1155,
                types: { '0x412055fff05693929ee1e6d1f3550f7e2277799e' : [1,2] },
            },
            */
        }
    },
    aggregator: {
        enabled: true,
        address: '0x95A7fc3bF7A981be3Af582fdFdca0C59851475E0',
        contractName: "UpgradeAggregator"
    },
    modules: [
        /*{
            module: NfpUpgradeModule,
            enabled: false
        },
        {
            module: NfpPersonalizationModule,
            enabled: false
        },*/
        {
            module: Nfp3dModelModule,
            enabled: true
        },
        {
            module: NfpImageModule,
            enabled: true
        },
        {
            module: NfpAnnouncementsModule, //added for 7visitors
            enabled: true
        }
    ]
}

