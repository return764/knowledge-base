use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum ProgressEvent {
    #[serde(rename_all = "camelCase")]
    Started {
        progress_id: usize,
        content_length: usize,
    },
    // #[serde(rename_all = "camelCase")]
    // Progress {
    //     progress_id: usize,
    //     chunk_length: usize,
    // },
    #[serde(rename_all = "camelCase")]
    Finished {
        progress_id: usize,
    },
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum StreamMessageResponse {
    #[serde(rename_all = "camelCase")]
    AppendMessage {
        content: String,
    },
    #[serde(rename_all = "camelCase")]
    Error {
        message: String,
    },
    #[serde(rename_all = "camelCase")]
    Done,
}
