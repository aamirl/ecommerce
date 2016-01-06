var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'American Apparel, Original Penguin, Under Armor, The North Face, Volcom, Nike, Adidas, Carhartt',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Branding/Style/Collection',
                placeholder : 'Cormorant, ',
                help : 'If this particular group of sweatshirts/hoodies are branded under a common name, use that name. Otherwise, This should reflect something about the style that is universal to all the fits and variations that are categorized under it. For example, for the "Lacoste Long Sleeve Original Cotton Pique Polo", this would be simply "Pique Polo".'
                },
            description : {
                placeholder : 'This is like an "About" section for the style. Explain what the style represents, any influences, and/or it\'s history.'
                }
            },
        variation : {
            name : {
                label : 'Fabric/Fit',
                placeholder : 'Fleece Top Pullover, Fleece Hoodie, Slim Fit Pullover Hoodie, Sueded Zipped Hoodie',
                help : 'This should describe the final fit, fabric and/or design of the style and branding.'
                },
            description : {
                placeholder : 'Describe how this particular fit, design or fabric differs from other variations under the same style/branding. Mention things like pockets, zippers and other relevant features for the hoodie.'
                }
            },
        combo : {
            color : { label : 'Color' },
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
        fit_dd_: g.properties.fit,
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        sleeve_dd_: g.properties.sleeve,
        pattern_dd_: g.properties.pattern,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }