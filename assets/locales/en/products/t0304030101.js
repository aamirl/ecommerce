var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            placeholder : 'Samsung, MyDigitalSSD, Akitio, Transcend, Oyen Digital, Plextor, Western Digital, Toshiba, Lacie, Seagate',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Drive Series',
                placeholder : 'Shadow, Shadow Mini, Evo Series, Canvio, M6M, Rugged, BP4',
                help : 'This should only reflect the brand/product line for this particular group of drives'
                },
            description : {
                placeholder : 'Give details on what this product line of drives have in common; describe the history, the popularity, basic features and any other pertinent information that applies to all drives organized and marketed under this particular series'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'U32, USB 3.0 SSD, 845DC',
                help : 'This reflects the base model of the drive; the only difference between final models will be the disk space. Do not include descriptors here such as "Disk Drive". Sometimes the base model is hard to find, for example the Samsung MZ-7GE240EW SSD actually has a base model of 845DC, which is not mentioned in the name of the drive.'
                },
            description : {
                placeholder : 'Describe any warranty terms, special features, inputs, outputs, data exchange speed, included cables, etc. that is important for the consumer to know about this particular drive that applies to all the models under this particular grouping.'
                }
            },
        combo : {
            color : { label : 'Color' },
            disk_space_dd_ : {
                label : 'Drive Space (TB)',
                placeholder : 'Amount of disk drive space in this drive',
                range : {
                    s: 0,
                    f: 30,
                    a : '',
                    i : 0.5
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
        internal_external_dd_ : g.properties.internal,
        max_rate : {
            label : 'Maximum Transfer Rate (Mbps)',
            placeholder : 'Maximum data transfer rate of the drive in megabytes per second',
            validate : 'decimal'
            },
        rotation_speed_nr_ : {
            label : 'Roration Speed (rpm)',
            placeholder : 'Rotational speed in revolutions per minute',
            validate : 'decimal'
            },
        year_dd_ : g.properties.year,
        epeat_dd_ : g.properties.epeat,
        warranty_parts_dd_ : g.properties.warranty.labor,
        warranty_labor_dd_ : g.properties.warranty.parts
        },
    booleans : [
        'usb3_attr_',
        'usb2_attr_',
        'carry_on_size_attr_',
        'energy_star_qualified_attr_',
        'fingerprint_reader_attr_',
        'usb_powered_attr_'
        ],
    reviews : g.reviews
    }