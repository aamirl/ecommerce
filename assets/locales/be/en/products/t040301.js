var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var e = require(_s_config.paths.locales + 'en/products/electronics.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Rolex, Casio, Seiko, Samsung, Apple, Timex, Michael Kors, ASUS, Breitling, Omega, Fossil, Tag Heuer, Cartier',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Branding/Collection',
                placeholder : 'Watch, 5, Expedition, G-Shock, Eco-Drive, Ironman, G-Series, Pro Diver, St. Andrews, G-Watch, Nate',
                help : 'This should reflect a universal branding or collection that the designer uses to sell a particular set of watches. This is not the model number of the watch, but instead the collection that the watch belongs to. For example, for the "Invicta Men\'s 8926OB Pro Diver Stainless Steel Automatic Watch", this would be simply "Pro Diver". Likewise, for "Fossil Men\'s JR1354 Nate Stainless Steel Chronograph Watch", this would be simply "Nate". If there is no overlying collection, just use the series of the model of the watch.'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection/brand that the watch belongs to. Explain the history of this collection and what it represents for that particular designer. Include information applicable to all watches marketed under this collection/brand.'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'JR1354, DW9052-1V, SKS415, 8932'
                help : 'This should reflect the model/number of the watch in this particular collection. For example, for the "Invicta Men\'s 8926OB Pro Diver Stainless Steel Automatic Watch", this would be simply "8926OB". Likewise, for "Fossil Men\'s JR1354 Nate Stainless Steel Chronograph Watch", this would be simply "JR1354".'
                },
            description : {
                placeholder : 'Describe this particular model when compared to other models in this brand/collection. Mention additional features, smart watch capabilities, warranties, waterproof depths and other information customers would find useful.'
                }
            },
        combo : {
            color : 'all',
            shape : {
                label : 'Compatibility (Smart)',
                placeholder : 'Compatibility of this smart watch',
                defaults : {
                    1 : 'Not Applicable',
                    2 : 'Apple iPhone',
                    3 : 'Android Devices/Phones',
                    }
                },
            },
        identifiers : {
            options : ['upc','model','sku'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        shape_dd_ : {
            label : 'Shape',
            placeholder : 'Shape of the watch head',
            defaults : {
                1 : 'Circle/Round',
                2 : 'Square',
                3 : 'Octagonal',
                4 : 'Oval'
                }
            },
        dial_dd_ : {
            label : 'Dial Window Material',
            placeholder : 'The covering of the watch dial. Acrylic, mineral, and sapphire are the three types of crystals commonly used in watches. Acrylic crystal is an inexpensive plastic that allows shallow scratches to be buffed out. Mineral crystal is composed of several elements that are heat-treated to create an unusual hardness that helps resist scratches. Sapphire is the most expensive and durable crystal, approximately three times harder than mineral crystals and 20 times harder than acrylic crystals.',
            defaults : {
                1 : 'Plexiglass',
                2 : 'Acrylic',
                3 : 'Mineral (Glass)',
                4 : 'Sapphire',
                5 : 'Other Plastic'
                }
            },
        clasp_dd_ : g.properties.watch.clasp,
        material_dd_: g.properties.material,
        labor_dd_ : e.properties.warranty.labor,
        parts_dd_ : e.properties.warranty.parts
        },
    booleans : [
        '_attr_eco_friendly',
        '_attr_waterproof',
        'washable_attr_',
        'smartwatch_attr_',
        ],
    reviews : g.reviews
    }