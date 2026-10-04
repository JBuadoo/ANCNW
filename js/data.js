// All Nations Church NorthWest — House of Grace
// Structured Data Store
const churchData = {
  info: {
    name: "All Nations Church NorthWest",
    shortName: "ANCNW",
    tagline: "House of Grace",
    mission: "Restoring People and Releasing Their Potential By Connecting Them to God",
    vision: "We aim to Expose, Enable, Equip and Enrich",
    scripture: "\u201CFor My house shall be called a house of prayer for all nations.\u201D \u2014 Isaiah 56:7",
    address: "14200 1st Avenue South, Seattle / Burien, WA 98168",
    phone: "(206) 555-4722",
    email: "info@ancnw.org",
    prayerEmail: "prayer@ancnw.org",
    officeHours: "Tuesday \u2013 Friday: 9:00 AM \u2013 5:00 PM",
    socials: {
      youtube: "https://youtube.com/@ancnorthwest",
      facebook: "https://facebook.com/ancnorthwest",
      instagram: "https://instagram.com/ancnorthwest"
    },
    services: [
      {
        day: "Sunday",
        time: "10:00 AM",
        name: "Sunday Worship Service",
        description: "Join us for an uplifting atmosphere of heartfelt praise, dynamic word, and grace for the entire family. Kids church available.",
        isPrimary: true
      },
      {
        day: "1st & 3rd Wednesday",
        time: "8:00 \u2013 9:00 PM",
        name: "Bible Study (Zoom)",
        description: "Deep dive into scripture and interactive biblical study via Zoom every 1st and 3rd Wednesday of the month.",
        isPrimary: false
      },
      {
        day: "Friday",
        time: "7:00 \u2013 9:00 PM",
        name: "Prayer Meeting (In Person)",
        description: "Corporate intercession and prayer for our community, families, and the nations.",
        isPrimary: false
      }
    ]
  },

  leadership: [
    {
      name: "Pastor Emmanuel & Pastor Grace Osei",
      role: "Lead Pastors & Founders",
      image: "assets/images/pastor-preaching.jpg",
      bio: "Founding pastors with a passion to see believers from every tribe, tongue, and nation empowered to walk in God\u2019s grace and purpose."
    },
    {
      name: "Pastor David Mwangi",
      role: "Associate Pastor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "Dedicated to equipping disciples through Bible studies, leadership mentoring, and community pastoral care."
    },
    {
      name: "Sarah Jenkins",
      role: "Worship Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "Leading our multicultural worship team into anointed atmospheres of praise and adoration."
    },
    {
      name: "Minister Marcus Taylor",
      role: "Youth Pastor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      bio: "Igniting a fire in high school and college students to lead their generation with bold faith and compassion."
    }
  ],

  ministries: [
    {
      id: "worship",
      title: "Worship Arts",
      category: "Worship",
      description: "Our worship ministry brings together musicians, vocalists, and sound engineers to facilitate a transformational encounter with God\u2019s presence.",
      image: "assets/images/worship-team.jpg",
      leader: "Sarah Jenkins",
      meetingTime: "Rehearsals: Thursdays at 7:00 PM"
    },
    {
      id: "kids",
      title: "Kingdom Kids",
      category: "Children",
      description: "A secure, joyful, and Christ-centered space for infants through 5th graders to discover God\u2019s word through creative lessons, crafts, and praise.",
      image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80",
      leader: "Deaconess Rachel Chen",
      meetingTime: "Sundays at 10:00 AM"
    },
    {
      id: "youth",
      title: "NextGen Youth & Young Adults",
      category: "Youth",
      description: "For middle school, high school, and young professionals. We tackle real-life questions, build faith, and forge authentic friendships.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      leader: "Minister Marcus Taylor",
      meetingTime: "Fridays at 6:30 PM"
    },
    {
      id: "men",
      title: "Men of Valour",
      category: "Men",
      description: "Dedicated to challenging and encouraging men through Bible study, accountability, brotherhood breakfasts, and hands-on service projects.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      leader: "Elder Samuel Kofi",
      meetingTime: "2nd & 4th Saturday at 8:30 AM"
    },
    {
      id: "women",
      title: "Daughters of Grace",
      category: "Women",
      description: "A sisterhood where women of all seasons find healing, support, scripture study, and purposeful mentorship.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      leader: "Pastor Grace Osei",
      meetingTime: "1st Saturday Brunch"
    },
    {
      id: "outreach",
      title: "Compassion & City Missions",
      category: "Outreach",
      description: "Demonstrating the tangible love of Christ through food pantry distributions, refugee support, hospital visits, and regional outreaches.",
      image: "assets/images/community-fellowship.jpg",
      leader: "Deacon Thomas Wright",
      meetingTime: "Monthly Service Saturdays"
    }
  ],

  sermons: [
    {
      id: "sermon-1",
      title: "Walking in Supernatural Grace",
      series: "Unshakable Kingdom",
      speaker: "Pastor Emmanuel Osei",
      date: "October 1, 2026",
      duration: "42:18",
      scripture: "Ephesians 2:8-10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      videoThumbnail: "assets/images/hero-sanctuary.jpg",
      description: "Grace is not just unmerited pardon\u2014it is God\u2019s empowering presence enabling you to do what you could never do on your own.",
      featured: true,
      notes: [
        "Grace justifies what the law condemned.",
        "Grace empowers your weakness to show His strength.",
        "Walk in bold confidence because Christ has finished the work."
      ]
    },
    {
      id: "sermon-2",
      title: "The Fire of United Prayer",
      series: "House of Prayer",
      speaker: "Pastor Grace Osei",
      date: "September 24, 2026",
      duration: "38:45",
      scripture: "Acts 4:23-31",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      videoThumbnail: "assets/images/pastor-preaching.jpg",
      description: "When the early church gathered with one accord, the place was shaken. Learn how corporate intercession unlocks breakthroughs.",
      featured: false,
      notes: [
        "Agreement is the currency of heaven.",
        "Prayer shifts atmosphere and dismantles strongholds.",
        "God is calling every nation to rise in prayer."
      ]
    },
    {
      id: "sermon-3",
      title: "Standing Uncompromised",
      series: "Kingdom Conviction",
      speaker: "Minister Marcus Taylor",
      date: "September 17, 2026",
      duration: "36:12",
      scripture: "Daniel 3:16-18",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      videoThumbnail: "assets/images/worship-team.jpg",
      description: "A message for our youth and families on cultivating deep convictions anchored in the Word of God.",
      featured: false,
      notes: [
        "Bow to God alone, not the golden images of our day.",
        "Your fourth man in the fire is already waiting.",
        "Transformation begins when the mind renews in truth."
      ]
    },
    {
      id: "sermon-4",
      title: "Cultivating Spiritual Fruitfulness",
      series: "Rooted & Grounded",
      speaker: "Pastor David Mwangi",
      date: "September 10, 2026",
      duration: "45:30",
      scripture: "John 15:1-8",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      videoThumbnail: "assets/images/community-fellowship.jpg",
      description: "Pruning is not punishment\u2014it is preparation for greater fruitfulness. Remain deeply connected to the True Vine.",
      featured: false,
      notes: [
        "Abiding precedes producing.",
        "The Vinedresser\u2019s knife is guided by love.",
        "Spiritual fruit blesses generations."
      ]
    }
  ],

  events: [
    {
      id: "event-1",
      title: "Grace & Glory Conference 2026",
      category: "Conference",
      date: "November 12 \u2013 15, 2026",
      time: "Evenings at 6:30 PM",
      location: "Main Sanctuary & Online",
      description: "Four days of worship, impartation, healing, and prophetic revelation with guest speakers from across the globe.",
      badge: "Flagship",
      image: "assets/images/hero-sanctuary.jpg",
      featured: true
    },
    {
      id: "event-2",
      title: "Night of Encounter",
      category: "Worship",
      date: "October 16, 2026",
      time: "8:00 \u2013 11:30 PM",
      location: "Sanctuary",
      description: "An extended evening devoted to uninterrupted worship, prayer for the sick, and spiritual breakthrough.",
      badge: "Upcoming",
      image: "assets/images/worship-team.jpg",
      featured: false
    },
    {
      id: "event-3",
      title: "Community Food & Coat Drive",
      category: "Outreach",
      date: "October 24, 2026",
      time: "9:00 AM \u2013 1:00 PM",
      location: "Church Grounds",
      description: "Serving over 400 local families with fresh groceries, warm winter coats, and free prayer.",
      badge: "Serve",
      image: "assets/images/community-fellowship.jpg",
      featured: false
    },
    {
      id: "event-4",
      title: "Youth Campfire & Worship",
      category: "Youth",
      date: "October 30, 2026",
      time: "6:30 \u2013 9:30 PM",
      location: "Youth Pavilion",
      description: "Acoustic praise, real conversations on identity and purpose, and friendly competitions.",
      badge: "Ages 13\u201325",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      featured: false
    }
  ],

  gallery: [
    {
      id: "gal-1",
      title: "Sunday Worship",
      category: "worship",
      image: "assets/images/hero-sanctuary.jpg",
      caption: "Believers standing in heartfelt praise and reverence."
    },
    {
      id: "gal-2",
      title: "Pastoral Teaching",
      category: "services",
      image: "assets/images/pastor-preaching.jpg",
      caption: "Pastor Emmanuel sharing an anointed message."
    },
    {
      id: "gal-3",
      title: "Community Fellowship",
      category: "community",
      image: "assets/images/community-fellowship.jpg",
      caption: "Connecting over coffee and conversation after service."
    },
    {
      id: "gal-4",
      title: "Worship Team",
      category: "worship",
      image: "assets/images/worship-team.jpg",
      caption: "The praise team leading with joy and musical excellence."
    },
    {
      id: "gal-5",
      title: "Youth Gathering",
      category: "youth",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
      caption: "Youth expressing their passion for God and community."
    },
    {
      id: "gal-6",
      title: "Kingdom Kids",
      category: "kids",
      image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1000&q=80",
      caption: "Children exploring biblical stories through play."
    },
    {
      id: "gal-7",
      title: "Baptism Service",
      category: "services",
      image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1000&q=80",
      caption: "Celebrating new lives transformed through faith."
    },
    {
      id: "gal-8",
      title: "Outreach Day",
      category: "community",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80",
      caption: "Distributing care packages to neighborhood families."
    }
  ],

  lifeGroups: [
    {
      name: "North Seattle Grace Circle",
      type: "General / Family",
      leader: "Deacon & Sis. Mensah",
      schedule: "Every Tuesday, 7:00 PM",
      neighborhood: "North Seattle / Shoreline"
    },
    {
      name: "South Sound Young Professionals",
      type: "Young Adults",
      leader: "Kevin & Michelle Ross",
      schedule: "Every Thursday, 7:30 PM",
      neighborhood: "Renton / Tukwila"
    },
    {
      name: "Grace Women\u2019s Prayer & Tea",
      type: "Women",
      leader: "Pastor Grace & Deaconess Mary",
      schedule: "Every Wednesday, 10:00 AM",
      neighborhood: "Burien / Des Moines"
    },
    {
      name: "Iron Sharpens Iron",
      type: "Men",
      leader: "Elder Samuel & Patrick D.",
      schedule: "Every Saturday, 8:00 AM",
      neighborhood: "Church Cafe & Online"
    }
  ],

  testimonials: [
    {
      quote: "From the moment my family walked through the doors, we felt embraced. People from every corner of the earth worshipping as one family in Christ.",
      author: "David & Rebecca Adeyemi",
      role: "Members since 2021"
    },
    {
      quote: "The preaching is biblically sound and deeply practical. In a busy city like Seattle, ANCNW is our sanctuary of peace and real community.",
      author: "Michael & Jessica Tremblay",
      role: "Life Group Leaders"
    },
    {
      quote: "The youth ministry changed my son\u2019s life. He found godly friends, passionate mentors, and a genuine love for Jesus.",
      author: "Grace Mwangi",
      role: "Parent & Volunteer"
    }
  ],

  faq: [
    {
      question: "What should I expect on my first visit?",
      answer: "A warm welcome! Our Sunday service lasts about 90 minutes and includes worship, biblical preaching, and an invitation for prayer. Arrive 15 minutes early for coffee and pastries at our Welcome Lounge."
    },
    {
      question: "What should I wear?",
      answer: "Come as you are. You\u2019ll see people in traditional cultural attire, suits, business casual, and jeans. We care about your presence, not your wardrobe."
    },
    {
      question: "Is there childcare during service?",
      answer: "Yes! Kingdom Kids provides fun, safe, age-appropriate ministry for nursery through 5th grade every Sunday."
    },
    {
      question: "Where can I park?",
      answer: "We have dedicated visitor parking in front of the main entrance. Our parking team will guide you."
    },
    {
      question: "How do I become a member?",
      answer: "We offer our Discover Grace track on the first Sunday of every month after service, with scheduled baptism services every quarter."
    }
  ]
};
