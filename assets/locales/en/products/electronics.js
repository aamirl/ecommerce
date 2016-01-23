module.exports = {
	reviews : {
        value : 'Value',
        features : 'Features',
        performance : 'Performance',
        reliability : 'Reliability'
        },
	properties : {
		internal : {
            label : 'Internal/External',
            placeholder : 'Is this device internal or external?',
            defaults : {
                1 : 'Internal',
                2 : 'External'
                }
            },
		epeat : {
			label : 'EPEAT',
			help : 'EPEAT is the definitive global rating system for greener electronics. It is an easy to use resource for purchasers, manufacturers, resellers and others to identify environmentally preferable devices. The EPEAT system combines strict, comprehensive criteria for design, production, energy use and recycling with ongoing independent verification of manufacturer claims.',
			defaults : {
				1 : 'Not EPEAT Qualified',
				2 : 'EPEAT Bronze',
				2 : 'EPEAT Silver',
				2 : 'EPEAT Gold',
				}
			},
		warranty : {
			standard : {
				label : 'Warranty (Standard)',
				help : 'The standard warranty on this item',
				defaults : {
					1 : 'No Warranty',
					2 : '1 year full warranty',
					3 : '1 year limited warranty',
					4 : '2 year full warranty',
					5 : '2 year limited warranty',
					6 : '3 year full warranty',
					7 : '3 year limited warranty',
					8 : '4 year full warranty',
					9 : '4 year limited warranty',
					10 : '5 year full warranty',
					11 : '5 year limited warranty',
					12 : '5+ year full warranty',
					13 : '5+ year limited warranty',
					}
				},
			labor : {
				label : 'Warranty (Labor)',
				help : 'The warranty on the labor of this item from the manufacturer',
				defaults : {
					1 : 'No Warranty',
					2 : '1 year full warranty',
					3 : '1 year limited warranty',
					4 : '2 year full warranty',
					5 : '2 year limited warranty',
					6 : '3 year full warranty',
					7 : '3 year limited warranty',
					8 : '4 year full warranty',
					9 : '4 year limited warranty',
					10 : '5 year full warranty',
					11 : '5 year limited warranty',
					12 : '5+ year full warranty',
					13 : '5+ year limited warranty',
					}
				},
			parts : {
				label : 'Warranty (Parts)',
				help : 'The warranty on the parts of this item from the manufacturer',
				defaults : {
					1 : 'No Warranty',
					2 : '1 year full warranty',
					3 : '1 year limited warranty',
					4 : '2 year full warranty',
					5 : '2 year limited warranty',
					6 : '3 year full warranty',
					7 : '3 year limited warranty',
					8 : '4 year full warranty',
					9 : '4 year limited warranty',
					10 : '5 year full warranty',
					11 : '5 year limited warranty',
					12 : '5+ year full warranty',
					13 : '5+ year limited warranty',
					}
			},
		display : {
			types : {
	            label : 'Display Type',
	            help : 'This is the display technology used for this particular device',
	            defaults : {
	                1 : 'Cathode Ray Tube (CRT)',
	                2 : 'Plasma Display Panel (PDP)',
		            3 : 'LCD (Liquid Crystal Display)',
	                4 : 'TFT LCD (Liquid Crystal Display)',
	                5 : 'IPS LCD (Liquid Crystal Display)',
	                6 : 'MVA LCD (Liquid Crystal Display)',
	                7 : 'LED (Light-Emitting-Diode)',
	                8 : 'SED (Surface-conduction Electron-Emitter Display)',
	                9 : 'FED (Field Emission Display)',
	                10 : 'OLED (Organic Light-Emitting Diode)'
	                }
	            },
			}
		graphics : {
			cards : {
				producers : {
		            label : 'Graphics Chip',
		            help : 'This is the producer of the graphics chip used in the device',
		            defaults : {
		                1 : 'Intel',
		                2 : 'nVidia',
		                3 : 'Apple',
		                4 : 'Dell',
		                5 : 'PNY',
		                6 : 'GeForce',
		                7 : 'MSI'
		                }
		            }
				}
			},
		year : {
            label : 'Year',
            help : 'Year model came out',
            defaults : {
                1 : '< 2005',
                2 : '2006',
                3 : '2007',
                4 : '2008',
                5 : '2009',
                6 : '2010',
                7 : '2011',
                8 : '2012',
                9 : '2013',
                10 : '2014',
                11 : '2015',
                12 : '2016',
                }
            },
        wifi : {
            label : 'Wifi',
            help : 'The wifi adapter included with the tablet',
            defaults : wifi : {
		        1 : 'No Wifi',
		        2 : '802.11 b/g/n',
		        3 : '802.11 a/b/g/n',
		        4 : '802.11 a/b/g/n/ac',
		        5 : '802.11 a/b/g/n/ac + MIMO',
		        }
            },
        ports : {
        	ethernet : {
	            label : 'Ethernet Ports',
	            help : 'The number of ethernet ports included with this device',
	            defaults : {
	                1 : 'None',
	                2 : '1',
	                3 : '2',
	                4 : '3',
	                5 : '4',
	                6 : '5',
	                7 : '6',
	                8 : '6+'
	                }
	            },
        	vga : {
	            label : 'VGA Ports',
	            help : 'The number of VGA ports included with this device',
	            defaults : {
	                1 : 'None',
	                2 : '1',
	                3 : '2',
	                4 : '3',
	                5 : '4',
	                6 : '5',
	                7 : '6',
	                8 : '6+'
	                }
	            },
	        hdmi : {
	            label : 'HDMI Ports',
	            help : 'The number of HDMI ports included with this device',
	            defaults : {
	                1 : 'None',
	                2 : '1',
	                3 : '2',
	                4 : '3',
	                5 : '4',
	                6 : '5',
	                7 : '6',
	                8 : '6+'
	                }
	            },
	        usb : {
	        	2 : {
		            label : 'USB 2.0 Ports',
		            help : 'The number of USB 2.0 ports included with this device',
		            defaults : {
		                1 : 'None',
		                2 : '1',
		                3 : '2',
		                4 : '3',
		                5 : '4',
		                6 : '5',
		                7 : '6',
		                8 : '6+'
		                }
		            },
		        3 : {
		            label : 'USB 3.0 Ports',
		            help : 'The number of USB 3.0 ports included with this device',
		            defaults : {
		                1 : 'None',
		                2 : '1',
		                3 : '2',
		                4 : '3',
		                5 : '4',
		                6 : '5',
		                7 : '6',
		                8 : '6+'
		                }
		            }
	        	}
	        }
		cpu : {
			cores : {
	            label : 'CPU Cores',
	            placeholder : 'The amount of CPU cores used by the tablet',
	            defaults : {
		            1 : "1",
		            2 : "2",
		            3 : "3",
		            4 : "4",
		            5 : "5",
		            6 : "6",
		            7 : '6+'
		            }
	            },
	        types : {
                label : 'CPU Model',
                placeholder : 'The CPU model this laptop uses',
                defaults : {
			        1 : 'Intel Pentium',
			        2 : 'Intel Celeron',
			        3 : 'Intel Core i3',
			        4 : 'Intel Core i5',
			        5 : 'Intel Core i7',
			        6 : 'Intel Core 2 Duo',
			        7 : 'Intel Xeon',
			        8 : 'Apple A4',
			        9 : 'Apple A5',
			        10 : 'Apple A5X',
			        11 : 'Apple A6',
			        12 : 'Apple A6X',
			        13 : 'Apple A7',
			        14 : 'Apple A8',
			        15 : 'Apple A8X',
			        16 : 'Apple A9',
			        }
                }

			},
		battery : {
            label: 'Battery Life (hours)',
            help: 'How long does it take for this tablet to lose it\'s charge completely from a full charge due to normal use?',
            defaults : {
                1 : '< 1',
                2 : '1',
                3 : '2',
                4 : '3',
                5 : '4',
                6 : '5',
                7 : '6',
                8 : '7',
                9 : '8',
                10 : '9',
                11 : '10',
                12 : '11',
                13 : '12',
                14 : '13',
                15 : '14',
                16 : '15',
                17 : '16',
                18 : '17',
                19 : '18+',
                }
            },
        cameras : {
	        number : {
	        	label : 'Cameras',
	            placeholder : 'The number of embedded cameras',
	            defaults : {
	                1 : 'None',
	                2 : '1',
	                3 : '2',
	                4 : '3',
	                5 : '4',
	                6 : '4+'
	                }
	            },
	        megapixels : {
	            label : 'Camera Megapixels',
	            placeholder : 'The amount of megapixels for the tablet\'s most powerful camera',
	            validate : 'decimal',
	            defaults : {
	                1 : 'Not Applicable',
	                2 : '1',
	                3 : '2',
	                4 : '3',
	                5 : '4',
	                6 : '5',
	                7 : '6',
	                8 : '7',
	                9 : '8',
	                10 : '9',
	                11 : '10',
	                12 : '11',
	                13 : '12',
	                14 : '13',
	                15 : '14',
	                16 : '15',
	                17 : '15+',
	                },
	            }
            }
		},
	os : {
        1 : 'Chrome OS',
        2 : 'Microsoft Windows',
        3 : 'Mac OS',
        4 : 'Linux (Ubuntu)',
        5 : 'Linux (Other Variant)',
        }
	}