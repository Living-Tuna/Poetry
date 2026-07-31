const logs = [
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
