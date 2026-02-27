import { auth, storage, db } from "./firebaseAdmin";

export const createWriteStream = ({ fileName, path, contentType }) => {
  const ref = storage.bucket().file(path + "/" + fileName);

  const stream = ref.createWriteStream({
    gzip: true,
    contentType: contentType,
  });

  return stream;
};

export const makeFilePublicURL = async (filePath) => {
  const ref = storage.bucket().file(filePath);
  await ref.makePublic();
  return ref.publicUrl();
};

export const deleteFileByURL = async (filePath) => {
  const ref = storage.bucket().file(filePath);
  try {
    await ref.delete();
    return true;
  } catch (error) {
    return false;
  }
}

export const updateUserPhotoURL = async (uid, filePath) => {
  const photoURL = await makeFilePublicURL(filePath);
  await auth.updateUser(uid, { photoURL });
  await db.doc(`users/${uid}`).update({ photoURL });
  return photoURL;
};

export const listAllFilesInFolder = async (folderName) => {
  try {
    // List all files in the folder
    const [files] = await storage.bucket().getFiles({
      prefix: folderName,
    });
    const fileNames = files.map(file => {
      // Extract the file name from the full path
      const filePathParts = file.name.split("/");
      return filePathParts[filePathParts.length - 1];
    });

    return fileNames;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};
