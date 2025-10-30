export const uploadByChunk = async (file, fileFor) => {
    const chunkSize = 2 * 1024 * 1024; // 2MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = file.name;
    const fileType = file.type;
    let fileId = Date.now().toString(); // Fallback if server doesn't return one

    try {
        // Initialize the chunked upload
        const initResponse = await useApi('/init_chunked_upload', {
            method: 'POST',
            body: {
                fileName,
                fileType,
                fileSize: file.size,
                totalChunks,
                for: fileFor
            }
        });

        // If your backend sends `fileId` back
        if (initResponse?.fileId) {
            fileId = initResponse.fileId;
        }

        // Upload each chunk
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', chunkIndex);
            formData.append('fileId', fileId);
            formData.append('fileName', fileName);
            formData.append('totalChunks', totalChunks);
            formData.append('for', fileFor);

            // `$fetch` does not support `onUploadProgress`, so if you need progress tracking
            // you'll need to use Axios for this part
            await useApi('/upload_chunk', {
                method: 'POST',
                body: formData
            });

            console.log(`Uploaded chunk ${chunkIndex + 1} of ${totalChunks}`);
        }

        // Complete the upload
        const completeResponse = await useApi('/complete_chunked_upload', {
            method: 'POST',
            body: {
                fileId,
                fileName,
                totalChunks,
                for: fileFor
            }
        });

        console.log('Saved: ', completeResponse);
        return completeResponse;

    } catch (error) {
        console.error('Chunked upload error:', error);
        throw error;
    }
};
