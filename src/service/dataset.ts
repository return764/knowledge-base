import {API} from "../api";
import {Dataset} from "../api/dataset.ts";

export async function deleteDataset(id: string) {
    const dataset: Dataset = await API.dataset.queryById({id: id})
    await API.dataset.deleteById(id)
    await API.dataset.deleteDocumentsByDatasetId(id)
}
