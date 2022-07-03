window.nfpConfig = {
    baseUrl : "http://localhost:7080",
    network: "MainNet",
    walletConnect : {
        infuraId: "ac09d5abb9154f3ba86442116998be8f",
    },
    contracts: {
        list: {
            "0x92133e21fff525b16d1edcf78be82297d25d1154": {
                name: "NFP",
                image: "https://nftcdn.daz3d.com/nfp/gen1/i/",
                thumb: "https://nftcdn.daz3d.com/nfp/gen1/t/",
                init: true,
            },
            "0xc3c31782cfac9563ba65f332bbe3100020ad81b6": {
                name: "Daz Generic Upgrade",
                tokens: {
                    1: {
                        name: "Diamond Hands",
                        image: "https://nftcdn.daz3d.com/nfp/upgrades/diamondhands/potion.png",
                        thumb: "https://nftcdn.daz3d.com/nfp/upgrades/diamondhands/potion.png"
                    },
                    2: {
                        name: "Louis Moinet Space Revolution Watch",
                        image: "https://nftcdn.daz3d.com/nfp/upgrades/lm/watch.jpg",
                        thumb: "https://nftcdn.daz3d.com/nfp/upgrades/lm/watch.jpg"
                    },
                },
                init: false,
            },
            "0xfed364dd70217782b01971d6c3993d99663ec239": {
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
        }
    },
    proxies: {
        list: {
            "0x9b7ce32900e3857bfaac4cd64c584a1f33b1b027": {
                name: "Daz Generic Upgrade",
                contractName: 'UpgradeProxy1155',
                type: 1155,
                types: { '0x92133e21fff525b16d1edcf78be82297d25d1154' : [1,2] }
            },
            "0x1f1062b11c118d84c835f9e117c44456d38c6d58" : {
                name: "Champion x NFP",
                contractName: 'UpgradeProxy721',
                type: 721,
                types: { '0x92133e21fff525b16d1edcf78be82297d25d1154' : [1,2,3] },
                tokenTypes: [1,1,1,1,1,2,1,1,1,1,2,1,3,3,1,1,1,2,1,2,1,1,2,1,1,1,1,3,1,1,1,1,1,3,1,3,1,2,1,1,3,2,1,1,1,1,1,1,1,1,1,1,1,2,3,2,3,1,1,1,1,1,2,3,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,2,1,1,1,1,2,3,1,1,3,1,1,1,1,3,1,1,2,3,1,1,1,3,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,3,1,3,1,1,1,1,1,2,1,1,1,2,1,2,1,3,1,1,1,1,2,3,1,3,2,1,1,1,1,1,1,1,3,1,3,3,1,3,1,1,1,1,3,1,2,2,1,1,1,3,1,1,1,1,1,1,1,2,1,1,3,1,2,1,2,1,3,1,1,1,1,2,2,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,3,1,2,1,1,1,2,1,1,3,3,1,3,2,1,1,1,1,1,1,1,3,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,3,1,1,3,2,2,1,1,1,1,1,1,2,1,2,1,2,1,3,1,1,2,2,1,1,3,1,1,1,1,1,1,2,3,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1,3,1,1,1,1,1,1,1,3,1,3,1,1,1,1,3,1,1,1,3,1,3,1,1,1,2,1,1,2,1,3,1,1,2,1,1,1,1,2,1,1,1,3,1,1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,1,1,1,2,1,1,1,1,1,1,3,1,1,1,2,2,1,1,1,2,1,1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,2,2,2,1,2,1,3,1,2,1,1,1,1,1,2,1,3,2,1,1,1,1,1,1,1,1,1,2,3,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,3,1,1,1,1,1,1,2,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,3,1,1,1,1,2,1,1,1,1,2,1,3,1,1,1,1,1,1,1,1,1,2,1,1,1,3,1,1,3,1,1,1,1,1,1,1,1,2,1,3,1,2,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,2,1,1,1,2,1,1,1,1,3,1,2,2,1,1,1,1,1,1,1,3,1,1,1,3,3,1,1,1,2,1,3,1,1,3,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3,1,1,1,2,1,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,3,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,2,1,1,1,3,1,2,1,1,1,1,1,1,1,2,1,2,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,3,1,1,1,1,1,1,2,1,3,1,2,2,2,1,1,1,1,1,2,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,3,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,3,2,1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,3,1,1,1,1,1,3,3,1,1,1,1,3,1,3,1,1,2,1],
            }
        }
    },
    aggregator: {
        enabled: true,
        address: '0x110827c233bb6e98ae770b884e92806adc5271d7',
        contractName: 'UpgradeAggregator'
    },
    modules: [
        {
            module: NfpUpgradeModule,
            enabled: true
        },
        {
            module: NfpPersonalizationModule,
            enabled: false
        },
        {
            module: Nfp3dModelModule,
            enabled: true
        },
        {
            module: NfpImageModule,
            enabled: true
        }
    ]
}
