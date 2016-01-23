var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            placeholder : 'Apple, Toshiba, Sony, Microsoft, Samsung, Google, Asus',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Tablet Brand',
                placeholder : 'Surface, iPad, Encore, Galaxy Tab, Galaxy Note, Nexus, Iconia, Padfone',
                help : 'This should only reflect the brand/product line for the tablets and should not include any numbers like iPad 2; those will be used to depict the model'
                },
            description : {
                placeholder : 'Give details on what this product line of tablets have in common; describe the history, the popularity, basic features and any other pertinent information that applies to all tablets organized and marketed under this particular group'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : '2, 1, Pro, Pro 12.2, A510, Air 2, Air',
                help : 'This reflects the version of the tablet; for example, the entry here for an Apple iPad 2 would be just the number 2'
                },
            description : {
                placeholder : 'Describe any warranty terms, special features, inputs, outputs, included cables, camera(s), memory, display resolution, battery life, etc. that is important for the consumer to know about this tablet'
                }
            },
        combo : {
            color : { label : 'Color' },
            memory : {
                label : 'Flash Memory (GB)',
                placeholder : 'Amount of flash memory included standard with the tablet to be used for storage purposes',
                range : {
                    s: 4,
                    f: 256,
                    a : '',
                    i : 2
                    }  
                },
            size : {
                label : 'Size (Diagonally)',
                help : 'This is the size of the display, when measured diagonally (in your current chosen unit system)',
                validate : 'dimension',
                range : {
                    s: 5,
                    f: 40,
                    a : '',
                    i : 0.1
                    }  
                },
            cellular : {
                label : 'Wifi/Cellular',
                help : '',
                defaults : {
                    1 : 'No Wifi + No Cellular',
                    2 : 'No Wifi + Cellular',
                    3 : 'Wifi + NO Cellular',
                    4 : 'Wifi + Cellular'
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
        year_dd_ : g.properties.year,
        operating_system_dd_ : {
            label : 'Operating System',
            placeholder : 'The included operating system for the tablet software (version in details)',
            defaults : {
                1 : 'Android',
                2 : 'Microsoft Windows (RT/8.1)',
                3 : 'iOS'
                }
            },
        cpu_nr_dd_ : {
            label : 'CPU Frequency (GHz)',
            placeholder : 'The CPU speed in gigahertz',
            range : {
                s: 1,
                f: 4,
                a : '',
                i : 0.1
                }
            },
        cpu_model : {
            label : 'CPU Model',
            placeholder : 'The CPU model this tablet uses'
            },
        cpu_cores_dd_ : g.properties.cpu.cores,
        graphics_dd_ : {
            label : 'Graphics Card',
            help : 'Is the graphics card integrated or dedicated? Dedicated cards are solely used for graphics rendering',
            defaults  : {
                1 : 'Not Applicable/Not Included',
                2 : 'Integrated',
                3 : 'Dedicated',
                }
            },
        graphics_chip_dd_ : g.properties.graphics.cards.producers,
        display_type_dd_ : g.properties.display.types,
        resolution_dd_ : {
            label : 'Screen Resolution (Max)',
            help : 'The maximum screen display resolution for the tablet',
            defaults : {
                1 : '480x272',
                2 : '640x480',
                3 : '800x480',
                4 : '800x600',
                5 : '1024x600',
                6 : '1280x800',
                7 : '1366x768',
                8 : '1440x900',
                9 : '1920x1080',
                10 : '1920x1200',
                11 : '2048x1536',
                12 : '2560x1600'
                }
            },
        ppi_nr_ : {
            label : 'PPI (Pixels Per Inch)',
            placeholder : 'The amount of pixels per inch on the display; also called pixel density',
            validate : 'decimal'
            },
        aspect_ratio_dd_ : {
            label : 'Aspect Ratio',
            help : 'The screen ratio (w:h) o the display screen',
            defaults  : {
                1 : '16:9',
                2 : '16:10',
                2 : '4:3'
                }
            },
        hdmi_dd_ : g.properties.ports.hdmi,
        usb2_dd_ : g.properties.ports.usb[2],
        usb3_dd_ : g.properties.ports.usb[3],
        vga_dd_ : g.properties.ports.vga,
        wifi_dd_ : g.properties.wifi,
        ethernet_dd_ : g.properties.ports.ethernet,
        cellular_ddm_ : {
            label : 'Cellular',
            help : 'Does this tablet have adapters to connect it with a cellular service?',
            defaults : {
                1 : 'No Cellular',
                2 : '3G',
                3 : 'HSPA+',
                4 : 'LTE',
                5 : 'GPRS/EDGE',
                6 : 'HSDPA',
                7 : 'HSUPA',
                8 : '2.1+EDR',
                9 : '3.0 + HS'
                }
            },
        battery_life_dd_ : g.properties.battery,
        cameras_dd_ : g.properties.cameras.number,
        megapixels_dd_ : g.properties.cameras.megapixels,
        epeat_dd_ : g.properties.epeat,
        warranty_parts_dd_ : g.properties.warranty.labor,
        warranty_labor_dd_ : g.properties.warranty.parts
        },
    booleans : [
        'led_backlight_attr_',
        'wifi_connectivity_attr_',
        'bluetooth_attr_',
        'hdmi_attr_',
        'gps_attr_',
        'energy_star_qualified_attr_',
        'led_backlit_keyboard_attr_',
        'webcam_attr_',
        'fingerprint_reader_attr_',
        'carry_on_size_attr_'
        ],
    reviews : g.reviews
    }