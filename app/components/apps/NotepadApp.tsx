"use client";

import React, { useState } from "react";

const INITIAL_TEXT = `=====================================================
  MICROHARD DOOR - URL SHORTENER SHOWCASE README
=====================================================

Welcome to the Microhard Door URL Shortener showcase project. This client is a 
fully responsive, retro-styled recreation of the classic Microhard Door
desktop interface, integrated with a FastAPI URL shortener backend.

-----------------------------------------------------
[PROJECT SPECIFICATION]
-----------------------------------------------------
* Frontend Framework : Next.js 16.2 (App Router)
* Component Library  : React 19 + Framer Motion
* Styling Engine     : Tailwind CSS v4 + Retro Shadows
* Target Backend API : FastAPI (Render Cloud Server)
* Code Quality       : TypeScript Strict Mode
* Developer Portfolio: Open Source Project Showcase

-----------------------------------------------------
[FEATURES & APPLICATIONS]
-----------------------------------------------------
1. URL ShortenerWizard: 
   Paste your long links and compress them instantly! Renders short links,
   active clipboard copy, click trackers, and a pixel QR code mock.
   
2. Link Database:
   Track all your created links, clicks, and deletion metrics.
   
3. Recycle Bin:
   Drag links to delete them. You can empty the Recycle Bin or restore 
   files back to your database list.

4. MS Paint:
   Unleash your creativity with brush colors and clean canvas commands.

5. Minesweeper:
   Enjoy a classic game of 9x9 Minesweeper with a retro smiley face 
   restart button.

-----------------------------------------------------
[LICENSING]
-----------------------------------------------------
Released under the MIT Open Source License. Feel free to clone, edit, 
refactor, and showcase in your own developer portfolios!

Created by theajthakur (https://github.com/theajthakur) in 2026.
=====================================================`;

export default function NotepadApp() {
  const [text, setText] = useState(INITIAL_TEXT);

  return (
    <div className="flex-1 flex flex-col h-full bg-white select-text">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full h-full p-2 font-win-mono text-xs text-black border-none resize-none focus:outline-none bg-white select-text"
        spellCheck={false}
      />
    </div>
  );
}
