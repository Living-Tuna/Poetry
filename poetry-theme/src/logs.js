const logs = [
  {
    versionCode: '1.1.8',
    date: 'July 2026',
    features: [
      'Blend, Shelf and Inbox now open as full pages — the header stays put and mobile browsers no longer cover it',
      'Inbox became a proper chat: conversations grouped by reader, threaded messages, unread dots, and one-tap Yes/No replies to sharing requests',
      'Requesting a book on Blend marks it as sent and drops you into the conversation with the holder',
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
