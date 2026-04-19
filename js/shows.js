/**
 * shows.js — Winslow Tour Data
 * ─────────────────────────────────────────────────────────────
 * THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE GIG DATES.
 *
 * HOW TO ADD A SHOW:
 *   1. Copy one of the objects below (the { } block)
 *   2. Paste it into the array, separated by a comma
 *   3. Fill in the details
 *   4. Save the file and upload it to the server (SFTP → /js/shows.js)
 *   Done. The tour page and homepage update automatically.
 *
 * HOW TO REMOVE A SHOW:
 *   Delete the entire { } block for that show (and its trailing comma).
 *
 * FIELD REFERENCE:
 *   date    — Display date string, e.g. "Sat, April 4th"
 *   venue   — Venue name
 *   addr    — Street address
 *   city    — City, State ZIP
 *   time    — Showtime, e.g. "8:00 PM"
 *   url     — Ticket or info link (use "#" if none yet)
 *   label   — Button text: "Get Tickets" | "More Info" | "SOLD OUT"
 *   sold    — true to show as sold out (grays the card), false or omit otherwise
 * ─────────────────────────────────────────────────────────────
 */

var SHOWS = [

  {
    date:  "Sat, May 16th",
    venue: "The Queen Theater",
    addr:  "500 N. Market Street",
    city:  "Wilmington, Delaware 19801",
    time:  "8:00 PM",
    url:   "https://www.ticketmaster.com/winslow-an-evening-of-the-eagles-wilmington-delaware-05-16-2026/event/0200643C8A526E0D",
    label: "Get Tickets"
  },

  {
    date:  "Thu, June 4th",
    venue: "Downtown Freehold Summer Concerts",
    addr:  "1 E Main Street",
    city:  "Freehold, New Jersey 07728",
    time:  "7:30 PM",
    url:   "https://www.facebook.com/downtownfreehold",
    label: "More Info"
  },

  {
    date:  "Sat, June 6th",
    venue: "Merrill Park",
    addr:  "344 Fairview Ave",
    city:  "Colonia, New Jersey 07067",
    time:  "7:30 PM",
    url:   "https://www.facebook.com/photo/?fbid=1565542685293550&set=a.552260486621780",
    label: "More Info"
  },

  {
    date:  "Fri, June 12th",
    venue: "Broadway Theater of Pitman",
    addr:  "43 S Broadway",
    city:  "Pitman, New Jersey 08071",
    time:  "8:00 PM",
    url:   "https://www.thebroadwaytheatre.org/show/winslow-an-evening-of-the-eagles/",
    label: "Get Tickets"
  },

{
    date:  "Fri, June 19th",
    venue: "Volunteer in Medicine Gala",
    addr:  "Irem Clubhouse, 64 Ridgway Drive",
    city:  "Dallas,PA 18612",
    time:  "8:00 PM",
    url:   "http://www.vimwb.org/annual-gala.html",
    label: "Get Tickets"
  },

{
    date:  "Fri, June 26th",
    venue: "The Collective Encore",
    addr:  "10221 Wincopin Cir",
    city:  "Columbia, MD 21044",
    time:  "8:00 PM",
    url:   "https://www.eventbrite.com/e/winslow-evening-of-the-eagles-night-one-tickets-1985919080429",
    label: "Get Tickets"
  },

{
    date:  "Sat, June 27th",
    venue: "The Collective Encore",
    addr:  "10221 Wincopin Cir",
    city:  "Columbia, MD 21044",
    time:  "8:00 PM",
    url:   "https://www.eventbrite.com/e/winslow-evening-of-the-eagles-night-two-tickets-1985919164681",
    label: "Get Tickets"
  },

{
    date:  "Sun, June 28th",
    venue: "Clinton Elks - Don Miller Tribute Concert",
    addr:  "211 Sidney Road Rt 617",
    city:  "Pittstown, NJ, 08867",
    time:  "2:00 PM",
    url:   "https://www.facebook.com/events/4350891438525198",
    label: "Show Info"
  },

{
    date:  "Sat, July 4th",
    venue: "Valley Forge Casino",
    addr:  "1160 1st Ave",
    city:  "King of Prussia, PA 19406",
    time:  "2:00 PM",
    url:   "https://vfcasino.boydgaming.com/",
    label: "Show Info"
  },

{
    date:  "Fri, July 10th",
    venue: "Sound Check Studios",
    addr:  "150 Corporate Park Dr",
    city:  "Pembroke, MA 02359",
    time:  "8:00 PM",
    url:   "https://www.soundcheck-studios.com/shows",
    label: "Get Tickets"
  },

{
    date:  "Sat, July 11th",
    venue: "Stone Church",
    addr:  "210 Main St",
    city:  "Brattleboro, VT 05301",
    time:  "8:00 PM",
    url:   "https://tickets.venuepilot.com/e/winslow-2026-07-11-stone-church-brattleboro-8b27a4",
    label: "Get Tickets"
  },

{
    date:  "Fri, July 17th",
    venue: "The Yard at Ballys",
    addr:  "1900 Pacific Ave",
    city:  "Atlantic City, NJ 08401",
    time:  "8:00 PM",
    url:   "https://casinos.ballys.com/atlantic-city/events-calendar.aspx",
    label: "Get Tickets"
  },

{
    date:  "Mon, July 20th",
    venue: "LaScala Beach House",
    addr:  "1400 Ocean Ave",
    city:  "Brigantine, NJ 08203",
    time:  "6:00 PM",
    url:   "https://lascalasbeachhouse.com/",
    label: "Show Info"
  },

];
