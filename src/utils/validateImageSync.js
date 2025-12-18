import { supabase } from "@/lib/supabase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function validateImageSync() {
  // Step 1: Get all image references from Firestore
  const toursSnapshot = await getDocs(collection(db, "tours"));
  const firestoreImageUrls = new Set();

  toursSnapshot.forEach((doc) => {
    const data = doc.data();
    // Add cover image
    if (data.media?.coverImage) firestoreImageUrls.add(data.media.coverImage);
    // Add gallery images
    data.media?.gallery?.forEach((url) => firestoreImageUrls.add(url));
  });

  // Step 2: List all images in Supabase storage
  const { data: storageFiles, error } = await supabase.storage
    .from("tour-images") // Your bucket name
    .list("tours"); // Your folder path

  if (error) throw error;

  // Step 3: Build storage URLs to check
  const storageImageUrls = new Set(
    storageFiles.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("tour-images").getPublicUrl(`tours/${file.name}`);
      return publicUrl;
    })
  );

  // Step 4: Find orphans
  const results = {
    firestoreOrphans: [], // URLs in Firestore but not in storage
    storageOrphans: [],
  };

  // Check Firestore references
  firestoreImageUrls.forEach((url) => {
    if (!storageImageUrls.has(url)) {
      results.firestoreOrphans.push(url);
    }
  });

  // Check storage files
  storageFiles.forEach((file) => {
    const expectedUrl = supabase.storage.from("tour-images").getPublicUrl(`tours/${file.name}`)
      .data.publicUrl;

    if (!firestoreImageUrls.has(expectedUrl)) {
      results.storageOrphans.push(`tours/${file.name}`);
    }
  });

  return results;
}
