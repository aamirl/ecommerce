module.exports = {
	reviews : {
        fit : 'True to Size',
        quality : 'Quality',
        fabric : 'Material Durability',
        },
    booleans : [
        'hand_wash_attr_',
        '_attr_anti_pilling',
        '_attr_anti_static',
        '_attr_anti_wrinkle',
        '_attr_breathable',
        '_attr_eco_friendly',
        '_attr_quick_dry',
        '_attr_waterproof',
        '_attr_windproof',
        '_attr_color_fadeproof',
        '_attr_machine_wash',
        'non_iron_attr_',
        'anti_shrink_attr_'
        ],
	properties : {
		watch : {
			clasp : {
	            label : 'Clasp',
	            placeholder : 'The clasp of the strap',
	            defaults : {
	                1 : 'Bangle Bracelet',
	                2 : 'Box with Tongue Clasp',
	                3 : 'Buckle',
	                4 : 'Deployment Buckle',
	                5 : 'Expansion Bracelet',
	                6 : 'Fold Over Clasp',
	                7 : 'Jewelry Clasp',
	                8 : 'Toggle Clasp',
	                9 : 'Lobster Claw/Hook Buckle'
	                }
	            },
			},
		pants : {
			rise : {
	            label: "Rise Style",
	            help: "This is the type of rise that your pants feature",
	            defaults: {
	                1: "Classic",
	                2: "Mid-Rise",
	                3: "Low",
	                4: "Ultra-Low"
	                }
	            },
			style : {
				label : 'Style',
				placeholder : 'The style of the pants',
				defaults : {
					1: "Baggy / Loose",
	                2: "Bootcut",
	                3: "Cargo",
	                4: "Carpenter",
	                5: "Classic / Straight-Leg / Regular",
	                6: "Comfort",
	                7: "Overalls",
	                8: "Relaxed",
	                9: "Skinny",
	                10: "Slim",
	                11: "Straight",
	                12: "Tapered"
					}
				}
			},
		wash : {
            label: "Denim Wash",
            help: "Denim comes in many different shades (usually dark to light) that are called washes - please choose the wash that is particular for your denim",
            defaults: {
                1: "Acid-Washed",
                2: "Black/Gray",
                3: "Colored",
                4: "Dark/Rigid",
                5: "Distressed",
                6: "Embellished",
                7: "Khaki/Brown",
                8: "Light",
                9: "Medium",
                10: "Stone-Washed",
                11: "Rinse/Indigo",
                12: "White"
                }
            },
		size : {
            label : 'Size',
            placeholder : 'The size as measured in basic sizes',
            defaults : {
                1 : 'Not Applicable',
                2 : 'One Size Fits All',
                3 : 'XXS',
                4 : 'XS',
                5 : 'S',
                6 : 'M',
                7 : 'L',
                8 : 'XL',
                9 : '2XL',
                10 : '3XL',
                11 : '4XL',
                12 : '5XL'
                }
            },
		fit : {
            label : 'Fit',
            placeholder : 'What is the fit of this clothing?',
            defaults : {
                1 : 'Classic',
                2 : 'Fitted',
                3 : 'Slim Fit',
                4 : 'Extra Slim'
                }
            },
       	sole : {
       		label : 'Sole Material',
       		placeholder : 'What does the majority of the material used on this sole consist of?',
       		defaults : {
       			1 : 'Rubber',
       			2 : 'Latex',
       			3 : 'Molded Soles',
       			}
       		},
       	material : {
       		label : 'Material',
       		placeholder : 'What does the majority of the material used on this item consist of?',
       		defaults : {
       			1 : '100% Cashmere',
       			2 : '100% Cotton',
       			3 : '100% Silk',
       			4 : '100% Wool',
       			5 : 'Acetate',
       			6 : 'Bamboo',
       			7 : 'Cashmere Blend',
       			8 : 'Corduroy',
       			9 : 'Cotton Blend',
       			10 : 'Denim',
       			11 : 'Flannel',
       			12 : 'Fleece',
       			13 : 'French Terry',
       			13 : 'Faux Fur',
       			13 : 'Fur',
       			14 : 'Hemp',
       			14 : 'Leather (Genuine)',
       			14 : 'Leather (Faux)',
       			14 : 'Lenin',
       			15 : 'Lycra/Spandex',
       			16 : 'Merino', 
       			16 : 'Microfiber', 
       			17 : 'Microfleece',
       			17 : 'Modal',
       			18 : 'Nylon',
       			19 : 'Organic Cotton',
       			19 : 'Oxford',
       			20 : 'Polyster',
       			21 : 'Rayon',
       			22 : 'Recycled Material',
       			23 : 'Satin',
       			24 : 'Sequin',
       			25 : 'Spandex/Cotton',
       			26 : 'Spandex/Polyster',
       			27 : 'Silk Blend',
       			28 : 'Suede',
       			29 : 'Terry',
       			30 : 'Twill',
       			30 : 'Velour',
       			30 : 'Worsted',
       			}
       		},
       	sleeve : {
            label : 'Sleeve Style',
            placeholder : 'The style of the garment that wholly or partly covers a person’s arm',
            defaults : {
                1 : 'Short Sleeves',
                2 : 'Long Sleeves',
                3 : 'French Cuff'
                }
            },
       	pocket : {
            label : 'Pocket Style',
            placeholder : 'The style of the pocket attached to the clothing',
            defaults : {
                1 : 'No Pockets',
                2 : '1 Pocket',
                3 : '2 Pockets',
                4 : '3 Pockets',
                5 : '4 Pockets',
                6 : '5 Pockets',
                7 : '6 Pockets',
                8 : '6+ Pockets'
                }
            },
       	pattern : {
       		label : 'Pattern',
       		placeholder : 'Elements of a fabric\'s design that are repeated in a predicable manner',
       		defaults : {
       			1 : 'Checkered',
       			2 : 'Plaid',
       			3 : 'Print',
       			4 : 'Solid',
       			5 : 'Stripe',
       			6 : 'Floral',
       			7 : 'Animal Print',
       			8 : 'Polka-Dot',
  				9 : 'Multi-Patterned'
       			}
       		},
       	collar : {
       		label : 'Collar Type',
       		placeholder : 'The part of the clothing that fastens around or frames the neck',
       		defaults : {
       			1 : 'Button Down',
       			2 : 'Fashion Collar',
       			3 : 'Point Collar',
       			4 : 'Spread Collar'
       			}
       		},
       	technics : {
       		label : 'Technics',
       		placeholder : 'Technics are specialized attributes that the fabric may feature',
       		defaults : {
       			1 : "Beaded",
                2 : "Embroidered",
                3 : "Garment-Dyed",
                4 : "Plain-Dyed",
                5 : "Printed",
                6 : "Poly-Urethane Coated",
                7 : "Shredded/Ripped",
                8 : "Washed",
                9 : "Wrinkled",
                10 : "Yarn-Dyed"
       			}
       		}
		},
	fabric : {

		}
	}