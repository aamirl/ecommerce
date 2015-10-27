var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var e = require(_s_config.paths.locales + 'en/products/electronics.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Suunto, Luminox, Rolex, Skaagen, Cartier, Casio',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Branding/Collection',
                placeholder : '3050 Series, Core Series, G Shock',
                help : 'This should reflect the universal branding or collection that the designer uses to sell a particular set of watches. This is not the model number of the watch, but instead the collection that the watch strap would belong to. For example, for the "Invicta Men\'s 8926OB Pro Diver Stainless Steel Automatic Watch", this would be simply "Pro Diver". Likewise, for "Fossil Men\'s JR1354 Nate Stainless Steel Chronograph Watch", this would be simply "Nate". If there is no overlying collection, just use the series of the model of the watch.'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection/brand that the watch belongs to. Explain the history of this collection and what it represents for that particular designer. Include information applicable to all watches marketed under this collection/brand.'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'JR1354, Standard'
                help : 'This should reflect either the model/number of a particular watch that the strap fits, or a standard size that fits all the models under this collection. For example, for the "Invicta Men\'s 8926OB Pro Diver Stainless Steel Automatic Watch", this would be simply "8926OB". Likewise, if the strap fits all watches under the "Fossil Men\'s Nate" collection, this would be simply "Standard".'
                },
            description : {
                placeholder : 'Describe this particular strap when compared to other straps in this brand/collection. Mention material composition, strap features, warranties, and any other information you think would be important.'
                }
            },
        combo : {
            color : 'all'
            },
        identifiers : {
            options : ['upc','model','sku'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        clasp_dd_ : g.properties.watch.clasp,
        material_dd_: g.properties.material,
        labor_dd_ : e.properties.warranty.labor,
        parts_dd_ : e.properties.warranty.parts
        },
    booleans : [
        'washable_attr_',
        ],
    reviews : g.reviews
    }