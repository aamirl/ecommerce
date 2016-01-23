var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var e = require(_s_config.paths.locales + 'en/products/electronics.js');
var j = require(_s_config.paths.locales + 'en/products/jewelry.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Cavalier Jewelers, King Will, AXS Jewelry, MBOX, Metal Factory',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Primary Material',
                placeholder : '14K Yellow Gold, Stainless Steel, Tungsten Carbide, Titanium, 24K Gold Plated, Titanium 14K Solid Gold, Sterling Silver, Zircon Diamond',
                help : 'This should reflect the primary material that this ring is made of.'
                },
            description : {
                placeholder : 'Describe in detail the material, what it consists of, and any history for this material that pertains to this particular designer (if applicable).'
                }
            },
        variation : {
            name : {
                label : 'Piece',
                placeholder : 'Comfort Fit Plain Wedding Band, Wedding Band, Lord Rings, Beveled Edge Wedding/Engagement Band',
                help : 'This should reflect the final type of ring and any little details that may help the consumer pick this particular ring compared to others (such as the cut of the stone used, if applicable). Do not include the size of the ring here.'
                },
            description : {
                placeholder : 'Describe this particular set of earrings in detail, along with the materials used in it\'s composition, and any influences that played a part in designing this particular piece. Do not mention any details about how many there are in a pack or set.'
                }
            },
        combo : {
            color : { label : 'Color' },
            width : {
                label : 'Width (mm)',
                placeholder : 'Width (mm)',
                defaults : {
                    1 : '2mm',
                    2 : '2.5mm',
                    3 : '3mm',
                    4 : '3.5mm',
                    5 : '4mm',
                    6 : '4.5mm',
                    7 : '5mm',
                    8 : '5.5mm',
                    9 : '6mm',
                    10 : '6.5mm',
                    11 : '7mm',
                    12 : '7.5mm',
                    13 : '8mm',
                    14 : '8.5mm',
                    15 : '9mm',
                    16 : '9.5mm',
                    17 : '10mm',
                    18 : '10.5mm',
                    19 : '11mm',
                    20 : '11.5mm',
                    21 : '12mm',
                    22 : '12.5mm',
                    23 : '13mm',
                    24 : '13.5mm',
                    25 : '14mm'
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
        style_dd_ : {
            label : 'Style',
            placeholder : 'The style of the ring in relation to the stones and their layout on the ring',
            defaults : {
                1 : 'Classic Solitaire',
                2 : 'Side Stone',
                3 : 'Halo',
                4 : 'Wedding Set',
                5 : 'Three Stone'
                }
            },
        band_style_dd_ : {
            label : 'Band Style',
            placeholder : 'The style of the ring band',
            defaults : {
                1 : 'Comfort Fit',
                2 : 'Flat Band',
                3 : 'Half Round'
                }
            },
        stones_ddm_ : j.properties.stones,
        karat : j.properties.karat,
        warranty_dd_ : e.properties.warranty.standard,
        },
    reviews : g.reviews
    }