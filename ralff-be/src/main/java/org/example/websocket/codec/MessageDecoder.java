package org.example.websocket.codec;

import com.google.gson.Gson;
import jakarta.websocket.DecodeException;
import jakarta.websocket.Decoder;
import org.example.websocket.model.Message;

public class MessageDecoder implements Decoder.Text<Message> {
    private static final Gson gson = new Gson();

    @Override
    public Message decode(String s) throws DecodeException {
        return gson.fromJson(s, Message.class);
    }

    @Override
    public boolean willDecode(String s) {
        return s != null;
    }
}
