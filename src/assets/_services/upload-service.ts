import * as api from "../api";

export const UploadService = {
  uploadFile,
  replaceProfilePicture,
  replaceMyProfilePicture,
  // updateFile,
  getFile,
};

async function uploadFile(
  image: File,
  userId: number,
  category: "PHOTO" | "CV" | "LETTER" | "OTHER",
  name: string,
  onUploadProgress: (percentCompleted: number) => void
) {
  try {
    const data: any = await api.createUpload(
      image,
      userId,
      category,
      name,
      onUploadProgress
    );

    return data;
  } catch (error) {
    return error;
  }
}

async function replaceProfilePicture(
  image: File,
  userId: number,
) {
  try {
    const data: any = await api.replaceProfilePicture(
      image,
      userId,
    );

    return data;
  } catch (error) {
    return error;
  }
}

async function replaceMyProfilePicture(
  image: File,
) {
  try {
    const data: any = await api.replaceMyProfilePicture(
      image,
    );

    return data;
  } catch (error) {
    return error;
  }
}

// async function updateFile(
//   image: File,
//   id: number,
//   category: "PHOTO" | "CV" | "LETTER" | "OTHER"
// ) {
//   try {
//     const data: any = await api.replaceUpload(image, id, category);

//     return data;
//   } catch (error) {
//     return error;
//   }
// }

async function getFile(path: string) {
  try {
    const { data }: any = await api.fetchUpload(path);

    // const imageObjectURL = URL.createObjectURL(data);

    return data;
  } catch (error) {
    return error;
  }
}
