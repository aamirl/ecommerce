var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            placeholder : 'Apple, Toshiba, Sony, Microsoft, Samsung, Google, Asus, Lenovo',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Laptop Brand',
                placeholder : 'Chromebook, G-Series, VAIO, MacBook, Satellite, Thinkpad',
                help : 'This should only reflect the brand/product line for this particular group of laptops; it should not include any model numbers, except in situations like "R-Series" and "G-Series"'
                },
            description : {
                placeholder : 'Give details on what this product line of laptops have in common; describe the history, the popularity, basic features and any other pertinent information that applies to all laptops organized and marketed under this particular group'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'K200MA, CB35-B3330, B50 Touch, T440',
                help : 'This reflects the base model of the laptop; note that this is not the complete model number; for example, for a Lenovo Thinkpad T440 20B6009TUS, this would simply be the T440; for an ASUS K200MA-DS01T, this would be the K200MA. The full model number will be determined by the combination. Also do not include any other information such as the processor, screen size or RAM'
                },
            description : {
                placeholder : 'Describe any warranty terms, special features, inputs, outputs, included cables, camera(s), memory, display resolution, battery life, etc. that is important for the consumer to know about this laptop'
                }
            },
        combo : {
            color : 'all',
            operating_system_dd_ : {
                label : 'Operating System',
                placeholder : 'The included operating system for the laptop (version in details)',
                defaults : g.os
                },
            hard_drive : {
                label : 'Hard Drive (TB)',
                placeholder : 'Amount of hard disk drive space included standard with the laptop to be used for storage purposes',
                range : {
                    s: 0,
                    f: 30,
                    a : '',
                    i : 0.5
                    }  
                },
            ram : {
                label : 'RAM (GB)',
                placeholder : 'Amount of RAM included standard with the laptop to be used for processing purposes',
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
                    s: 8,
                    f: 60,
                    a : '',
                    i : 0.1
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
            cpu_cores_dd_ : g.properties.cpu.cores,
            cpu_model_dd_ : g.properties.cpu.types,
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
        display_technology_dd_ : {
            label : 'Display Technology',
            help : 'This is the display technology used for this particular laptop',
            defaults : {
                1 : 'SVGA',
                2 : 'XGA',
                3 : 'WXGA',
                4 : 'WSXGA',
                5 : 'SXGA',
                6 : 'WXGA+',
                7 : 'SXGA+',
                8 : 'WSXGA+',
                9 : 'UXGA',
                10 : 'WUXGA',
                11 : 'QXGA'
                }
            },
        resolution_dd_ : {
            label : 'Screen Resolution (Max)',
            help : 'The maximum screen display resolution for the laptop',
            defaults : {
                1 : '800x600',
                2 : '1024x768',
                3 : '1152x768',
                4 : '1280x768',
                5 : '1280x800',
                6 : '1280x854',
                7 : '1280x960',
                8 : '1280x1024',
                9 : '1366x768',
                10 : '1400x1050',
                11 : '1440x900',
                12 : '1680x1050',
                13 : '1600x1200',
                14 : '1920x1200',
                15 : '2048x1536',
                16 : '2560x1600'
                }
            },
        ppi_nr_ : {
            label : 'PPI (Pixels Per Inch)',
            placeholder : 'The amount of pixels per inch on the display; also called pixel density',
            validate : 'decimal'
            },
        aspect_ratio_dd_ : {
            label : 'Aspect Ratio',
            help : 'The screen ratio (w:h) of the display screen',
            defaults  : {
                1 : '5:4',
                2 : '4:3',
                3 : '16:10',
                4 : '16:9'
                }
            },
        hdmi_dd_ : g.properties.ports.hdmi,
        usb2_dd_ : g.properties.ports.usb[2],
        usb3_dd_ : g.properties.ports.usb[3],
        vga_dd_ : g.properties.ports.vga,
        wifi_dd_ : g.properties.wifi,
        ethernet_dd_ : g.properties.ports.ethernet,
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
        'led_backlit_keyboard_attr_',
        'webcam_attr_',
        'carry_on_size_attr_',
        'ultra_hd_4k_attr_',
        'energy_star_qualified_attr_',
        'memory_card_reader_attr_',
        'numeric_10_key_pad_attr_',
        'quad_core_processor_attr_',
        'fingerprint_reader_attr_',
        'dvd_burner_attr_',
        'bd_drive_attr_',
        'touchscreen_attr_',
        'facial_recognition_technology_attr_',
        'optical_drive_attr_',
        'esata_port_attr_',
        'bluray_player_attr_',
        'mouse_attr_'
        ],
    reviews : g.reviews
    }