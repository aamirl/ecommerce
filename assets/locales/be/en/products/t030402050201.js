var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            placeholder : 'Insignia, Dynex, Rocketfish',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'End 1',
                placeholder : 'HDMI, DVI-D, DVI, VGA, DisplayPort, USB',
                help : 'Pick one end of the cable. For example, if it is a DVI-D-to-HDMI cable, please select DVI-D here. If it is a simple HDMI-to-HDMI cable, input HDMI.'
                },
            description : {
                placeholder : 'Give details on what this end of the cable is input into. For example, if the chosen name for one end was HDMI, explain what kinds of devices the HDMI cable can be used with, what HDMI is, the bandwidth of the cable, etc.'
                }
            },
        variation : {
            name : {
                label : 'End 2',
                placeholder : 'HDMI, DVI-D, DVI, VGA, DisplayPort, USB',
                help : 'This is the name of the second end of the cable. For example, if it is a DVI-D-to-HDMI cable, please select HDMI here. If it is a simple HDMI-to-HDMI cable, input HDMI again.'
                },
            description : {
                placeholder : 'Give details on what this entire cable can be used with, given both ends of the cable. Explain what kinds of devices the cable can be used with, the bandwidth of the cable, any any other relevant information for the cable'
                }
            },
        combo : {
            color : 'all',
            size : {
                label : 'Length',
                help : 'Length of the cable (in your current chosen unit system)',
                validate : 'dimension',
                range : {
                    s: 1,
                    f: 40,
                    a : '',
                    i : 0.1,
                    }  
                }
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        year_dd_ : g.properties.year,
        end1_dd_ : {
            label : 'End 1',
            placeholder : 'End 1 of the cable',
            defaults : {
                1 : 'HDMI',
                2 : 'VGA',
                3 : 'DVI',
                4 : 'DVI-D',
                5 : 'DVI-I'
                6 : 'SDI',
                7 : 'DiiVA',
                8 : 'HDBaseT',
                9 : 'CoaXPress',
                10 : 'MHL (Mobile High-Definition Link)',
                11 : 'Composite',
                12 : 'SCART',
                13 : 'S-Video',
                14 : 'CGA',
                15 : 'MDA',
                16 : 'HGC',
                17 : 'EGA',
                18 : 'Amiga Video',
                19 : 'VGA',
                20 : 'OpenLDI',
                21 : 'YPbPr',
                22 : 'USB'
                }
            },
        end1_dd_ : {
            label : 'End 2',
            placeholder : 'End 2 of the cable',
            defaults : {
                1 : 'HDMI',
                2 : 'VGA',
                3 : 'DVI',
                4 : 'DVI-D',
                5 : 'DVI-I'
                6 : 'SDI',
                7 : 'DiiVA',
                8 : 'HDBaseT',
                9 : 'CoaXPress',
                10 : 'MHL (Mobile High-Definition Link)',
                11 : 'Composite',
                12 : 'SCART',
                13 : 'S-Video',
                14 : 'CGA',
                15 : 'MDA',
                16 : 'HGC',
                17 : 'EGA',
                18 : 'Amiga Video',
                19 : 'VGA',
                20 : 'OpenLDI',
                21 : 'YPbPr',
                22 : 'USB'
                }
            }
        epeat_dd_ : g.properties.epeat,
        warranty_parts_dd_ : g.properties.warranty.labor,
        warranty_labor_dd_ : g.properties.warranty.parts
        },
    booleans : [
        'inwall_rated_attr_'
        ],
    reviews : g.reviews
    }