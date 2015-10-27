var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Kipling, Natico, Licenses Products, Printed Picks Company, Banpresto',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection',
                placeholder : 'Premium Guitar Pick Keyring',
                help : 'If the accessory belongs to a collection/brand, then please use this to specify the collection or brand. For example for a "Printed Picks Company The Libertines Premium Guitar Pick Keyring", this would be simply "Premium Guitar Pick Keyring". For "Banpresto Pokemon Best Wishes Figure Keychain Banpresto 2011 2" Shiny Pokabu/Tepig", this would be "Pokemon", because that is the collection under which is marketed. For "Hartmann Luggage Capital Leather Card Case", this would be "Luggage Capital". If the accessory has no collection but has a specific usage, use this. For example, for "Jack Spade Embossed Paisley Slim Card Holder Case", this would be simply "Card Case". Another example would be "Robert Graham Men\'s Perry Paisley Embossed Sliding Card Case", for which this would be "Card Case" as well. Please do not use sizes or colors.'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection/usage. Explain the collection/usage and describe qualities that are similar to all the items sold under this collection/usage.'
                }
            },
        variation : {
            name : {
                label : 'Accessory Attributes/Type',
                placeholder : 'Extra Capacity Trifold Wallet, Leather Card Case, Embossed Card Case',
                help : 'This will differ depending on whether there is a collection or a usage for the overlying group of . For example for a "Fossil Men\'s Ingram Extra Capacity Trifold Wallet", this would be simply "Extra Capacity Trifold Wallet". For "Tumi Monaco Slim Card Case", this would be "Slim Card Case", because it is marketed under the collection "Monaco". For "Hartmann Luggage Capital Leather Card Case", this would be "Leather Card Case", since this is marketed under the collection "Luggage Capital". If the accessory has no overlying collection but is marketed under a specific usage, describe the difference. For example, for "Jack Spade Embossed Paisley Slim Card Holder Case", this would be simply "Embossed Paisley Slim". Another example would be "Robert Graham Men\'s Perry Paisley Embossed Sliding Card Case", for which this would be "Embossed Sliding". Do not use sizes or colors.'
                },
            description : {
                placeholder : 'Describe how this particular type of accessory differs from other types of accessories marketed under this collection/brand or with the same usage.'
                }
            },
        combo : {
            color : 'all',
            casual_size : g.properties.size
            },
        identifiers : {
            options : ['upc','style','sku'],
            required : ['style']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        pattern_dd_: g.properties.pattern,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }