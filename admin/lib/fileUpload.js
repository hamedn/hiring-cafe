import formidable from "formidable";
import parseForm from "./parseForm";
import { createWriteStream } from "./dbAdmin";
import { createReadStream } from "fs";

export default async function fileUpload({
    req,
    fileName,
    storageFileName,
    storagePath,
}) {
    const form = formidable();
    const { files } = await parseForm(form, req);
    const file = files[fileName];

    return new Promise((resolve, reject) => {
        createReadStream(file.filepath)
            .pipe(
                createWriteStream({
                    fileName: storageFileName,
                    path: storagePath,
                    contentType: file.mimetype,
                })
            ).on("finish", () => {
                resolve();
            }).on("error", (err) => {
                reject(err);
            });
    });
}
