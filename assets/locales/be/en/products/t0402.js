var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Sperry, Nike, Adidas, Timberland, Steve Madden, Aldo, Lacoste',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Branding/Fit/Collection',
                placeholder : 'Magnuss, Bayliss, Jordans, Newport, Boss Orange, Arizona, Bushacre, Chanler, Performance Men\'s, Gel-Venture, M-Series',
                help : 'This should reflect a universal brand or collection/fit that the designer sells the shoes under. For example, for "Nike Jordans VVI", this would simply be "Jordans". For the "Aldo Mopsa Casual Loafer", this would actually just be "Casual", since that is the fit of the shoe and Aldo makes a lot of shoes under the "Casual" product line. Some may be loafers, some may be dress shoes.'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection, branding of the shoe. Explain the history of the brand if applicable, or explain the collection (such as casual) and what it means for that particular designer.'
                }
            },
        variation : {
            name : {
                label : 'Name',
                placeholder : 'Mopsa Loafer, VVI, Chukka Boots, Strikat Fashion Sneaker, H2 Water Sandal, Fashion Sneaker, 2 Desert Boot, 5 Slip-On Loafer'
                help : 'This should reflect the specific name of the shoe under the universal brand or collection/fit that the designer sells the shoes under. For example, for "Nike Jordans VVI", this would simply be "VVI". For the "Aldo Mopsa Casual Loafer", this would actually be the shoe name "Mopsa Loafer", since that is the name of the shoe under their "Casual" offerings. For some shoes it will simply be just a number, for others a model (such as New Balance)'
                },
            description : {
                placeholder : 'Describe this particular shoe when compared to other shoes under this same brand/collection/fit.'
                }
            },
        combo : {
            color : 'all',
            size : {
                label : 'Size (US)',
                placeholder : 'The size of this particular shoe in US measurements',
                defaults : {
                    1 : '6',
                    2 : '6.5',
                    3 : '7',
                    4 : '7.5',
                    5 : '8',
                    6 : '8.5',
                    7 : '9',
                    8 : '9.5',
                    9 : '10',
                    10 : '10.5'
                    11 : '11'
                    12 : '11.5'
                    13 : '12'
                    14 : '12.5'
                    15 : '13'
                    16 : '13.5'
                    17 : '14'
                    18 : '14.5'
                    19 : '15'
                    20 : '15.5'
                    21 : '16'
                    22 : '16.5'
                    23 : '17'
                    24 : '17.5'
                    }
                }
            },
        identifiers : {
            options : ['upc','collection','sku'],
            required : ['collection']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        material_dd_: g.properties.material,
        sole_dd_: g.properties.sole,
        technics_dd_: g.properties.technics,
        pattern_dd_: g.properties.pattern,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }