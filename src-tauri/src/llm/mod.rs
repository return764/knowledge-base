use futures::StreamExt;
use langchain_rust::chain::{Chain, LLMChain};
use langchain_rust::prompt::PromptArgs;
use tauri::ipc::Channel;
use crate::command::event::StreamMessageResponse;

pub mod memory;
pub mod prompt;

pub trait ChainChannel {
    async fn stream_channel(
        &self,
        input_variables: PromptArgs,
        channel: Channel<StreamMessageResponse>
    );
}

impl ChainChannel for LLMChain {
    async fn stream_channel(&self, input_variables: PromptArgs, channel: Channel<StreamMessageResponse>) {
        let mut stream = match self.stream(input_variables).await {
            Ok(stream) => stream,
            Err(e) => {
                channel.send(StreamMessageResponse::Error {
                    message: format!("Error: {}", e),
                }).unwrap();
                return;
            }
        };

        while let Some(result) = stream.next().await {
            match result {
                Ok(value) => {
                    channel.send(StreamMessageResponse::AppendMessage {
                        content: value.content,
                    }).unwrap();
                },
                Err(e) => {
                    channel.send(StreamMessageResponse::Error {
                        message: format!("Error invoking LLMChain: {:?}", e),
                    }).unwrap();
                    panic!("Error invoking LLMChain: {:?}", e)
                },
            }
        }
        channel.send(StreamMessageResponse::Done).unwrap();
    }
}
