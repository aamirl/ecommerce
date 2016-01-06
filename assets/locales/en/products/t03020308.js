module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Memory Card Branding',
                placeholder : 'Ultra, Evo, Turbo Performance, PRO, Extreme Plus, Professional'
                },
            description : {
                placeholder : 'Give details on what this particular product line of microSD cards have in common under this product line/branding'
                }
            },
        variation : {
            name : {
                label : 'Card Descriptor',
                placeholder : '128GB Micro SDXC, 8GB microSDHC Class 4, 32GB Class 10 Micro SDHC R40'
                },
            description : {
                placeholder : 'Describe any warranty terms, capacity, class, read speed, included adapters, etc. for this microSD card'
                }
            },
        combo : {
            color : { label : 'Color' }
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        memory_capacity_dd_ : {
            label : 'Capacity (GB)',
            help : 'The memory capacity of the SD card',
            defaults  : {
                "1":"2GB","2":"4GB","3":"8GB","4":"16GB","5":"32GB","6":"64GB","7":"128GB","8":"256GB","9":"512GB","8":"1TB","9":"2TB"
                }
            },
        speed_dd_ : {
            label : 'Speed',
            help : 'The speed of the card',
            defaults  : {
                "1":"Class 2","2":"Class 4","3":"Class 6","4":"Class 8","5":"Class 10","6":'Class 12'
                }
            }
        }
    }