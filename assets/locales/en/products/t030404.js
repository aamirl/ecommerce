var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Publisher',
            placeholder : 'Adobe, Microsoft, Apple, McAfee, Norton',
            verb : 'Published'
            },
        line : {
            name : {
                label : 'Software Series',
                placeholder : 'Office, Photoshop, Windows, OS',
                help : 'This should only reflect the brand/product line for this particular group of drives'
                },
            description : {
                placeholder : 'Give details on what this product line of drives have in common; describe the history, the popularity, basic features and any other pertinent information that applies to all drives organized and marketed under this particular series'
                }
            },
        variation : {
            name : {
                label : 'Version',
                placeholder : '2, X Snow Leopard, 8.1, CS 7',
                help : 'This reflects the version of the software; for example, for Microsoft Windows 8.1 Home, this would be simply "8.1 Home"'
                },
            description : {
                placeholder : 'Describe any warranty terms, software requirements, peripheral requirements (extra mouse, extra keyboard, camera, etc.) or anything else that a consumer would need to use or know about in order to run this software effectively.'
                }
            },
        combo : {
            color : { label : 'Color' },
            operating_system : {
                label : 'Operating System',
                placeholder : 'The compatible operating system for this software',
                defaults : g.os
                },
            operating_system_versions : {
                label : 'Compatible OS Versions',
                placeholder : 'The compatible operating system versions for this software; for example for Windows 8, this would simply be the "8"',
                defaults : g.os
                },
            cpu_nr_dd_ : {
                label : 'Minimum CPU Speed (GHz)',
                placeholder : 'The minimum needed CPU clock speed in gigahertz',
                range : {
                    s: 1,
                    f: 4,
                    a : '',
                    i : 0.1
                    }
                },
            resolution_dd_ : {
                label : 'Mnimum Screen Resolution',
                help : 'The minimum screen resolution needed to run this software',
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
            included : {
                label : 'Included Application(s)',
                placeholder : 'The included applications with this software package',
                defaults : g.os
                },
            media : {
                label : 'Media',
                placeholder : 'The media that is used to transmit the software',
                defaults : {
                    1 : '1 DVD',
                    2 : 'Multiple DVDs',
                    3 : '1 CD',
                    4 : 'Multiple CDs',
                    5 : 'USB'
                    6 : 'Online'
                    }
                },
            device_user : {
                label : 'Device/User Limit',
                placeholder : 'The amount of devices/users that can use one copy of this software',
                defaults : {
                    1 : '1 Device',
                    2 : '2 Devices',
                    3 : '3 Devices',
                    4 : '4 Devices',
                    5 : '5 Devices',
                    6 : '6 Devices',
                    7 : '7 Devices',
                    8 : '8 Devices',
                    9 : '9 Devices',
                    10 : '10 Devices',
                    11 : '10+ Devices',
                    12 : '1 User',
                    13 : '2 Users',
                    14 : '3 Users',
                    15 : '4 Users',
                    16 : '5 Users',
                    17 : '6 Users',
                    18 : '7 Users',
                    19 : '8 Users',
                    20 : '9 Users',
                    21 : '10 Users',
                    22 : '10+ Users'
                    }
                },
            subscription : {
                label : 'Subscription',
                placeholder : 'If applicable, describe the length of time that a subscription service would impact',
                defaults : {
                    1 : 'Not Applicable',
                    2 : '3 Months',
                    3 : '6 Months',
                    4 : '9 Months',
                    5 : '1 Year',
                    6 : '2 Years',
                    7 : '3 Years',
                    8 : '4 Years',
                    9 : '5 Years',
                    10 : '6 Years',
                    11 : '7 Years',
                    12 : '8 Years',
                    13 : '9 Years',
                    14 : '10 Years'
                    }
                }
            },
        identifiers : {
            options : ['upc','sku'],
            // required : ['upc']
            },
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
        warranty_dd_ : g.properties.warranty.standard
        },
    reviews : g.reviews
    }