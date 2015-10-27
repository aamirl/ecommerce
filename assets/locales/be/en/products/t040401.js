var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var e = require(_s_config.paths.locales + 'en/products/electronics.js');
var j = require(_s_config.paths.locales + 'en/products/jewelry.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Willis Judd, Bradford Exchange, Tiffany\'s, Urban Jewlery, Rainso, Sonia Jewels',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Primary Material',
                placeholder : '14K Yellow Gold, Stainless Steel, Leather, 24K Gold Plated, Titanium 14K Solid Gold, Sterling Silver, Zircon Diamond',
                help : 'This should reflect the primary material that this piece of jewelry is made of.'
                },
            description : {
                placeholder : 'Describe in detail the material, what it consists of, and any history for this material that pertains to this particular designer.'
                }
            },
        variation : {
            name : {
                label : 'Piece',
                placeholder : 'Italian Solid Link Bracelet, Screw Bracelet, Solid Link-Chain Necklace'
                help : 'This should reflect the final piece of jewelry and any little details that may help the consumer pick this particular piece compared to others. Do not include the length or width of the bracelet here!'
                },
            description : {
                placeholder : 'Describe this particular piece of jewelry in detail, along with any features, the materials used in it\'s composition, and any influences that played a part in designing this particular piece.'
                }
            },
        combo : {
            color : 'all',
            width : {
                label : 'Width (mm)',
                placeholder : 'Width (mm)',
                range : {
                    s: 1,
                    f: 30,
                    a : '',
                    i : 0.5
                    }  
                },
            length : {
                label : 'Length (in)',
                placeholder : 'Length (in)',
                range : {
                    s: 5,
                    f: 100,
                    a : '',
                    i : 0.5
                    }  
                }
            },
        identifiers : {
            options : ['upc','model','sku'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        clasp_dd_ : j.properties.clasp,
        stones_ddm_ : j.properties.stones,
        karat : j.properties.karat,
        warranty_dd_ : e.properties.warranty.standard,
        },
    reviews : g.reviews
    }