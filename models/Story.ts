import mongoose, { Schema, Document } from "mongoose";

// This defines the exact shape of our data in the Vault
export interface IStory extends Document {
  userId: string;       // To know which VIP user owns this story
  prompt: string;       // What they asked for (e.g., "A flying turtle")
  storyText: string;    // The actual text the AI wrote
  imageUrl: string;     // The link to the AI picture
  createdAt: Date;      // A timestamp of when they created it
}

const StorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  storyText: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// If the blueprint already exists, use it. Otherwise, create a new one!
const Story = mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);

export default Story;