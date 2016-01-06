var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Columbia, Ansell, Ourdoor Research, Mechanix Wear, FREETOO, Wells Lamont, Hatch, Mountain Hardwear, Arcteryx',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection/Brand/Material',
                placeholder : 'MG Series, ProjeX, Dirtpaw, CG Series, 3/4 Finger, SG Series, Suede, Leather, Ice Bay, Hydra Pro, Caden',
                help : 'If the glove belongs to a collection/brand, then please use this to specify the collection or brand. For example for a "Mechanix Wear CG40-75-012 Heavy Duty Glove, Black, XX-Large", this would be simply "CG Series". For "Glacier Glove ICE BAY Fishing Glove", this would be "ICE BAY". If the glove has no collection or brand, please just use the material the glove is made of. For "Seirus Innovation Men\'s Hyperlite All Weather Glove", this would be "Nylon". Avoid using "100%" and other percentages. Please do not use sizes or colors.'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection/material. Explain the collection/material and describe qualities that are similar to all the items sold under this collection/material.'
                }
            },
        variation : {
            name : {
                label : 'Glove Type',
                placeholder : 'Reflex Gloves, SG20P Dura-Thin Search Gloves, Driving Gloves, All-Weather Glove, Overweb Gloves',
                help : 'This is simply the type of glove. For example for a "Mechanix Wear CG40-75-012 Heavy Duty Glove, Black, XX-Large", this would be "CG Series". For "Glacier Glove ICE BAY Fishing Glove", this would be "Fishing Glove". For "Seirus Innovation Men\'s Hyperlite All Weather Glove", this would be "Hyperlite All-Weather Glove". Avoid using "100%" and other percentages. Please do not include sizes or colors in the title.'
                },
            description : {
                placeholder : 'Describe how this particular type of glove differs from other types of gloves marketed under this collection/brand or made of the same material.'
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
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        pattern_dd_: g.properties.pattern,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }