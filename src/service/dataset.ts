import {API} from "../api";

export async function deleteDataset(id: string) {
    await API.dataset.delete(id)
    await API.dataset.deleteDocumentsByDatasetId(id)
}
