The data in [data/packs.csv] contains information about the packs of cards as I (and my colleagues) find them.

The columns are:

- flavour: the flavour of the cards
- acquisition_date: the date the pack was acquired
- best_before_date: the date the pack is best before
- production_code: the production code of the pack
- production_time: the time the pack was produced
- card_number: the number of the card


To the best of my knowledge, the production code is an identifier composed of:

- The year of production, encoded as the last two digits of the year
- The calendar day of production, encoded as the day of the year (1-365) with leading zeros to make it a three-digit number
- Possibly, the batch number or line cycle, encoded as a two-digit number
- Possibly, the factory line / shift / plant identifier, encoded as a single letter

The data in [data/cards.csv] contains information about the cards themselves.

The columns are:

- card_number: the number of the card
- name: the name of the card
- code: the code of the card
