pub fn split_text(text: &str, size: usize) -> Vec<String> {
    if text.len() < size {
        return vec![text.to_string()]
    }
    let text_after_split: Vec<&str> = text.split_inclusive(&[',','.','。','，','\n']).collect();
    let mut item_str = String::with_capacity(size + 64);
    let mut result = Vec::<String>::with_capacity(text.len() / size + 1);

    for &item in text_after_split.iter() {
        if item.len() + item_str.len() > size {
            result.push(item_str.clone());
            item_str.clear();
        }
        item_str.push_str(item);
    }

    return result;
}
