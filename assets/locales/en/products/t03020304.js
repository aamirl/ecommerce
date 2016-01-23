module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Batteries Line',
                placeholder : 'GoCharge, 3rd Gen, 2nd Gen Astro, '
                },
            description : {
                placeholder : 'Give details on what this particular product line of batteries has in common'
                }
            },
        variation : {
            name : {
                label : 'Battery',
                placeholder : 'Astro Mini, Deluxe 16000mAh Portable Charger w/iSmart Technology, Portable 3200mAh Power Bank, E3 Ultra Compact, E4'
                },
            description : {
                placeholder : 'Describe the battery, any specifications, and any details about which devices it can be used with, exceptions, capacity, and size'
                }
            },
        combo : {
            color : { label : 'Color' },
            length : {
                label : 'Length',
                placeholder : 'Length',
                range : {
                    s: 1,
                    f: 15,
                    a : '',
                    i : 0.5
                    }   
                },
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        brand_ddm_ : {
            label : 'Compatibility',
            help : 'The phone brand which this charger is to be used with',
            defaults  : {
                "1":"iPhone","2":"Samsung","3":"LG","4":"Motorola","5":"Nokia","6":"BlackBerry","7":"Kyocera","8":"Palm","9":"Sony","10":"HTC","11":"Dell","12":"HP","13":"Pantech","14":"Nextel","15":"Huawel"
                }
            },
        charge_time: {
            label: 'Charge Time (hours)',
            help: 'How long does it take to charge this battery completely from no charge?',
            validate : 'decimal'
            },
        standby_time: {
            label: 'Standby Time (hours)',
            help: 'How long can this battery stay while the device is on standby?',
            validate : 'decimal'
            },
        battery_type_nr_dd_: {
            label: 'Battery Type',
            help: 'What kind of battery is this?',
            defaults : {
                1 : "Flow battery"
                2 : "Vanadium redox battery"
                3 : "Zinc–bromine battery"
                4 : "Zinc–cerium battery"
                5 : "Fuel cell"
                6 : "Lead–acid battery"
                7 : "Deep cycle battery"
                8 : "VRLA battery"
                9 : "AGM battery"
                10 : "Gel battery"
                11 : "Lithium air battery"
                12 : "Lithium-ion battery"
                13 : "Beltway battery"
                14 : "Lithium ion manganese oxide battery (IMR)"
                15 : "Lithium ion polymer battery"
                16 : "Lithium iron phosphate battery"
                17 : "Lithium–sulfur battery"
                18 : "Lithium–titanate battery"
                19 : "Molten salt battery"
                20 : "Nickel–cadmium battery"
                21 : "Nickel–cadmium battery vented cell type"
                22 : "Nickel hydrogen battery"
                23 : "Nickel–iron battery"
                24 : "Nickel metal hydride battery"
                25 : "Low self-discharge NiMH battery"
                26 : "Nickel–zinc battery"
                27 : "Organic radical battery"
                28 : "Polymer-based battery"
                29 : "Polysulfide bromide battery"
                30 : "Potassium-ion battery"
                31 : "Rechargeable alkaline battery"
                32 : "Rechargeable fuel battery"
                33 : "Silicon air battery"
                34 : "Silver-zinc battery"
                35 : "Silver calcium battery"
                36 : "Sodium-ion battery"
                37 : "Sodium–sulfur battery"
                38 : "Sugar battery"
                39 : "Super iron battery"
                40 : "UltraBattery"
                }
            },
        }
    }