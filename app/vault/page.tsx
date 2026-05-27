"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function VaultPage() {
  const [stories, setStories] = useState<any[]>([]);

  // When the page loads, open the local memory and grab the array!
  useEffect(() => {
    const vaultData = JSON.parse(localStorage.getItem("myStoryVault") || "[]");
    // Reverse it so the newest stories are at the top
    setStories(vaultData.reverse()); 
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-6 relative">
      
      {/* Top Navigation */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
          ← Back to Generator
        </Link>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      <div className="max-w-4xl w-full flex flex-col gap-8 mt-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-600">
            My Magic Vault
          </h1>
          <p className="text-lg text-zinc-400 mt-4">
            All your safely stored adventures.
          </p>
        </div>

        {/* If the vault is empty, show a message */}
        {stories.length === 0 ? (
          <div className="text-center p-12 bg-zinc-900 rounded-xl border border-zinc-800 mt-8">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-zinc-300">Your vault is empty!</h2>
            <p className="text-zinc-500 mt-2">Go generate some magic to fill it up.</p>
          </div>
        ) : (
          /* If there are stories, map through them and create cards! */
          <div className="grid grid-cols-1 gap-8 mt-8">
            {stories.map((item, index) => (
              <div key={index} className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span className="text-sm font-medium px-3 py-1 bg-zinc-800 rounded-full text-zinc-300">
                    Prompt: "{item.prompt}"
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                </div>
                
                {item.image && (
                  <img 
                    src={item.image} 
                    alt="Saved Illustration" 
                    className="w-full max-h-96 object-cover rounded-lg border border-zinc-800"
                  />
                )}
                
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap mt-4">
                  {item.story}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}