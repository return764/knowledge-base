import {API} from "../model";
import {Dataset} from "../model/dataset.ts";

export async function deleteDataset(id: string) {
    const dataset: Dataset = await API.dataset.queryById({id: id})
    await API.dataset.deleteById(id)
    await API.dataset.deleteDocumentsByDatasetId(dataset.kb_id, id)
}
