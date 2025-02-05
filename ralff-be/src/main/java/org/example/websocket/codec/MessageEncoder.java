package org.example.websocket.codec;

import com.google.gson.Gson;
import jakarta.websocket.EncodeException;
import jakarta.websocket.Encoder;
import org.example.websocket.model.Message;

public class MessageEncoder implements Encoder.Text<Message> {
    private static final Gson gson = new Gson();

    @Override
    public String encode(Message message) throws EncodeException {
        return gson.toJson(message, Message.class);
    }
}
