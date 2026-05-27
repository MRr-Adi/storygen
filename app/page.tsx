"use client";

import { useState } from "react";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedStory("");
    setGeneratedImage(""); 
    setIsSaved(false); 

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: storyPrompt }),
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedStory(data.story);
        setGeneratedImage(data.image);
      } else {
        setGeneratedStory("Error: " + data.error);
      }
    } catch (error) {
      setGeneratedStory("Uh oh! The magic connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // The Instant Win Local Vault!
  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      try {
        const newStory = {
          prompt: storyPrompt,
          story: generatedStory,
          image: generatedImage,
          savedAt: new Date().toISOString(),
        };

        const existingVault = JSON.parse(localStorage.getItem("myStoryVault") || "[]");
        existingVault.push(newStory);
        localStorage.setItem("myStoryVault", JSON.stringify(existingVault));
        
        setIsSaved(true); 
      } catch (error) {
        alert("Uh oh! The local vault is full.");
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6 relative">
      
      {/* STEP 42: The New Navigation Bar is right here at the top! */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white px-6 py-2 rounded-full font-medium transition-all shadow-sm">
              Sign In
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <a href="/vault" className="text-sm font-medium px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors border border-zinc-700">
            📚 View My Vault
          </a>
          <UserButton />
        </Show>
      </div>

      <div className="max-w-2xl w-full flex flex-col gap-6 text-center mt-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
          AI Kids Story Generator
        </h1>
        <p className="text-lg text-zinc-400">
          What kind of story do you want to create today?
        </p>

        <Show when="signed-in">
          <textarea
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-40 resize-none shadow-inner"
            placeholder="Example: A magical forest where trees sing..."
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
          ></textarea>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || storyPrompt.trim() === ""}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
          >
            {isLoading ? "✨ Painting & Writing (this takes about 10 seconds)..." : "✨ Generate Magic Story"}
          </button>

          {generatedStory !== "" && (
            <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-left shadow-2xl flex flex-col gap-6">
              {generatedImage !== "" && (
                <div className="flex flex-col gap-3">
                  <img src={generatedImage} alt="AI Illustration" referrerPolicy="no-referrer" className="w-full rounded-xl shadow-lg border border-zinc-800" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Your Magic Story:</h2>
                <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">{generatedStory}</p>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className="mt-4 w-full bg-zinc-800 hover:bg-zinc-700 disabled:bg-green-900/50 disabled:text-green-400 disabled:border-green-800 border border-zinc-700 text-white font-bold py-4 rounded-xl transition-all"
              >
                {isSaved ? "✅ Safely Locked in Your Vault!" : (isSaving ? "💾 Saving..." : "💾 Save to My Vault")}
              </button>

            </div>
          )}
        </Show>

        <Show when="signed-out">
          <div className="mt-4 p-10 bg-zinc-900 rounded-xl border border-zinc-800 text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-2xl font-bold text-white">VIP Access Required</h2>
            <p className="text-zinc-400 max-w-md">You need to create a free account to unlock the magic AI generator.</p>
            <SignInButton mode="modal">
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25">
                Unlock the Magic
              </button>
            </SignInButton>
          </div>
        </Show>

      </div>
    </main>
  );
}