

module.exports = {
	setup : {
		manufacturer : {
			label : 'Publisher',
			verb : 'Published'
			},
		line : {
			name : {
				label : 'Title',
				placeholder : 'Lehninger Principles of Biochemistry, Harry Potter and the Prisoner of Azkaban, 50 Shades of Gray'
				},
			description : {
				placeholder : "Describe the book and the appeal it has to audiences"
				}
			},
		variation : {
			name : {
				label : 'Edition',
				placeholder : '3rd Edition, Abridged Edition'
				},
			description : {
				placeholder : 'Describe this particular edition and any changes that took place in it compared to other editions. If this is the first or only edition, you may leave this blank.'
				}
			},
		combo : {
			format: {
				label : 'Format',
				help : 'The format of the book as it is sold with this ISBN',
				defaults : {
					1 : 'Audiobook',
					2 : 'Hardcover',
					3 : 'Paperback',
					4 : 'Electronic Book (E-Book)'
					}
				},
			format_details : {
				label : 'Details',
				placeholder : 'Mention any details about this particular format of the book'
				}
			},
        identifiers : {
        	options : ['upc','isbn','sku'],
        	required : ['isbn']
            }
		},
	properties : {
		UE_author : {
			label : 'Author',
			placeholder : 'Primary author of the book',
			help : 'Author of the book.',
			},
		published : {
			label : 'Published',
			placeholder : 'Year book was published',
			help : 'Year book was published',
			validate : 'year'
			},
		pages : {
			label : 'Pages',
			placeholder : 'Pages in the book',
			help : 'Pages in the book',
			validate : 'number'
			},
		pictures_ddm_ : {
			label : 'Pictures',
			defaults : {
				1 : 'Front Cover',
				2 : 'Back Cover',
				3 : 'Middle Pages'
				}
			}
		},
	reviews : {
		clarity : 'Clarity',
		ease : 'Ease of Use'		
		}
	}