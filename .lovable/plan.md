# Interactive Quezon Dictionary Map

## What will change
- Use the existing **Quezon Voice Quest map**—its real municipality shapes, district colors, labels, and zoom behavior—as the sole map reference.
- Add the map directly below the homepage search suggestions without redesigning the rest of the homepage.
- Replace the random “Try” chips with **Harana**, **Suman sa Lihiya**, **Sungal**, and **Pansit Habhab**, preserving clickable search behavior and mobile horizontal scrolling.
- Let users move through **Quezon → District → Municipality/City → Local words** within the homepage map section.
- Keep the selected district map visible, highlight the selected locality, and reveal its available dictionary words in an animated panel. Selecting a word opens its existing word page.
- Include Filipino instructions, a clickable breadcrumb/back control, keyboard-accessible map regions, and clear selected states.

## Technical details
- Extend the existing reusable SVG map component instead of introducing map images or a separate map system.
- Derive local word lists from the existing structured dictionary data; show a clear empty state where no words have been collected rather than inventing entries.
- Add optional map-selection behavior without changing the game’s pronunciation flow or saved progress.
- Preserve the existing header, search microphone/camera actions, homepage sections, and Districts/Home/Saved navigation.
- Validate mobile and desktop layouts, district/locality interactions, word navigation, and the pending homepage photo-search build state.
