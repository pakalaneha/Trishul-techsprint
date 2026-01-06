import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const StorageService = {
    /**
     * Uploads an image from a URI to Firebase Storage
     */
    uploadImage: async (uri: string, path: string): Promise<string | null> => {
        try {
            console.log("Deep Upload starting for:", uri);

            // Step 1: More robust blob creation for Android
            const response = await fetch(uri);
            const blob = await response.blob();

            console.log("Blob ready. Size:", blob.size, "Type:", blob.type);

            const storageRef = ref(storage, path);

            // Step 2: Use resumable upload to catch progress and detailed errors
            return new Promise((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storageRef, blob);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error: any) => {
                        console.error("TASK ERROR CODE:", error.code);
                        console.error("TASK ERROR SERVER RESPONSE:", error.serverResponse);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error: any) {
            console.error("Outer Storage Error:", error);
            return null;
        }
    }
};
