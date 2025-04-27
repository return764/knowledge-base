import {API} from "../package/api";
import {deleteDataset} from "./dataset.ts";

export async function deleteKnowledgeBase(id: string) {
    const datasets = await API.dataset.queryAllByKbId(id)
    // TODO 遍历删除需要优化，使用一个sql解决
    for (const dt of datasets) {
        await deleteDataset(dt.id)
    }
    await API.knowledgeBase.delete(id);
}
