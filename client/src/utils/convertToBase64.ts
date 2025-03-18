export function convertToBase64(file: Blob): any{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Base64 string
      reader.onerror = (error) => reject(error);
    });
}
  