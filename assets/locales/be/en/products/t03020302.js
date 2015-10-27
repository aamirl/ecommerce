module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Cases Line',
                placeholder : 'Ultra Armor, Tough Armor, Defender, Commuter, Supcase, Fre Series, Guardian Series, Euphoria Series; This is the line of cases under which other similar cases are also branded and marketed'
                },
            description : {
                placeholder : 'Give details on what this particular line of cases features and what customers can look forward to when seeing cases under this product line'
                }
            },
        variation : {
            name : {
                label : 'Case',
                placeholder : 'Universal Waterproof Case, iPhone 6 Case'
                },
            description : {
                placeholder : 'Describe what makes this particular case appealing to customers, along with any warranties included with the product, special features for this case and other pertinent information'
                }
            },
        combo : {
            color : 'all'
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        brand_dd_ : {
            label : 'Compatibility',
            help : 'The phone brand which this case is to be used with',
            defaults  : {
                1 : 'iPhone 6',
                2 : 'iPhone 6 Plus',
                3 : 'iPhone 5/5S',
                4 : 'iPhone 5C',
                5 : 'iPhone 4/4S',
                6 : 'iPhone 3/3S',
                7 : 'Samsung Galaxy S6',
                8 : 'Samsung Galaxy S6 Edge',
                9 : 'Samsung Galaxy S5',
                10 : 'Samsung Galaxy S4',
                11 : 'Samsung Galaxy Note 4',
                12 : 'Samsung Galaxy 3',
                13 : 'Samsung Galaxy 2',
                14 : 'LG G3',
                15 : 'Nokia Lumia'
                }
            },
        material_dd_ : {
            label : 'Material',
            help : 'The material used to make this case',
            defaults : {
                "1":"Canvas","2":"Cotton","3":"Leather","4":"Metal","5":"Neoprene","6":"Nylon","7":"Plastic ","8":"Polyester","9":"Silicone/Gel/Rubber","10":"Suede","11":"Synthetic Leather","12":"Synthetic Suede","13":"Velvet","14":"Vinyl","15":"Wool","16":"Rubberized Hard Case"
                }
            }
        }
    }