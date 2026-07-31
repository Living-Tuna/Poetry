const logs = [
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
