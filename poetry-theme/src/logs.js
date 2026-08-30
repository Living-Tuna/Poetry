const logs = [
  {
    versionCode: '1.5.5',
    date: 'August 2026',
    bugs: [
      'Google sign-in tribulations fixed — first the callback router was blocking the browser\'s security pre-flight check, then the edge function surfaced Google\'s real error instead of a vague code, and the single-use sign-in code is now exchanged exactly once so Google never rejects it as already used',
    ],
  },
  {
    versionCode: '1.5.4',
    date: 'August 2026',
    features: [
      'Sign-in and sign-up panel now opens as a centred popup on desktop and stays as a slide-down on mobile',
      'Google sign-in goes directly to Google — the Supabase project URL no longer flashes during the redirect',
      'After signing in with Google, you are guided through choosing a username, your display name, and your location (auto-detected, entered manually, or skipped for now)',
      'Security question is no longer required for Google accounts — only username sign-ups ask for one',
    ],
    bugs: [
      'Google sign-in sometimes bounced back to the home screen without completing the session — the callback now exchanges the code through a secure Edge Function and sets the session reliably',
    ],
  },
  {
    versionCode: '1.5.0',
    date: 'August 2026',
    features: [
      'Sign in with Google arrives on the sign-in screen — one tap on the Google button and one approval on the consent screen gets you straight into your account',
      'No account yet? The first Google sign-in creates one automatically — no username, password, or security question needed',
    ],
  },
  {
    versionCode: '1.4.0',
    date: 'August 2026',
    features: [
      'Readers will see our 3k historic collections and independent poems in random order, so the reading queue is always fresh and never repeats the same cluster of poems',
      ],
  },
  {
    versionCode: '1.3.9',
    date: 'August 2026',
    features: [
      'The reading queue is now shuffled fresh for every reader — each swipe draws the next poem at random from the whole library, so the order never repeats the same cluster of poems',
      'Poems you have already read are remembered and skipped, so the reader keeps showing you verses you have not seen before — and once you have gone through the whole library, it starts a fresh cycle',
    ],
  },
  {
    versionCode: '1.3.8',
    date: 'August 2026',
    bugs: [
      'Swiping down in the reader no longer closes the poem when you are mid-way through it — it scrolls back up towards the top so you can re-read, and only a swipe down from the very top closes the reading screen',
    ],
    features: [
      'Marked lines are now shown bold in the theme color instead of a tinted box — favorites stand out on the page without covering the text with a border or background',
    ],
  },
  {
    versionCode: '1.3.7',
    date: 'August 2026',
    features: [
      'Every poem now has its own direct link — open a poem straight from its URL, and each page shows the correct title, description, and preview image for search engines and social sharing',
      'Book links can pre-fill the Blend search — a link with ?q= jumps straight into a book search for that title',
      'The whole library is now discoverable by search engines — a full sitemap of every page and poem plus a robots.txt guide crawlers to the right places',
      'Poems publish machine-readable metadata so Google, Facebook, and Twitter can show a rich card when someone shares a link',
      'The home screen now spreads into two columns on wider screens — announcements, your favorite line, and everything else are easier to scan on desktop',
    ],
  },
  {
    versionCode: '1.3.6',
    date: 'August 2026',
    features: [
      'The full-screen reader now slides reliably on touch devices — swiping sideways between poems feels natural on any phone',
      'Lines are highlighted on a double-tap instead of a single tap — no more accidentally saving a line, and double-tapping a marked line removes the mark',
      'Poem text in the reader is tighter and cleaner — words no longer look spread out with extra spacing',
      'The reader header now shows the poem title with its star count and total lines, and the previous/next arrows moved into a slim bar at the bottom',
      'Favorite lines now show newest-first, so the latest additions always appear on top',
    ],
  },
  {
    versionCode: '1.3.3',
    date: 'August 2026',
    features: [
      'The historic library grew from about 190 classics to thousands — the full public-domain collection from PoetryDB is now included, so there is far more to read and share',
      'The reader now loads the entire library, no matter how large it gets',
    ],
  },
  {
    versionCode: '1.3.2',
    date: 'August 2026',
    features: [
      'Tapping a line now marks the whole sentence, and tapping a marked sentence again removes the mark — the star count in the reader header stays accurate as you go',
      'Swipe gestures no longer get stuck — a slightly tilted drag is now read as a swipe instead of jamming between sliding and scrolling',
      'Announcements sit at the very top of the home screen, with your favorite line right below them',
      'Home screen is reorganized — "Ready to share a book?", "Need a book?" and "Books Near You" now sit together just above the newsletter, and a new card jumps straight to your bookshelf',
      'The bookshelf add button moved to the top of the shelf',
      'A daily set of classic articles is always available — the reader never shows an empty screen, even when the library has no content yet',
    ],
  },
  {
    versionCode: '1.3.1',
    date: 'August 2026',
    features: [
      'Books Near You on the home screen — the nearest four books at a glance with title, author, page count, and how far each one is; tapping one jumps straight to its Blend card',
      'Blend is now built around the reader, not a radar — request a book from a nearby reader and watch an arrow go from you to them, with an "Awaiting response" badge until they answer',
      'Blend now shows only your ongoing blends — the books you have requested that are still awaiting an answer or already accepted',
      'Reader identities stay truly private — in Blend and in the Inbox the other person shows as "Anonymous" until they approve your request, and only then do their name and profile appear and the chat unlock',
      'Approved blends flip into a green arrow, the reader\'s name, and an Inbox button so you can talk about the exchange',
      'Location is now saved for good — your detected coordinates stick across sessions, so "nearby" distances are accurate even without a ZIP code, and Settings no longer keeps asking for your location',
    ],
  },
  {
    versionCode: '1.2.7',
    date: 'August 2026',
    features: [
      'Sign-up is now a guided, step-by-step flow — username, name, location, password, and security question each on their own screen',
      'Your location is detected automatically once and carried straight into sign-up, so you are not asked for it twice',
      'Auto-detected PINs now always resolve to the right state or region — location is smoother and more accurate',
    ],
  },
  {
    versionCode: '1.2.5',
    date: 'July 2026',
    bugs: [
      'Poem typing no longer jumps from the body text into the title field while writing',
    ],
    features: [
      'My Writings now has a dedicated, easier-to-manage page with quick actions to open, edit, or delete each poem',
      'Creating a new poem is more obvious with a prominent New button and a cleaner empty-state experience',
    ],
  },
  {
    versionCode: '1.2.4',
    date: 'July 2026',
    features: [
      'Incoming messages flash as a banner in the header for a few seconds — book requests, shares, and replies all announce themselves, and tapping the banner jumps straight into that chat',
      'The sidebar stays out of the way while a chat is open — no menu button on the conversation screen, and opening a chat always dismisses the menu',
      'The sidebar now has a Home shortcut at the top, right above My Writings, so you can jump back to the dashboard from anywhere',
      'Message banners no longer replace the header — the reader\'s name stays put and the incoming message slides in as a slim strip below it, then fades away on its own',
    ],
  },
  {
    versionCode: '1.2.3',
    date: 'July 2026',
    features: [
      'Chats now feel like a proper messenger — the message bubbles slide in while the typing bar and send button stay fixed at the bottom, and new messages auto-scroll into view',
      'Chats show the correct reader — their name and @username appear in the header, and the profile button opens the right reader\'s profile, which now always loads',
    ],
  },
  {
    versionCode: '1.2.2',
    date: 'July 2026',
    features: [
      'Writing a poem is now a full page like the reader — no more popup; the title sits in the heading, the poem is written below it, and the category selector lives in a bar at the very bottom',
      'The full-page writer opens from everywhere — the floating button on home, the sidebar\'s "Write Now", and the write buttons on your writings page',
    ],
  },
  {
    versionCode: '1.2.1',
    date: 'July 2026',
    features: [
      'Announcements now appear on your home screen — a one-line badge with an icon that slides down into the full note when tapped, with an X to close it',
      'Notes, updates, errors, bugs and fixes each get their own icon and color, and new notes can be published right from src/announcement.js',
    ],
  },
  {
    versionCode: '1.2.0',
    date: 'July 2026',
    features: [
      'Book exchanges are now a guided flow — request a book on Blend and the holder gets asked whether to share it; only after they say yes do you get asked if you received it, and confirming adds it straight to your shelf',
      'Chats have their own header — a back button, the person\'s name, and a profile button that opens their full profile',
      'Reader profiles: see any reader\'s favorite lines, bookshelf, recently read, frequently read, and their reading streak',
      'New reading streaks — read daily to grow your streak, visible on your profile and on every reader profile',
      'New inbox messages and notifications flash in the header for 3 seconds, then the header returns to normal',
    ],
  },
  {
    versionCode: '1.1.9',
    date: 'July 2026',
    features: [
      'Home stats now load instantly from local storage and refresh in the background',
      'Everything now switches in-app — no more browser URL jumps on Blend, Shelf or Inbox',
    ],
  },
  {
    versionCode: '1.1.8',
    date: 'July 2026',
    features: [
      'Inbox became a proper chat: conversations grouped by reader, threaded messages, unread dots, and one-tap Yes/No replies to sharing requests',
      'A new mission and safety notice on the home screen — never share personal information and always strictly follow the Privacy Policy',
      'Terms, Privacy Policy and About pages — now full pages you can open from the menu or page footers',
      'Smoother mobile experience — no accidental pinch-zoom, no overscroll bounce, and proper notched-screen support',
    ],
  },
  {
    versionCode: '1.1.4',
    date: 'July 2026',
    features: [
      'Your country and state are now detected automatically on sign-in and when setting up Blend — only denied or unavailable locations fall back to manual entry',
      'Book requests and replies now sync instantly across accounts — the recipient gets your message in their inbox in real time',
      'The History Library: 150+ passages from the greatest works of all time — the Bible, the Quran, the Odyssey, the Iliad, the Bhagavad Gita, the Tao Te Ching, Shakespeare, Milton, Dante, and the world\'s poets — all public domain and unexpurgated',
    ],
  },
  {
    versionCode: '1.1.3',
    date: 'July 2026',
    bugs: [
      'Broken URLs now redirect safely back to the app instead of 404',
      'Cards open fullscreen even when tapped on the preview text',
      'Search dropdown no longer collapses the instant you tap the search icon',
      'Tapping a search result now opens the poem, favourite preview, or book as expected',
    ],
    features: [
      'Likes on user poems now actually increment and decrement — tap the star anywhere',
      'Header search expands to full width and adapts to what you\'re browsing — poems on the home feed, favourite lines on your Favourites page, and real shelf books on Blend',
      'Favourites list paginated for easy browsing',
      'Historic poems clearly marked as not ratable',
      'Blend book exchange with real library data and distance-based holder sorting — search books straight from the header',
      'Shelf syncs to the cloud so your books follow you across devices',
      'Hero stats: live users, active users, and poem counts',
    ],
  },
  {
    versionCode: '1.0.0',
    date: 'July 2026',
    bugs: [
      'Swipe animation stutters on low-end devices during rapid navigation',
      'Edit mode textarea does not resize properly on iOS Safari',
    ],
    features: [
      'Three-card swipeable track with smooth animations for poem navigation',
      'Swipe-left for next poem, swipe-right for previous poem (reels-style)',
      'Infinite lazy-loading — new poems load as you reach the end of the queue',
      'Triple-tap any line to save as a favorite with visual highlight',
      'Inline edit mode for user poems with title, content, and category picker',
      'Edge-clamped swipe — cannot overscroll past the first or last poem',
      'Fullscreen overlay for Terms & Conditions and Privacy Policy',
    ],
  },
  {
    versionCode: '0.9.0',
    date: 'June 2026',
    bugs: [
      'Profile slide panel cuts off at 70vh, hiding logout and changelog',
      'PoetryCard trackRef error crashes the dashboard on load',
    ],
    features: [
      'Initial poem feed with Supabase backend',
      'User authentication with login, signup, and password reset',
      'Favorite lines with triple-tap gesture',
      'Dashboard with poem cards and swipe navigation',
    ],
  },
]

export default logs
