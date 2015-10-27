var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Calvin Klein, Kenneth Cole, Haggar, Tommy Hilfiger, Nautica, Jones New York, Cubavera',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Buttons/Style',
                placeholder : '2-Button Side Vent Stretch, 2-Button Sport, 2-Button Side Vent, 2-Button Center-Vent, 2-Button Herringbone',
                help : 'This should reflect the buttons count and a style for the court (if applicable), that is universal to all the fits and variations that are categorized under it. For example, for the "Calvin Klein Men\'s Midway Linen 2-Button Sport Coat", this would be simply "2-Button Sport".'
                },
            description : {
                placeholder : 'This is like an "About" section for the style. Explain what the style represents, any influences, and/or it\'s history (if applicable). Also, please mention any sizing issues and how the coats run in size compared to standard sizing.'
                }
            },
        variation : {
            name : {
                label : 'Fabric/Fit',
                placeholder : 'Slim Fit Linen, Midway Linen, Fitted Linen Cotton',
                help : 'This should describe the final fit and design of the style. For example, for the "Calvin Klein Men\'s Midway Linen 2-Button Sport Coat", this would be simply "Midway Linen".'
                },
            description : {
                placeholder : 'Describe what makes this particular fabric and fit different from all the other fabrics and fits found under this particular style.'
                }
            },
        combo : {
            color : 'all',
            casual_size : g.properties.size,
            chest : {
                label : 'Chest (in)',
                placeholder : 'The chest measurement of the individual',
                range : {
                    s: 20,
                    f: 60,
                    a: '',
                    i: 0.5
                    }   
                },
            waist : {
                label : 'Waist (in)',
                placeholder : 'Length around the waist',
                range : {
                    s: 7,
                    f: 20,
                    a : '',
                    i : 0.5
                    }   
                },
            shoulders : {
                label : 'Shoulders (in)',
                placeholder : 'The length when measures from the tip of one shoulder, horizontally across the back, to the tip of the other shoulder; done without stretching',
                range : {
                    s: 20,
                    f: 40,
                    a: '',
                    i: 0.5
                    }   
                },
            sleeve : {
                label : 'Sleeves (in)',
                placeholder : 'Length of the sleeves',
                range : {
                    s: 5,
                    f: 15,
                    a : '',
                    i : 0.5
                    }   
                },
            back : {
                label : 'Back (in)',
                placeholder : 'Length from back of the neck to waist/hem',
                range : {
                    s: 20,
                    f: 60,
                    a: '',
                    i: 0.5
                    }   
                },
            
            },
        identifiers : {
            options : ['upc','style','sku'],
            required : ['style']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        style_dd_ : {
            label : 'Style',
            placeholder : 'The style of the coat',
            defaults : {
                '1':'Basic Coat','2':'Basic Jacket','3':'Blazer','4':'Fleece Jacket','5':'Flight/Bomber Jacket','6':'Jean ','7':'Military','8':'Motorcycle','9':'Parka','10':'Pea Coat','11':'Poncho','12':'Puffer','13':'Rainwear','14':'Trench','15':'Varsity/Baseball','16':'Vest','17':'Windbreaker','18':'Blazer','19':'Overcoat','20':'Down Jacket'
                }
            },
        fit_dd_: g.properties.fit,
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        sleeve_dd_: g.properties.sleeve,
        pattern_dd_: g.properties.pattern,
        pocket_dd_: g.properties.pocket,
        filling_dd_ : {
            label : 'Filling Material',
            placeholder : 'The kind of material used for insulation. For example soft feathers of a duck or goose',
            defaults : {
                1 : '100% Polyester',
                2 : 'Down Feather'
                }
            }
        },
    booleans : g.booleans,
    reviews : g.reviews
    }